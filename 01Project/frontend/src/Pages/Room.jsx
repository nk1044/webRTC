import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../Providers/Socket';
import { usePeer } from '../Providers/Peer';

function Room() {
    const { id } = useParams();
    const socket = useSocket();
    const { peer, CreateOffer, CreateAnswer, setRemoteAnswer, SendTracks, RemoteStream } = usePeer();
    const [MyStream, setMyStream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState(null);

    // Initialize local media stream
    const getUserMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMyStream(stream);
            console.log("Local stream obtained:", stream);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    }, []);

    // Handle when a new user joins the room
    const handleUserJoined = useCallback(
        async (data) => {
            console.log("User joined:", data);
            const offer = await CreateOffer();
            socket.emit('call-user', { offer: offer, email: data?.email });
            setRemoteEmailId(data?.email);
        },
        [CreateOffer, socket]
    );

    // Handle incoming call
    const handleIncomingCall = useCallback(
        async (data) => {
            console.log("Incoming call:", data);
            const answer = await CreateAnswer(data?.offer);
            socket.emit('accept-call', { answer: answer, email: data?.email });
            setRemoteEmailId(data?.email);
        },
        [CreateAnswer, socket]
    );

    // Handle call acceptance
    const handleCallAccepted = useCallback(
        async (data) => {
            console.log("Call accepted:", data?.answer);
            await setRemoteAnswer(data?.answer);
        },
        [setRemoteAnswer]
    );

    // Handle renegotiation
    const handleNegotiation = useCallback(async () => {
        try {
            const localOffer = await peer.createOffer();
            await peer.setLocalDescription(localOffer);
            socket.emit('call-user', { offer: localOffer, email: remoteEmailId });
            console.log("Negotiation needed, offer sent:", localOffer);
        } catch (error) {
            console.error("Error during negotiation:", error);
        }
    }, [peer, remoteEmailId, socket]);

    // Effect: Attach event listeners to `peer`
    useEffect(() => {
        peer.addEventListener('negotiationneeded', handleNegotiation);
        return () => {
            peer.removeEventListener('negotiationneeded', handleNegotiation);
        };
    }, [peer, handleNegotiation]);

    // Effect: Initialize local media stream
    useEffect(() => {
        getUserMedia();

        // Clean up the local media stream on unmount
        return () => {
            if (MyStream) {
                MyStream.getTracks().forEach((track) => track.stop());
                console.log("Local stream stopped.");
            }
        };
    }, [getUserMedia]);

    // Effect: Manage socket events
    useEffect(() => {
        socket.on('user-joined', handleUserJoined);
        socket.on('user-called', handleIncomingCall);
        socket.on('call-accepted', handleCallAccepted);

        return () => {
            socket.off('user-joined', handleUserJoined);
            socket.off('user-called', handleIncomingCall);
            socket.off('call-accepted', handleCallAccepted);
        };
    }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

    return (
        <div>
            <h1 className='text-3xl font-bold'>Room: {id}</h1>
            <h1 className='text-3xl font-bold'>You are connected to: {remoteEmailId || "No one yet"}</h1>
            <button
                onClick={() => {
                    if (MyStream) {
                        SendTracks(MyStream);
                        console.log("Tracks sent:", MyStream);
                    } else {
                        console.error("No local stream available to send.");
                    }
                }}
            >
                Send My Stream
            </button>
            <div>
                <h2>My Stream:</h2>
                <video
                    playsInline
                    muted
                    autoPlay
                    ref={(video) => {
                        if (video && MyStream) {
                            video.srcObject = MyStream;
                        }
                    }}
                />
            </div>
            <div>
                <h2>Remote Stream:</h2>
                <video
                    playsInline
                    autoPlay
                    ref={(video) => {
                        if (video && RemoteStream) {
                            video.srcObject = RemoteStream;
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default Room;
