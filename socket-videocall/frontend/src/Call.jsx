import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io } from "socket.io-client";
export const socket = io('http://localhost:8000');


function Call({ roomId, userId }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const JoinRoom = useCallback(async ({ roomId, userId }) => {
    socket.emit('join-room', { roomId, userId });
  }, []);

  const SendMessages = useCallback(async ({ roomId, userId, message }) => {
    socket.emit('send-message', { roomId, userId, message });
  }, []);

  useEffect(() => {
    JoinRoom({ roomId, userId });
  }, []);

  useEffect(() => {
    const getMedia = async () => {
        if(video || audio) {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: video,
                audio: audio,
            });
            setLocalStream(stream);
            socket.emit('send-stream', {
              roomId: roomId,
              userId: userId,
              stream: stream,
          });
        }
        else {
            setLocalStream(null);
        }
    };
    getMedia();
  }, [audio, video]);

  useEffect(() => {
    socket.on('user-connected', (data) => {
      console.log('User Connected:- ', data);
    })
    socket.on('receive-message', (data) => {
      console.log('Message Received:- ', data);
    })
    socket.on('receive-stream', (data) => {
      const { userId, stream } = data;
      if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
      }
  });

    return () => {
      socket.off('user-connected');
      socket.off('receive-message');
      socket.off('receive-stream');
    }
  }, [socket]);

  useEffect(() => {
    if (localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900 text-white">
      <h2 className="text-2xl font-semibold mb-4">Room: {roomId}</h2>

      <div className="flex justify-center items-center gap-4 w-full max-w-5xl">
        {/* Local Video */}
        <div className="w-[40%] h-64 border-4 border-blue-500 rounded-lg overflow-hidden bg-black flex justify-center items-center">
          <video
            autoPlay
            muted
            ref={localVideoRef}
            className="w-full h-full object-cover rounded-lg transform scale-x-[-1]"
          ></video>

        </div>

        {/* Remote Video */}
        <div className="w-[40%] h-64 border-4 border-green-500 rounded-lg overflow-hidden bg-black flex justify-center items-center">
          <video
            autoPlay
            ref={remoteVideoRef}
            className="w-full h-full object-cover rounded-lg"
          ></video>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setVideo(!video)}
          className={`p-3 px-6 text-white font-medium rounded-lg transition duration-200 shadow-md ${video ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
            }`}
        >
          {video ? 'Video On' : 'Video Off'}
        </button>
        <button
          onClick={() => setAudio(!audio)}
          className={`p-3 px-6 text-white font-medium rounded-lg transition duration-200 shadow-md ${audio ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
            }`}
        >
          {audio ? 'Audio On' : 'Audio Off'}
        </button>
      </div>
    </div>
  );
}

export default Call;
