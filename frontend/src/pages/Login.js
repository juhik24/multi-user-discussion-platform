import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

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

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      setErrors({ api: err.response?.data?.msg || "Login failed" });
    }
  };

  return (
  <div className="form-container">
    <div className="form-card">
      <h2>Login</h2>

      {errors.api && <p className="error">{errors.api}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={form.email}
          className={errors.email ? "input-error" : ""}
          onChange={e => {
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
          onChange={e => {
            setForm({ ...form, password: e.target.value });
            setErrors({ ...errors, password: "" });
          }}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button>Login</button>
        <div className="auth-footer">
          Don’t have an account? <a href="/signup">Signup</a>
        </div>
      </form>
    </div>
  </div>
);
}