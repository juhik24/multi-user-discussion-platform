import { useEffect, useState } from "react";
import { format } from "timeago.js";
import API from "../services/api";
import { Link } from "react-router-dom";
import { getUserIdFromToken } from "../utils/auth";

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
    <div className="container">

      {/* 🔍 SEARCH BAR */}
      <div className="filter-row">
  <input
    placeholder="Search posts..."
    value={search}
    onChange={e => setSearch(e.target.value)}
  />

  <input
    placeholder="Filter by tag..."
    value={tag}
    onChange={e => setTag(e.target.value)}
  />

  <button onClick={fetchPosts}>Apply</button>
</div>

      {posts.length === 0 && (
  <div className="empty-state">
    <h3>No posts found</h3>
    <p>Try another keyword or create a new post.</p>
  </div>
)}

      {posts.map(post => {
        const isUpvoted = post.upvotes?.includes(userId);
        const isDownvoted = post.downvotes?.includes(userId);

        return (
          <div className="card modern-card" key={post._id}>

            <div className="card-header">
              <h3>{post.title}</h3>
              <div>
                <span className="author">By {post.author.name}</span>

                <div className="timestamp">
                  {format(post.createdAt)}
                </div>
              </div>
            </div>

            <p className="content">{post.content}</p>

            {/* 🏷 TAGS */}
            <div className="tags">
              {post.tags?.map((t, i) => (
                <span key={i} className="tag">{t}</span>
              ))}
            </div>

            {/* 👍 VOTES */}
            <div className="vote-row">
              <button
                className={`vote-btn ${isUpvoted ? "active-up" : ""}`}
                onClick={() => vote(post._id, "up")}
              >
                👍 {post.upvotes?.length || 0}
              </button>

              <button
                className={`vote-btn ${isDownvoted ? "active-down" : ""}`}
                onClick={() => vote(post._id, "down")}
              >
                👎 {post.downvotes?.length || 0}
              </button>
            </div>

            <Link className="btn view-btn" to={`/post/${post._id}`}>
              View Details →
            </Link>

          </div>
        );
      })}
    </div>
  );
}