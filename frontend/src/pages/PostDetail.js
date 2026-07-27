import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "timeago.js";
import API from "../services/api";
import { getUserIdFromToken } from "../utils/auth";

import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Stack,
  Box,
  Button,
  Chip,
  Divider,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const userId = getUserIdFromToken();
  

  useEffect(() => {
    API.get(`/posts/${id}`).then(res => setPost(res.data));
    API.get(`/comments/${id}`).then(res => setComments(res.data));
  }, [id]);

  // ✅ Voting
  const vote = async (type) => {
    try {
      await API.post(`/posts/${id}/vote`, { type });
      const res = await API.get(`/posts/${id}`);
      setPost(res.data);
    } catch {
      alert("Login required");
    }
  };

  // ✅ Add comment
  const addComment = async () => {
    if (!text.trim()) return;

    await API.post(`/comments/${id}`, { content: text });

    const res = await API.get(`/comments/${id}`);
    setComments(res.data);

    setText("");
  };

  // ✅ Delete post
  const deletePost = async () => {
    if (!window.confirm("Do you want to delete this post?")) return;

    await API.delete(`/posts/${id}`);
    navigate("/");
  };

  // ✅ Delete comment
  const deleteComment = async (commentId) => {
    await API.delete(`/comments/${commentId}`);
    setComments(comments.filter(c => c._id !== commentId));
  };

  const isUpvoted = post?.upvotes?.includes(userId);
  const isDownvoted = post?.downvotes?.includes(userId);

  if (!post)
  return (
    <Box
      display="flex"
      justifyContent="center"
      mt={8}
    >
      <CircularProgress />
    </Box>
  );
//   console.log("post author:", post.author?._id);
// console.log("logged user:", userId);

  return (
      <Container
        maxWidth="md"
        sx={{
          py: 5,
        }}
      >
      <Card
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "visible",
        }}
      >
      <CardContent>

        <Stack
  direction="row"
  justifyContent="space-between"
  alignItems="flex-start"
>

  <Stack direction="row" spacing={2}>

    <Avatar sx={{ bgcolor: "primary.main" }}>
      {post.author?.name?.charAt(0).toUpperCase()}
    </Avatar>

    <Box>

      <Typography
        variant="h4"
        fontWeight={700}
      >
        {post.title}
      </Typography>

      <Typography color="text.secondary">
        By {post.author?.name}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {format(post.createdAt)}
      </Typography>

    </Box>

  </Stack>

  {post.author?._id === userId && (
    <>
      <IconButton onClick={openMenu}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={() => {
            closeMenu();
            deletePost();
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Post
        </MenuItem>
      </Menu>
    </>
  )}

</Stack>

        {/* 🔹 Content */}
        <Box sx={{ mt: 4, mb: 4 }}>
          {post.content.split("\n").map((line, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{
                mb: line.trim() ? 2 : 0,
                lineHeight: 1.9,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                textAlign: "justify",
              }}
            >
              {line}
            </Typography>
          ))}
        </Box>

        {/* 🔹 Votes */}
        <CardActions sx={{ px: 0 }}>

          <Button
            startIcon={<ThumbUpAltOutlinedIcon />}
            color={isUpvoted ? "success" : "inherit"}
            onClick={() => vote("up")}
          >
            {post.upvotes?.length || 0}
          </Button>

          <Button
            startIcon={<ThumbDownAltOutlinedIcon />}
            color={isDownvoted ? "error" : "inherit"}
            onClick={() => vote("down")}
          >
            {post.downvotes?.length || 0}
          </Button>

          <Chip
            sx={{ ml: "auto" }}
            icon={<ChatBubbleOutlineIcon />}
            label={`${comments.length} Comments`}
          />

        </CardActions>

        <Divider sx={{ my: 3 }} />

        {/* 🔹 Comments */}
        <Typography
          variant="h5"
          fontWeight={700}
          mb={3}
        >
          Comments
        </Typography>

        {comments.map(c => (
          <Card
  key={c._id}
  variant="outlined"
  sx={{
    mb: 2,
    borderRadius: 2,
  }}
>
  <CardContent>

    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
    >

      <Box>

        <Typography fontWeight={600}>
          {c.author.name}
        </Typography>

        <Typography
          sx={{
            mt: 1,
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
            color: "text.secondary",
          }}
        >
          {c.content}
        </Typography>

      </Box>

            {c.author._id === userId && (
              <IconButton
                color="error"
                onClick={() => deleteComment(c._id)}
              >
                <DeleteIcon />
              </IconButton>
            )}

          </Stack>

        </CardContent>
      </Card>
        ))}

        {/* 🔹 Add comment */}
        <Stack
        direction="row"
        spacing={2}
        mt={4}
      >

        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          disabled={!text.trim()}
          onClick={addComment}
        >
          Post
        </Button>

      </Stack>

      </CardContent>
    </Card>
</Container>

  );
}