import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function Call({ roomId, userId }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        socket.emit("join-room", { roomId, userId });

        // Initialize WebRTC Peer Connection
        peerConnection.current = new RTCPeerConnection({
          iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" }
          ]
      });
      

        // Add local stream tracks to peer connection
        stream.getTracks().forEach((track) =>
          peerConnection.current.addTrack(track, stream)
        );

        // When receiving remote stream
        peerConnection.current.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          remoteVideoRef.current.srcObject = event.streams[0];
        };

        // When ICE candidate is generated
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { roomId, candidate: event.candidate });
          }
        };

        socket.on("offer", async ({ offer }) => {
          console.log("Received offer:", offer);
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.emit("answer", { roomId, answer });
      });
      
      socket.on("answer", async ({ answer }) => {
          console.log("Received answer:", answer);
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      });
      

      socket.on("ice-candidate", async ({ candidate }) => {
        console.log("Received ICE candidate:", candidate);
        if (candidate) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
    });
    

        if (userId === "host") {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          socket.emit("offer", { roomId, offer });
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    initMedia();

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      peerConnection.current?.close();
    };
  }, [roomId, userId]);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900 text-white p-6">
    <h2 className="text-3xl font-bold mb-6 text-blue-400">Room: {roomId}</h2>
  
    <div className="flex justify-center items-center gap-6 w-full max-w-4xl">
      {/* Local Video */}
      <div className="w-1/2 h-72 border-4 border-blue-500 rounded-xl overflow-hidden bg-black flex justify-center items-center shadow-lg">
        <video autoPlay muted ref={localVideoRef} className="w-full h-full object-cover transform scale-x-[-1]"></video>
      </div>
  
      {/* Remote Video */}
      <div className="w-1/2 h-72 border-4 border-green-500 rounded-xl overflow-hidden bg-black flex justify-center items-center shadow-lg">
        <video autoPlay ref={remoteVideoRef} className="w-full h-full object-cover transform scale-x-[-1]"></video>
      </div>
    </div>
  
    <p className="mt-6 text-gray-300 text-lg">
      Waiting for another participant to join...
    </p>
  </div>
  
  );
}

export default Call;
