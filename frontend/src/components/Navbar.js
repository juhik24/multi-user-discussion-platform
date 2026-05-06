import { Link, useNavigate } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
  <div className="nav-left">
    <Link to="/">Home</Link>
    {token && <Link to="/create">Create</Link>}
  </div>

  <div className="nav-right">
    {!token ? (
      <>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </>
    ) : (
      <button onClick={handleLogout}>Logout</button>
    )}
  </div>
</div>
  );
}