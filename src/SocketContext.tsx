import React, { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket;
  children: React.ReactNode;
}

// Create context for socket
const SocketContext = createContext<Socket | undefined>(undefined);

// Custom hook to use socket context
export const useSocket = (): Socket => {
  const socket = useContext(SocketContext);
  if (!socket)
    throw new Error("useSocket must be used within a SocketProvider");
  return socket;
};

// Socket provider component
export const SocketProvider: React.FC<SocketContextProps> = ({
  children,
  socket,
}) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);
