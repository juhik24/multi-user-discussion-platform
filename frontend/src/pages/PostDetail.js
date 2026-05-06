import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "timeago.js";
import { useRef } from "react";
import API from "../services/api";
import { getUserIdFromToken } from "../utils/auth";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const menuRef = useRef();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const userId = getUserIdFromToken();
  
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

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

  if (!post) return <div>Loading...</div>;
//   console.log("post author:", post.author?._id);
// console.log("logged user:", userId);

  return (
    <div className="container">
      <div className="card">

        {/* 🔹 Title */}
        <h2>{post.title}</h2>

        {/* 🔹 3-dot menu */}
        {post.author?._id === userId && (
          <div className="post-menu" ref={menuRef}>
            <button
              className="menu-btn"
              onClick={() => setShowMenu(prev => !prev)}
            >
              ⋮
            </button>

            {showMenu && (
              <div className="menu-dropdown">
                <div
                  className="menu-item delete"
                  onClick={deletePost}
                >
                  Delete Post
                </div>
              </div>
            )}
          </div>
        )}

        {/* 🔹 Author */}
        <div className="author-section">
          <p className="author">By {post.author?.name}</p>

          <span className="timestamp">
            {format(post.createdAt)}
          </span>
        </div>

        {/* 🔹 Content */}
        <p className="content">{post.content}</p>

        {/* 🔹 Votes */}
        <div className="vote-row">
          <button
            className={`vote-btn ${isUpvoted ? "active-up" : ""}`}
            onClick={() => vote("up")}
          >
            👍 {post.upvotes?.length || 0}
          </button>

          <button
            className={`vote-btn ${isDownvoted ? "active-down" : ""}`}
            onClick={() => vote("down")}
          >
            👎 {post.downvotes?.length || 0}
          </button>
        </div>

        {/* 🔹 Comments */}
        <h3>Comments</h3>

        {comments.map(c => (
          <div key={c._id} className="comment-item">
            <div className="comment-content">
              <b>{c.author.name}</b>: {c.content}
            </div>

            {c.author._id === userId && (
              <button
                className="delete-btn"
                onClick={() => deleteComment(c._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {/* 🔹 Add comment */}
        <div className="comment-box">
          <input
            className="comment-input"
            placeholder="Write a comment..."
            value={text}
            onChange={e => setText(e.target.value)}
          />

          <button
            className="comment-btn"
            onClick={addComment}
            disabled={!text.trim()}
          >
            Post
          </button>
        </div>

      </div>
    </div>
  );
}