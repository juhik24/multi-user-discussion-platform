import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
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

    try {
      await API.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setErrors({ api: err.response?.data?.msg || "Signup failed" });
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Signup</h2>

        {errors.api && <p className="error">{errors.api}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            className={errors.name ? "input-error" : ""}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setErrors({ ...errors, name: "" });
            }}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            placeholder="Email"
            value={form.email}
            className={errors.email ? "input-error" : ""}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setErrors({ ...errors, email: "" });
            }}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            className={errors.password ? "input-error" : ""}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setErrors({ ...errors, password: "" });
            }}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button>Signup</button>
          <div className="auth-footer">
            Already have an account? <a href="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}