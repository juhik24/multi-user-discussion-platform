import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Navbar from "./components/Navbar";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={token ? <Feed /> : <Navigate to="/login" />}
        />

        {/* Auth */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/" />}
        />

        {/* Protected Routes */}
        <Route
          path="/create"
          element={token ? <CreatePost /> : <Navigate to="/login" />}
        />

        <Route
          path="/post/:id"
          element={token ? <PostDetail /> : <Navigate to="/login" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;