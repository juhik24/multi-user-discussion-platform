import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        backgroundColor: "#1976d2",
      }}
    >
      <Toolbar>

        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            flexGrow: 1,
            letterSpacing: 0.5,
          }}
        >
          Discussion Hub
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          {token ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<HomeIcon />}
              >
                Home
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/create"
                startIcon={<AddIcon />}
              >
                Create Post
              </Button>

              <Button
                color="inherit"
                onClick={logout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {location.pathname !== "/login" && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  startIcon={<LoginIcon />}
                >
                  Login
                </Button>
              )}

              {location.pathname !== "/signup" && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/signup"
                  startIcon={<PersonAddAlt1Icon />}
                >
                  Signup
                </Button>
              )}
            </>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
}