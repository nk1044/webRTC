let localStream = null;
let remoteStream = null;

const server = {
    iceServers: [
        {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
} 




const constraints = {
  video: true,
  audio: false
}


const start = async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    return localStream;
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
}


const CreateOffer = async () => {
    const peerConnection = new RTCPeerConnection(server);

    if (!localStream) {
        console.error('Local stream is not initialized. Call start() first.');
        return;
    }

    remoteStream = new MediaStream();
    document.getElementById('remoteVideo').srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track)=>{
            remoteStream.addTrack(track);
        })
    }

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('New Ice Candidate:', event.candidate);
        }
    }

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Offer:', offer);
}



export { 
    start, 
    CreateOffer,
 }