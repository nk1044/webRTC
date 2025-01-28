import React from "react";

const PeerContext = React.createContext();


export const PeerProvider = ({ children }) => {
    return <PeerContext.Provider value={{}}>{children}</PeerContext.Provider>;
};