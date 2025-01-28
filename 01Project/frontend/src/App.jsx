import { useCallback, useState, useEffect } from 'react'
import { start , CreateOffer} from './webrtc/webrtc.js'


function App() {

  const [Allow, setAllow] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  const Start = useCallback(async () => {
    const stream = await start();
    setLocalStream(stream);
  }, []);

  const CallFunctions = async () => {
    await Start();
    await CreateOffer();
  }

  useEffect(() => {
    if (Allow) {
      CallFunctions();
    }
  }, [Allow, Start]);

  useEffect(() => {
    console.log('Allow:', Allow);
    if (Allow && localStream) {
      const localVideo = document.getElementById('localVideo');
      localVideo.srcObject = localStream;
    }
    else {
      const localVideo = document.getElementById('localVideo');
      localVideo.srcObject = null;
    }
  }, [Allow, localStream]);



  return (
    <>
      <div className="flex items-center justify-center gap-4 p-10 h-screen">
        <div className='flex flex-col items-center gap-4'>
          <video
            id="localVideo"
            className="border-2 border-red-500 w-[20rem] h-[20rem] bg-black"
            autoPlay playsInline></video>
          <button
            onClick={() => setAllow((prev) => !prev)}

          >Camera</button>
        </div>

        <div>
          <video
            id="remoteVideo"
            className="border-2 border-blue-500  w-[20rem] h-[20rem] bg-black"
            autoPlay playsInline></video>
        </div>
      </div>
    </>
  )
}

export default App
