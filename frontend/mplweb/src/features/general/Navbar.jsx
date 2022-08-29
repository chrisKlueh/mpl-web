import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
} from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Link } from "react-router-dom";

import styles from "./Navbar.module.css";

const Navbar = (props) => {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    console.log("LOGOUT");
    handleCloseUserMenu();
  };

  const { isLoggedIn } = props;
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TimelineIcon className={styles.logo} />
          <Link to="/demos" style={{ textDecoration: "none", color: "white" }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              className={styles.appTitle}
            >
              mplWEB
            </Typography>
          </Link>

          {isLoggedIn && (
            <Box className={styles.more}>
              <Tooltip title="More">
                <IconButton
                  onClick={handleOpenUserMenu}
                  className={styles.iconButton}
                >
                  <Avatar />
                </IconButton>
              </Tooltip>
              <Menu
                className={styles.menu}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key={"feedback"} onClick={handleCloseUserMenu}>
                  <Link
                    to="/feedback"
                    style={{
                      textDecoration: "none",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Feedback
                  </Link>
                </MenuItem>
                <MenuItem key={"logout"} onClick={handleLogout}>
                  <Typography className={styles.logout}>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
