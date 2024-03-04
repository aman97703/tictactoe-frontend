import React, { createContext, useContext, useState } from "react";

interface player {
  name: string;
  playerType: "X" | "O";
  id: string;
  socketID: string;
}
export interface RoomModel {
  occupancy: number;
  players: [player];
  isJoin: boolean;
  turn: string;
  turnIndex: 0 | 1;
  id: string;
}
interface RoomContextProps {
  room: RoomModel | null;
  setRoom: React.Dispatch<React.SetStateAction<RoomModel | null>>;
}

const RoomContext = createContext<RoomContextProps | null>(null);

export const useRoomContext = (): RoomContextProps => {
  const context = useContext(RoomContext);
  if (!context)
    throw new Error("useRoomContext must be used within a RoomProvider");
  return context;
};

interface RoomProviderProps {
  children: React.ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  // Initialize room state
  const [room, setRoom] = useState<RoomModel | null>(null);

  // Combine the state into the context value
  const contextValue: RoomContextProps = {
    room,
    setRoom,
  };

  return (
    <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>
  );
};
