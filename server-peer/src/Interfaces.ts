interface OfferPayload {
    roomId: string;
    offer: RTCSessionDescriptionInit;
}

interface AnswerPayload {
    roomId: string;
    answer: RTCSessionDescriptionInit;
}
  

interface IceCandidatePayload {
    roomId: string;
    candidate: RTCIceCandidateInit;
}

export {
    OfferPayload,
    AnswerPayload,
    IceCandidatePayload
}