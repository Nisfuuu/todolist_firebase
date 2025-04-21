import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [role, setRole] = useState(null);
  const isLoggedIn = localStorage.getItem("loggedIn");
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    const fetchRole = async () => {
      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      }
    };

    fetchRole();
  }, [uid]);

  const user = {
    uid,
    email: localStorage.getItem("email"),
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          isLoggedIn ? (
            role === "admin" ? (
              <AdminPage />
            ) : (
              <Home user={user} />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
