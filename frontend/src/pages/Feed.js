import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

import API from "../services/api";
import { getUserIdFromToken } from "../utils/auth";

import {
  Container,
  Paper,
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Stack,
  Box,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const userId = getUserIdFromToken();

  const fetchPosts = async () => {
    const res = await API.get("/posts", {
      params: { search, tag }
    });
    setPosts(res.data);
  };

  useEffect(() => {
  fetchPosts();
  // eslint-disable-next-line
}, []);

  const vote = async (id, type) => {
  try {
    await API.post(`/posts/${id}/vote`, { type });

    // refetch updated posts
    const res = await API.get("/posts", {
      params: { search, tag }
    });

    setPosts(res.data);

  } catch {
    alert("Login required");
  }
};

  return (
  <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>

    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        mb: 4,
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

        <TextField
          fullWidth
          label="Search Discussions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Filter by Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />

        <Button
          variant="contained"
          size="large"
          onClick={fetchPosts}
          sx={{ minWidth: 140 }}
        >
          Search
        </Button>

      </Stack>
    </Paper>

    {posts.length === 0 && (
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5">
          No discussions found
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Try another search or create a new discussion.
        </Typography>
      </Paper>
    )}

    {posts.map((post) => {

      const isUpvoted = post.upvotes?.includes(userId);
      const isDownvoted = post.downvotes?.includes(userId);

      return (

        <Card
          key={post._id}
          elevation={3}
          sx={{
            mb: 3,
            borderRadius: 3,
            transition: "0.25s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 8,
            },
          }}
        >

          <CardContent>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >

              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 48,
                  height: 48,
                }}
              >
                {post.author.name.charAt(0).toUpperCase()}
              </Avatar>

              <Box flex={1}>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {post.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {post.author.name} • {format(post.createdAt)}
                </Typography>

              </Box>

            </Stack>

            <Typography
                variant="body1"
                sx={{
                  mt: 3,
                  mb: 3,
                  color: "text.secondary",
                  whiteSpace: "pre-wrap",      // Preserve line breaks
                  wordBreak: "break-word",     // Prevent long words from overflowing
                  lineHeight: 1.9,             // Better readability
                  textAlign: "justify",        // Neat paragraph alignment
                  fontSize: "1rem",
                }}
              >
                {post.content}
              </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
            >
              {post.tags?.map((tag, i) => (
                <Chip
                  key={i}
                  label={tag}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Stack>

          </CardContent>

          <CardActions
            sx={{
              px: 2,
              pb: 2,
              justifyContent: "space-between",
            }}
          >

            <Stack direction="row" spacing={1}>

              <Button
                color={isUpvoted ? "success" : "inherit"}
                startIcon={<ThumbUpAltOutlinedIcon />}
                onClick={() => vote(post._id, "up")}
              >
                {post.upvotes?.length || 0}
              </Button>

              <Button
                color={isDownvoted ? "error" : "inherit"}
                startIcon={<ThumbDownAltOutlinedIcon />}
                onClick={() => vote(post._id, "down")}
              >
                {post.downvotes?.length || 0}
              </Button>

            </Stack>

            <Button
              component={Link}
              to={`/post/${post._id}`}
              endIcon={<ArrowForwardIcon />}
              variant="contained"
            >
              View Discussion
            </Button>

          </CardActions>

        </Card>

      );

    })}

  </Container>
);
}