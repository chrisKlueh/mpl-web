import React, { useState } from "react";
import { connect } from "react-redux";
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
import { logoutRequest } from "../../slices/loginSlice";

const Navbar = (props) => {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    const { logoutRequest, userId } = props;
    console.log("LOGOUT");
    handleCloseUserMenu();
    logoutRequest({ userId: userId });
  };

  const { isLoggedIn, isAdmin, userName } = props;
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/demos" className={styles.appTitleContainer}>
            <TimelineIcon className={styles.logo} />
            <Typography variant="h6" noWrap className={styles.appTitle}>
              mplWEB
            </Typography>
          </Link>

          {isLoggedIn && (
            <div className={styles.rightContainer}>
              <p className={styles.userName}>{userName}</p>
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
                  <MenuItem key={"demos"} onClick={handleCloseUserMenu}>
                    <Link
                      to="/demos"
                      style={{
                        textDecoration: "none",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Demos
                    </Link>
                  </MenuItem>
                  {isAdmin && (
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
                  )}
                  {isAdmin && (
                    <MenuItem key={"groups"} onClick={handleCloseUserMenu}>
                      <Link
                        to="/groups"
                        style={{
                          textDecoration: "none",
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        Groups
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem key={"logout"} onClick={handleLogout}>
                    <Typography className={styles.logout}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.login.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutRequest: (payload) => dispatch(logoutRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
