import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../SocketContext";
import { Snackbar, SnackbarContent } from "@mui/material";
import { useRoomContext } from "../RoomContext";

const JoinRoom = () => {
  const [value, setValue] = useState<string>("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();
  const { setRoom } = useRoomContext();

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleCreateRoom = () => {
    socket.emit("joinRoom", {
      name,
      id: value,
    });
    socket.on("notfound", () => {
      handleClick();
    });
    socket.on("joinRoomSuccess", (room) => {
      setRoom(room);
      navigate(`/game/${value}`);
    });
  };

  return (
    <div className="min-h-lvh h-full w-full flex justify-center items-center">
      <div className="max-w-md flex flex-col w-full">
        <input
          type="text"
          className="rounded-lg px-3 py-2 text-base font-bold w-full text-black disabled:bg-white "
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="rounded-lg px-3 py-2 text-base font-bold w-full text-black disabled:bg-white mt-4"
          placeholder="Enter Room Id"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className="h-10 w-full bg-blue-400 rounded-xl mt-4 text-base font-semibold "
          onClick={() => handleCreateRoom()}
          disabled={!name.trim() || !value}
        >
          Join Room
        </button>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <SnackbarContent
          style={{
            backgroundColor: "whitesmoke",
            color: "black",
          }}
          message={<span id="client-snackbar">Room not found</span>}
        />
      </Snackbar>
    </div>
  );
};

export default JoinRoom;
