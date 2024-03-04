import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-lvh h-full w-full flex justify-center items-center">
      <div className="max-w-md flex flex-col w-full">
        <button
          className="h-10 w-full bg-blue-400 rounded-xl mt-4 text-base font-semibold "
          onClick={() => {
            navigate("/create-room");
          }}
        >
          Create Room
        </button>
        <button
          className="h-10 w-full bg-indigo-600 rounded-xl mt-4 text-base font-semibold "
          onClick={() => {
            navigate("/join-room");
          }}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
