import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../Providers/Socket';

function Room() {
    const {id} = useParams();
    const socket = useSocket();

    const handleUserJoined = (data) => {
        console.log(data);
    }


    useEffect(()=>{
        socket.on('user-joined', handleUserJoined);
    }, [socket, id])

  return (
    <div className=''>
            <h1 className='text-3xl font-bold'>Room: {id}</h1>
        
    </div>
  )
}

export default Room