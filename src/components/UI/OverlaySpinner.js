import { createPortal } from "react-dom";
import classes from "./OverlaySpinner.module.css";
import { CircularProgress } from "@mui/material";

const OverlaySpinner = () => {
  return createPortal(
    <>
      <div className={classes.backdrop} />
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    </>,
    document.getElementById("overlay")
  );
};

export default OverlaySpinner;
