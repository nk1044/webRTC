import React, {useEffect, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../Providers/Socket';
import {usePeer} from '../Providers/Peer';

function Room() {
    const {id} = useParams();
    const socket = useSocket();
    const {peer, CreateOffer} = usePeer();

    const handleUserJoined = useCallback(
        async(data) => {
        console.log("user joined", data);
        const offer = await CreateOffer();
        socket.emit('call-user', {offer:offer, email: data?.email});
    }, [peer, CreateOffer])

    const handleIncomingCall = useCallback(
        async(data) => {
        console.log("Incoming call:-", data);
        
    }, [])

    useEffect(()=>{
        socket.on('user-joined', handleUserJoined);
        socket.on('user-called', handleIncomingCall);

        return ()=>{
            socket.off('user-joined', handleUserJoined);
            socket.off('user-called', handleIncomingCall);
        }
    }, [socket, id])

  return (
    <div className=''>
            <h1 className='text-3xl font-bold'>Room: {id}</h1>
        
    </div>
  )
}

export default Room