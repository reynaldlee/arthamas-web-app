import { Typography } from "@mui/material";

type Status = "Open" | "Completed" | "Cancelled" | "Partial" | "OnProgress";

const StatusColor = {
  Open: "darkblue",
  Completed: "green",
  Cancelled: "red",
  Partial: "orange",
  OnProgress: "orange",
  Paid: "green",
};

type Props = {
  status: Status;
};

export default function StatusBadge({ status }: Props) {
  return (
    <Typography
      sx={{
        backgroundColor: StatusColor[status],
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
        px: 2,
        py: 1,
        display: "inline",
        textAlign: "center",
        borderRadius: 6,
      }}
    >
      {status}
    </Typography>
  );
}
