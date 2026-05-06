import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
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

    try {
      await API.post("/posts", {
        ...form,
        tags: form.tags.split(",").map(tag => tag.trim())
      });

      navigate("/");
    } catch (err) {
      alert("Error creating post");
      console.log(err);
    }
  };

  return (
  <div className="container">
    <div className="form-wrapper">
      <form className="form-card modern-form" onSubmit={handleSubmit}>

        <h2>Create Post</h2>

        <div className="form-group">
          <label>Title</label>
          <input
            placeholder="Enter post title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            placeholder="Write your post..."
            rows="4"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            placeholder="e.g. react, node, mongodb"
            value={form.tags}
            onChange={e => setForm({ ...form, tags: e.target.value })}
          />
          <small className="hint">Separate tags with commas</small>
        </div>

        <button type="submit" className="submit-btn">
          Create Post
        </button>

      </form>
    </div>
  </div>
);
}