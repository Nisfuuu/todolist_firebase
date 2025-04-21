import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!email || !password || !username) {
        setError("Semua field harus diisi!");
        return;
      }

      if (password.length < 6) {
        setError("Password minimal 6 karakter!");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Simpan user profile dengan role "user"
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username,
        role: "user", // 👈 role default
        createdAt: serverTimestamp(),
      });

      // Buat todo awal
      const todosCollection = collection(db, `users/${user.uid}/todos`);
      await addDoc(todosCollection, {
        text: "Selamat datang! Ini adalah todo pertama Anda.",
        done: false,
        deadline: null,
        createdAt: serverTimestamp(),
      });

      // Simpan ke localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email);
      window.location.href = "/";
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar.");
      } else {
        setError("Gagal daftar: " + error.message);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Daftar</h2>
      <form onSubmit={handleRegister}>
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
        <input
          type="text"
          placeholder="Nama pengguna"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Daftar</button>
      </form>
      <p>
        Sudah punya akun? <a href="/login">Masuk di sini</a>
      </p>
    </div>
  );
}
