import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
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

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};

    if (!form.name) e.name = "Name is required";

    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Min 6 characters";

    return e;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const eObj = validate();
  setErrors(eObj);

  if (Object.keys(eObj).length) return;

  setLoading(true);

  try {
    await API.post("/auth/signup", form);
    navigate("/login");
  } catch (err) {
    setErrors({ api: err.response?.data?.msg || "Signup failed" });
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
        <PersonAddAlt1Icon
          color="primary"
          sx={{ fontSize: 42 }}
        />

        <Typography
          variant="h4"
          fontWeight={700}
        >
          Create Account
        </Typography>

        <Typography color="text.secondary">
          Join the Discussion Hub community.
        </Typography>
      </Stack>

      {errors.api && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
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
            label="Full Name"
            value={form.name}
            error={Boolean(errors.name)}
            helperText={errors.name}
            onChange={(e) => {
              setForm({
                ...form,
                name: e.target.value,
              });

              setErrors({
                ...errors,
                name: "",
              });
            }}
          />

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
            startIcon={<PersonAddAlt1Icon />}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

        </Stack>

      </Box>

      <Typography
        align="center"
        sx={{ mt: 4 }}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          style={{
            color: "#1976d2",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Login
        </Link>
      </Typography>

    </Paper>

  </Container>
);
}