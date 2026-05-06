import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="navbar">

      <div className="nav-left">
        {token && <Link to="/">Home</Link>}
      </div>

      <div className="nav-right">

        {token ? (
          <>
            <Link to="/create">Create Post</Link>

            <button onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            {location.pathname !== "/login" && (
              <Link to="/login">Login</Link>
            )}

            {location.pathname !== "/signup" && (
              <Link to="/signup">Signup</Link>
            )}
          </>
        )}

      </div>
    </div>
  );
}