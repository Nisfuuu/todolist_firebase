// MultipleFiles/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const user = {
    uid: localStorage.getItem("uid"),
    email: localStorage.getItem("email"),
  };

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Home user={user} /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
