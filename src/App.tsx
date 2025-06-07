import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/login";
import Register from "./auth/register";
import Profile from "./pages/profile";
import Edit from "./pages/edit"
import Stream from "./pages/streaming"
import CinemaCreate from "./pages/create-cinema"
import CinemaDetail from "./pages/CinemaDetail"
import JoinCinema from "./pages/join_cinema";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/profile" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" /> : <Register />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/streaming" element={<Stream />} />
        <Route path="/create-cinema" element={<CinemaCreate />} />
        <Route path="/cinema/:id" element={<CinemaDetail />} />
        <Route path="/join-cinema" element={<JoinCinema/>} />
      </Routes>
    </Router>
  );
};

export default App;
