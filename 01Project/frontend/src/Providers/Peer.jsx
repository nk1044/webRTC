import React, { useMemo, useState, useCallback, useEffect } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = ({ children }) => {
    const [RemoteStream, setRemoteStream] = useState(null);

    // Create the peer connection instance
    const peer = useMemo(() => {
        return new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                    ],
                },
            ],
        });
    }, []);

    // Create an SDP offer
    const CreateOffer = async () => {
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    };

    // Create an SDP answer
    const CreateAnswer = async (offer) => {
        if (peer.signalingState === 'closed') {
            console.error('Cannot create answer: PeerConnection is closed.');
            return;
        }
    
        try {
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            console.log("Answer created and set:", answer);
            return answer;
        } catch (error) {
            console.error("Error creating answer:", error);
        }
    };
    

    // Set the remote SDP answer
    const setRemoteAnswer = async (answer) => {
        try {
            if (peer.signalingState !== "stable") {
                await peer.setRemoteDescription(answer);
            } else {
                console.warn("SDP answer already applied or signaling state is stable");
            }
        } catch (error) {
            console.error("Error setting remote answer:", error);
        }
    };

    // Add tracks to the peer connection
    const SendTracks = async (stream) => {
        if (!stream) {
            console.error("No stream available to send");
            return;
        }
        try {
            const tracks = stream.getTracks();
            tracks.forEach((track) => {
                console.log("Adding track:", track);
                peer.addTrack(track, stream);
            });
        } catch (error) {
            console.error("Error sending tracks:", error);
        }
    };

    // Handle incoming tracks and update RemoteStream
    const handleStreams = useCallback((event) => {
        console.log("Track event:", event);
        setRemoteStream((prevStream) => {
            if (!prevStream) {
                const newStream = new MediaStream();
                newStream.addTrack(event.track);
                return newStream;
            }
            // Avoid adding duplicate tracks
            if (!prevStream.getTracks().includes(event.track)) {
                prevStream.addTrack(event.track);
            }
            return prevStream;
        });
    }, []);

    // Attach event listener for incoming tracks
    useEffect(() => {
        peer.addEventListener("track", handleStreams);

        return () => {
            peer.removeEventListener("track", handleStreams);
            peer.close(); // Clean up the peer connection
        };
    }, [peer, handleStreams]);

    return (
        <PeerContext.Provider
            value={{
                peer,
                CreateOffer,
                CreateAnswer,
                setRemoteAnswer,
                SendTracks,
                RemoteStream,
            }}
        >
            {children}
        </PeerContext.Provider>
    );
};
