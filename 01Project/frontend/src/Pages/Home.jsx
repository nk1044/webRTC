import React , {useState, useEffect, useCallback} from 'react';
import {useSocket} from '../Providers/Socket';
import { useNavigate } from 'react-router-dom';

function Home() {

  const socket = useSocket();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSubmit = () => {
    socket.emit('join-room', {email:email, roomId: roomId});
  }

  const handleRoomJoined = useCallback(({roomId}) => {
    console.log(roomId);
    navigate(`/room/${roomId}`);
  }, [navigate])

  useEffect(()=>{
    socket.on('joined-room', (data)=>{
      handleRoomJoined(data);
    })

    return ()=>{
      socket.off('joined-room', handleRoomJoined);
    }
  },[socket, handleRoomJoined])


  return (
    <div>
        <div className='flex flex-col items-center justify-center 
        h-screen'>
            <div className='flex flex-col items-center gap-3 justify-center border-2 border-gray-500 rounded-xl p-5'>
            <input 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className='p-1 border border-gray-300 rounded-xl'
            type="text" placeholder='Enter your email'/>
            <input 
            value={roomId}
            onChange={(e)=>setRoomId(e.target.value)}
            className='p-1 border border-gray-300 rounded-xl'
            type="text" placeholder='Enter Room code'/>
            <button
            className='w-full p-1 border border-blue-300 bg-blue-300 text-white rounded-xl cursor-pointer'
            onClick={handleSubmit}
            >Submit</button>
            </div>
        </div>
    </div>
  )
}

export default Home