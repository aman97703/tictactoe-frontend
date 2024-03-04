import { customAlphabet } from "nanoid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../SocketContext";
import { useRoomContext } from "../RoomContext";

const CreateRoom = () => {
  const socket = useSocket();
  const { setRoom } = useRoomContext();
  useEffect(() => {
    socket.on("createRoomSuccess", (data) => {
      setRoom(data);
      // Handle the event data as needed
    });
  }, []);
  const [value, setValue] = useState<string>("");
  const [name, setName] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const handleGenerateRoomId = () => {
    const nanoid = customAlphabet(
      "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      16
    );
    const id = nanoid();
    setValue(id);
    setIsDisabled(true);
  };

  const handleCreateRoom = () => {
    socket.emit("createRoom", {
      name,
      id: value,
    });
    navigate(`/game/${value}`);
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
          disabled={isDisabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value ? (
          <button
            className="h-10 w-full bg-blue-400 rounded-xl mt-4 text-base font-semibold "
            onClick={() => handleCreateRoom()}
            disabled={!name.trim()}
          >
            Create Room
          </button>
        ) : (
          <button
            className="h-10 w-full bg-blue-400 rounded-xl mt-4 text-base font-semibold "
            onClick={handleGenerateRoomId}
          >
            Generate New Room Id
          </button>
        )}
        <button
          className="h-10 w-full bg-indigo-600 rounded-xl mt-4 text-base font-semibold "
          onClick={() => {
            setValue("");
            setIsDisabled(false);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
