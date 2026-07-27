import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Box,
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";

    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const eObj = validate();
  setErrors(eObj);

  if (Object.keys(eObj).length) return;

  setLoading(true);

  try {
    const res = await API.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/";
  } catch (err) {
    setErrors({ api: err.response?.data?.msg || "Login failed" });
  } finally {
    setLoading(false);
  }
};

  return (
  <Container maxWidth="sm" sx={{ py: 8 }}>

    <Paper
      elevation={5}
      sx={{
        p: 5,
        borderRadius: 3,
      }}
    >

      <Stack
        alignItems="center"
        spacing={1}
        mb={4}
      >
        <LoginIcon
          color="primary"
          sx={{ fontSize: 42 }}
        />

        <Typography
          variant="h4"
          fontWeight={700}
        >
          Welcome Back
        </Typography>

        <Typography color="text.secondary">
          Login to continue to Discussion Hub
        </Typography>
      </Stack>

      {errors.api && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.api}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
      >

        <Stack spacing={3}>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={form.email}
            error={Boolean(errors.email)}
            helperText={errors.email}
            onChange={(e) => {
              setForm({
                ...form,
                email: e.target.value,
              });

              setErrors({
                ...errors,
                email: "",
              });
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={form.password}
            error={Boolean(errors.password)}
            helperText={errors.password}
            onChange={(e) => {
              setForm({
                ...form,
                password: e.target.value,
              });

              setErrors({
                ...errors,
                password: "",
              });
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

        </Stack>

      </Box>

      <Typography
        align="center"
        sx={{ mt: 4 }}
      >
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{
            color: "#1976d2",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Sign Up
        </Link>
      </Typography>

    </Paper>

  </Container>
);
}