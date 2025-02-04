import React, { useState, useRef, useEffect } from 'react';

function Call({ roomId, userId }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

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
            className="w-full h-full object-cover rounded-lg"
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
          className={`p-3 px-6 text-white font-medium rounded-lg transition duration-200 shadow-md ${
            video ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {video ? 'Video On' : 'Video Off'}
        </button>
        <button
          onClick={() => setAudio(!audio)}
          className={`p-3 px-6 text-white font-medium rounded-lg transition duration-200 shadow-md ${
            audio ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {audio ? 'Audio On' : 'Audio Off'}
        </button>
      </div>
    </div>
  );
}

export default Call;
