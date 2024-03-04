import { Snackbar, SnackbarContent } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";

const WaitingComp = () => {
  const [snakeOpen, setsnakeOpen] = useState(false);

  const handleClickSnale = () => {
    setsnakeOpen(true);
  };
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <p>Please Wait for user</p>
      <button
        className="bg-white h-10 px-3 rounded-md font-semibold text-base text-black mt-3"
        onClick={() => {
          handleClickSnale();
          navigator.clipboard.writeText(id as string);
        }}
      >
        Copy Game Id and Invite your friend
      </button>

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
          message={<span id="client-snackbar">Game Id Copied </span>}
        />
      </Snackbar>
    </div>
  );
};

export default WaitingComp;
