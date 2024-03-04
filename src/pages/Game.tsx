import { forwardRef, useEffect, useState } from "react";
import { useSocket } from "../SocketContext";
import { RoomModel, useRoomContext } from "../RoomContext";
import WaitingComp from "./WaitingComp";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Snackbar,
  SnackbarContent,
} from "@mui/material";

import { TransitionProps } from "@mui/material/transitions";
import { useNavigate } from "react-router-dom";
import ChatIcon from "../assets/ChatIcon";
import SentIcon from "../assets/SentIcon";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface messageType {
  content: string;
  id: string;
}

const Game = () => {
  const socket = useSocket();
  const { room, setRoom } = useRoomContext();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState<string>("");
  const [isRequestedToPlayAgain, setIsRequestedToPlayAgain] = useState(false);
  const [getRequestedToPlayAgain, setGetRequestedToPlayAgain] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const currentPlayer = room?.players.find((val) => val.socketID === socket.id);
  const opponetPlayer = room?.players.find((val) => val.socketID !== socket.id);
  const turnedPlayer = room?.players.find((val) => val.socketID === room.turn);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<messageType[]>([]);
  const [messagevalue, setMessageValue] = useState<string>("");

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [snakeOpen, setsnakeOpen] = useState(false);

  const handleClickSnale = () => {
    setsnakeOpen(true);
  };

  const checkWinner = (board: string[] | null[]) => {
    // checking rows
    if (board[0] === board[1] && board[0] === board[2] && board[0] !== null) {
      setWinner(board[0]);
      handleClickOpen();
      return;
    }
    if (board[3] === board[4] && board[3] === board[5] && board[3] !== null) {
      setWinner(board[3]);
      handleClickOpen();
      return;
    }
    if (board[6] === board[7] && board[6] === board[8] && board[6] !== null) {
      setWinner(board[6]);
      handleClickOpen();
      return;
    }
    // checking columns
    if (board[0] === board[3] && board[0] === board[6] && board[0] !== null) {
      setWinner(board[0]);
      handleClickOpen();
      return;
    }
    if (board[1] === board[4] && board[1] === board[7] && board[1] !== null) {
      setWinner(board[1]);
      handleClickOpen();
      return;
    }
    if (board[2] === board[5] && board[2] === board[8] && board[2] !== null) {
      setWinner(board[2]);
      handleClickOpen();
      return;
    }

    // checking Diagonals
    if (board[0] === board[4] && board[0] === board[8] && board[0] !== null) {
      setWinner(board[0]);
      handleClickOpen();
      return;
    }
    if (board[2] === board[4] && board[2] === board[6] && board[2] !== null) {
      setWinner(board[2]);
      handleClickOpen();
      return;
    }
    if (board.every((val) => val != null)) {
      setWinner("draw");
      handleClickOpen();
      return;
    }
  };

  useEffect(() => {
    function handleTapped(data: {
      index: number;
      choice: string;
      boardData: string[] | null[];
    }) {
      const { index, choice, boardData } = data;
      boardData[index] = choice;
      setBoard(boardData);
      checkWinner(boardData);
    }
    function handleRoomUpdate(data: { room: RoomModel }) {
      const { room } = data;
      setRoom(room);
    }
    function handlePlayerLeave(room: RoomModel) {
      handleClose();
      handleClickSnale();
      const newBoard = Array(9).fill(null);
      setBoard(newBoard);
      setRoom(room);
    }
    function handleRequesttoplayagainfromuser() {
      setGetRequestedToPlayAgain(true);
    }
    function handleAcceptrequestfromuser() {
      setIsRequestedToPlayAgain(false);
      setGetRequestedToPlayAgain(false);
    }
    function handleNewGame(room: RoomModel) {
      handleClose();
      setIsRequestedToPlayAgain(false);
      setGetRequestedToPlayAgain(false);
      setRoom(room);
      const newBoard = Array(9).fill(null);
      setBoard(newBoard);
    }
    function handleReceiveMessage(data: { message: string; id: string }) {
      const { message, id } = data;
      const messageObj = {
        content: message,
        id: id,
      };
      setMessages((prev) => [...prev, messageObj]);
    }

    socket.on("tapped", handleTapped);
    socket.on("roomupdate", handleRoomUpdate);
    socket.on("playerLeave", handlePlayerLeave);
    socket.on("requesttoplayagainfromuser", handleRequesttoplayagainfromuser);
    socket.on("acceptrequestfromuser", handleAcceptrequestfromuser);
    socket.on("newgame", handleNewGame);
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("tapped", handleTapped);
      socket.off("roomupdate", handleRoomUpdate);
      socket.off("playerLeave", handlePlayerLeave);
      socket.off(
        "requesttoplayagainfromuser",
        handleRequesttoplayagainfromuser
      );
      socket.off("acceptrequestfromuser", handleAcceptrequestfromuser);
      socket.off("newgame", handleNewGame);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  const handleData = (index: number) => {
    if (turnedPlayer?.id !== currentPlayer?.id) {
      return;
    }
    if (board[index]) {
      return;
    }
    if (room) {
      const newBoard = [...board];
      newBoard[index] = turnedPlayer?.playerType;
      socket.emit("tap", {
        id: room.id,
        index: index,
        boardData: newBoard,
      });
      setBoard(newBoard);
      checkWinner(newBoard);
    }
  };

  const handleRequest = () => {
    socket.emit("requesttoplayagain", {
      id: room?.id,
    });
    setIsRequestedToPlayAgain(true);
  };
  const handleAccpetRequest = () => {
    socket.emit("acceptrequest", {
      id: room?.id,
    });
    handleClose();
    setIsRequestedToPlayAgain(false);
    setGetRequestedToPlayAgain(false);
    const newBoard = Array(9).fill(null);
    setBoard(newBoard);
  };
  const handleExit = () => {
    socket.emit("exit", {
      id: room?.id,
    });
    handleClose();
    navigate("/");
  };

  const handleSendMessage = (msg: string) => {
    socket.emit("sendMessage", {
      id: room?.id,
      message: msg,
      userid: currentPlayer?.id,
    });
    const messageObj = {
      content: msg,
      id: currentPlayer?.id as string,
    };
    setMessages((prev) => [...prev, messageObj]);
    setMessageValue("");
  };

  return (
    <div
      className="min-h-lvh h-full w-full flex justify-center items-center flex-col p-5 relative"
      onClick={() => {
        setShowMessageBox(false);
      }}
    >
      {room ? (
        room.isJoin ? (
          <WaitingComp />
        ) : (
          <div>
            <div className="flex justify-between">
              <div
                className={
                  "px-3 py-2 rounded-md " +
                  (turnedPlayer?.name === currentPlayer?.name
                    ? "bg-orange-400"
                    : "bg-gray-700")
                }
              >
                <p>You</p>
              </div>
              <div
                className={
                  "px-3 py-2 rounded-md " +
                  (turnedPlayer?.name === opponetPlayer?.name
                    ? "bg-blue-400"
                    : "bg-gray-700")
                }
              >
                <p>{opponetPlayer?.name}</p>
              </div>
            </div>
            <p className="font-bold text-white text-lg mt-6 text-center">
              {turnedPlayer?.name === currentPlayer?.name
                ? "Your"
                : turnedPlayer?.name}
              &apos;s turn
            </p>
            <div className="grid-cols-3 grid gap-0 mt-2">
              {board.map((data, i) => (
                <div
                  className="md:h-[120px] sm:h-[100px] md:w-[120px] h-20 sm:w-[100px] w-20 bg-[#222] border border-slate-400 board flex justify-center items-center"
                  key={i}
                  onClick={() => handleData(i)}
                >
                  <p className="text-[120px] font-normal">{data}</p>
                </div>
              ))}
            </div>
            <div className="">
              {showMessageBox && (
                <div
                  className="h-[200px] w-[200px] bg-white absolute bottom-20 right-1/4 rounded-md flex flex-col gap-1 text-black px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="border-b-2 border-black py-1 flex justify-center items-center">
                    <p>Chat Box</p>
                  </div>
                  <div className="flex-1 overflow-hidden overflow-y-auto flex flex-col gap-1">
                    {messages.length > 0 &&
                      messages.map((msg, i) => (
                        <div
                          className={
                            msg.id === currentPlayer?.id
                              ? "self-end bg-orange-400 rounded-md p-1"
                              : "self-start bg-blue-400 rounded-md p-1"
                          }
                          key={i}
                        >
                          <p className="font-semibold text-sm">{msg.content}</p>
                        </div>
                      ))}
                  </div>
                  <div className="border-t-2 border-black py-1 flex items-center">
                    <input
                      type="text"
                      placeholder="type a message..."
                      className="outline-none px-2 w-full"
                      value={messagevalue}
                      onChange={(e) => setMessageValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage(messagevalue);
                        }
                      }}
                    />
                    <IconButton onClick={() => handleSendMessage(messagevalue)}>
                      <SentIcon />
                    </IconButton>
                  </div>
                </div>
              )}
              <button
                className="absolute bottom-4 right-1/4 h-12 w-12 rounded-full bg-blue-400 flex justify-center items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMessageBox(!showMessageBox);
                }}
              >
                <ChatIcon />
              </button>
            </div>
          </div>
        )
      ) : (
        <WaitingComp />
      )}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiPaper-root": {
            width: 300,
            padding: "10px",
          },
        }}
      >
        <DialogTitle>
          {winner === "draw" ? (
            "Match is Draw"
          ) : (
            <>
              {winner === currentPlayer?.playerType
                ? "You"
                : opponetPlayer?.name}{" "}
              Won the match
            </>
          )}
        </DialogTitle>
        <DialogContent>
          {isRequestedToPlayAgain && (
            <p>Waiting for player to accept the request</p>
          )}
          {getRequestedToPlayAgain && <p>Player Request to play again</p>}
        </DialogContent>
        {getRequestedToPlayAgain ? (
          <DialogActions className="gap-3">
            <button
              className="h-10 bg-[#cdbeff] text-black rounded-md px-3 text-sm font-medium"
              onClick={handleExit}
            >
              Cancel
            </button>
            <button
              onClick={handleAccpetRequest}
              className="h-10 bg-black text-white rounded-md px-3 text-sm font-medium"
            >
              Accept
            </button>
          </DialogActions>
        ) : (
          <DialogActions className="gap-3">
            <button
              className="h-10 bg-[#cdbeff] text-black rounded-md px-3 text-sm font-medium"
              onClick={handleExit}
            >
              Exit
            </button>
            {!isRequestedToPlayAgain && (
              <button
                onClick={handleRequest}
                className="h-10 bg-black text-white rounded-md px-3 text-sm font-medium"
              >
                Request to play again
              </button>
            )}
          </DialogActions>
        )}
      </Dialog>

      <Snackbar
        open={snakeOpen}
        autoHideDuration={1000}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        onClose={() => setsnakeOpen(false)}
      >
        <SnackbarContent
          style={{
            backgroundColor: "whitesmoke",
            color: "black",
          }}
          message={<span id="client-snackbar">Player leave the match</span>}
        />
      </Snackbar>
    </div>
  );
};

export default Game;
