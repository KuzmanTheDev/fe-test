import { CircularProgress, Backdrop } from "@mui/material";

export const Loader = () => {
  return (
    <Backdrop open={true}>
      <CircularProgress />
    </Backdrop>
  );
};
