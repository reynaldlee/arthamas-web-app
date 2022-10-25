import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

type MenuActions = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
};

type Props = {
  actions: MenuActions[];
  disabled?: boolean;
};

export default function MoreMenu({ actions, disabled }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        disabled={disabled}
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {actions.map((option, index) => (
          <MenuItem
            key={index}
            onClick={option.onClick}
            disabled={option.disabled}
          >
            <Typography color={`${option.danger ? "error" : "main"}`}>
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
