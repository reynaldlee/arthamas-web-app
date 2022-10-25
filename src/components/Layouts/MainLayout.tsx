import * as React from "react";
import AppBar from "@mui/material/AppBar";

import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import menuItems, { NavMenu, NavMenuItem } from "../../menuItems";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Collapse,
  Menu,
  MenuItem,
  Box,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { trpc } from "@/utils/trpc";
import { useAuth } from "src/context/AuthContext";
import { AccountCircle, KeyboardArrowDown } from "@mui/icons-material";
import { LoaderModal } from "../Loader";

const drawerWidth = 280;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: JSX.Element | string | (JSX.Element | null)[];
}

export default function MainLayout(props: Props) {
  const { window } = props;
  const router = useRouter();
  const { orgCode = "", changeOrg, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [expandedMenu, setExpandedMenu] = React.useState<NavMenuItem[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const { data: orgData, isLoading } = trpc.org.me.useQuery();

  const handleChangeOrg = (e: SelectChangeEvent<string>) => {
    changeOrg(e.target.value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (item: NavMenuItem) => () => {
    const idx = expandedMenu.findIndex((el) => el.name === item.name);
    const isExpanded = idx != -1;
    if (!isExpanded) {
      setExpandedMenu((state) => [...state, item]);
    } else {
      setExpandedMenu((state) => {
        const newExpandedMenu = [...state];
        newExpandedMenu.splice(idx);
        return newExpandedMenu;
      });
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />

      <Box sx={{ px: 2 }}>
        <Select
          defaultValue=""
          value={orgCode}
          fullWidth
          onChange={handleChangeOrg}
        >
          {orgData?.data.map((org) => (
            <MenuItem key={org.orgCode} value={org.orgCode}>
              {org.org.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {menuItems.map((menuItem) => {
        return (
          <React.Fragment key={menuItem.heading}>
            <List>
              <Typography variant="overline" sx={{ marginLeft: 2 }}>
                {menuItem.heading}
              </Typography>

              {menuItem.items.map((item) => (
                <React.Fragment key={item.name}>
                  <Link href={item.link || "#"}>
                    <ListItem
                      disablePadding
                      selected={router.pathname.includes(item.link!)}
                    >
                      <ListItemButton onClick={handleMenuClick(item)}>
                        <ListItemIcon>
                          <item.icon />
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                        {item.items ? <KeyboardArrowDown /> : null}
                      </ListItemButton>
                    </ListItem>
                  </Link>
                  {item.items && (
                    <Collapse
                      in={
                        expandedMenu.findIndex((el) => el.name === item.name) !=
                        -1
                      }
                    >
                      {item.items?.map((subitem) => {
                        return (
                          <Link key={subitem.link} href={subitem.link}>
                            <ListItem sx={{ py: 0, ml: 1 }}>
                              <ListItemButton>
                                <ListItemText
                                  primary={subitem.name}
                                ></ListItemText>
                              </ListItemButton>
                            </ListItem>
                          </Link>
                        );
                      })}
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
            </List>
            <Divider />
          </React.Fragment>
        );
      })}
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Box display="flex" flexDirection="row">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h2" noWrap component="div"></Typography>

            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>

            {/* <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <Avatar></Avatar>
              <Box>
                <Typography variant="h5">{username}</Typography>
              </Box>
            </Box>*/}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <>{props.children}</>
      </Box>

      <LoaderModal open={isLoading} fullScreen></LoaderModal>
    </Box>
  );
}
