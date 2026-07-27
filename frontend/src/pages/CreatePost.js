import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔒 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    await API.post("/posts", {
      ...form,
      tags: form.tags.split(",").map(tag => tag.trim()),
    });

    navigate("/");
  } catch (err) {
    alert("Error creating post");
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  return (
  <Container maxWidth="md" sx={{ py: 5 }}>

    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 3,
      }}
    >

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        mb={4}
      >
        <ArticleOutlinedIcon
          color="primary"
          sx={{ fontSize: 34 }}
        />

        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Create Discussion
          </Typography>

          <Typography color="text.secondary">
            Share your knowledge or ask the community a question.
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3}>

        <TextField
          fullWidth
          label="Title"
          placeholder="Enter an informative title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <TextField
          fullWidth
          multiline
          minRows={8}
          label="Content"
          placeholder="Describe your discussion in detail..."
          value={form.content}
          onChange={(e) =>
            setForm({
              ...form,
              content: e.target.value,
            })
          }
        />

        <TextField
          fullWidth
          label="Tags"
          placeholder="react, node, mongodb"
          helperText="Separate multiple tags using commas."
          value={form.tags}
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value,
            })
          }
        />

        <Box
          display="flex"
          justifyContent="flex-end"
        >
          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={<SendIcon />}
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              minWidth: 180,
              borderRadius: 2,
            }}
          >
            {loading ? "Publishing..." : "Publish Post"}
          </Button>
        </Box>

      </Stack>

    </Paper>

  </Container>
);
}