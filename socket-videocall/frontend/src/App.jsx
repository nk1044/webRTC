import React, { useState } from 'react';
import Call from './Call';

function App() {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [page, setPage] = useState('home');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!roomId || !userId) {
      alert('Please enter both Room ID and User ID');
      return;
    }
    else setPage('call');
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900 text-white">
      {/* "Join Another Room" Button (Always Visible) */}
      {page === 'call' && (
        <div className="absolute top-4 right-4">
        <button
          onClick={() => setPage('home')}
          className="p-2 px-4 bg-green-500 hover:bg-green-600 transition duration-200 text-white font-semibold rounded-lg shadow-md"
        >
          Join another room
        </button>
      </div>
      )}

      <h1 className="text-3xl font-bold mt-6">Socket Video Call</h1>

      {page === 'home' ? (
        <div className="flex flex-col items-center gap-4 p-6 border border-gray-700 rounded-xl shadow-lg bg-gray-800 mt-4">
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="p-2 w-72 rounded-md border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="p-2 w-72 rounded-md border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          />
          <button
            onClick={handleSubmit}
            className="p-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-200 shadow-md"
          >
            Join Room
          </button>
        </div>
      ) : (
        <Call roomId={roomId} userId={userId} />
      )}
    </div>
  );
}

export default App;
