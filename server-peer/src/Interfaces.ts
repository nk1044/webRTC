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

interface JoinChatRoomPayload {
    roomId: string;
    userId: string;
}

export {
    OfferPayload,
    AnswerPayload,
    IceCandidatePayload,
    JoinChatRoomPayload
}