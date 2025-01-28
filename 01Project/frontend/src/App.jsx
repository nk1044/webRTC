import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './Providers/Socket';
import Home from './Pages/Home';
import Room from './Pages/Room';


function App() {


  return (
    <>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </SocketProvider>
    </>
  )
}

export default App
