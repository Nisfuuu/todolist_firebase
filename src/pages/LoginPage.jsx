// MultipleFiles/LoginPage.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Simpan ke localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email);
      window.location.href = "/";
    } catch (error) {
      alert("Login gagal: " + error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Masuk</button>
      </form>
      <p>
        Belum punya akun? <a href="/register">Daftar di sini</a>
      </p>
    </div>
  );
}
