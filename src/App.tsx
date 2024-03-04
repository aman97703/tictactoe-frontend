import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import "./App.css";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import { SocketProvider } from "./SocketContext";

import { Socket, io } from "socket.io-client";
import { useEffect } from "react";
import { RoomProvider } from "./RoomContext";
const App = () => {
  let socket: Socket = io("http://localhost:5000", {
    autoConnect: false,
  });
  useEffect(() => {
    // Connect to socket when component mounts
    socket.connect();
    // Disconnect from socket when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="min-h-lvh w-full bg-[#333] text-white">
      <SocketProvider socket={socket}>
        <RoomProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-room" element={<CreateRoom />} />
              <Route path="/join-room" element={<JoinRoom />} />
              <Route path="/game/:id" element={<Game />} />
            </Routes>
          </Router>
        </RoomProvider>
      </SocketProvider>
    </div>
  );
};

export default App;
