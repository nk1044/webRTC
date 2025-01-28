import React, {useEffect, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../Providers/Socket';
import {usePeer} from '../Providers/Peer';

function Room() {
    const {id} = useParams();
    const socket = useSocket();
    const {peer, CreateOffer, CreateAnswer, setRemoteAnswer} = usePeer();

    const handleUserJoined = useCallback(
        async(data) => {
        console.log("user joined", data);
        const offer = await CreateOffer();
        socket.emit('call-user', {offer:offer, email: data?.email});
    }, [peer, CreateOffer])

    const handleIncomingCall = useCallback(
        async(data) => {
        console.log("Incoming call:-", data);
        const answer = await CreateAnswer(data?.offer);
        socket.emit('accept-call', {answer: answer, email: data?.email});
    }, [])

    const handleCallAccepted = useCallback(
        async(data) => {
        console.log("Aceepted call:-", data?.answer);
        await setRemoteAnswer(data?.answer);

    }, [])

    useEffect(()=>{
        socket.on('user-joined', handleUserJoined);
        socket.on('user-called', handleIncomingCall);
        socket.on('call-accepted', handleCallAccepted);

        return ()=>{
            socket.off('user-joined', handleUserJoined);
            socket.off('user-called', handleIncomingCall);
            socket.off('call-accepted', handleCallAccepted);
        }
    }, [socket, id])

  return (
    <div className=''>
            <h1 className='text-3xl font-bold'>Room: {id}</h1>
        
    </div>
  )
}

export default Room