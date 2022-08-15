import { Backdrop, CircularProgress } from "@mui/material";

type Props = {
  open: boolean;
  fullScreen?: boolean;
};

export default function LoaderModal({ open, fullScreen = false }: Props) {
  return (
    <Backdrop
      open={open}
      sx={
        fullScreen
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }
          : {
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }
      }
    >
      <CircularProgress size="3rem" color="inherit" />
    </Backdrop>
  );
}
