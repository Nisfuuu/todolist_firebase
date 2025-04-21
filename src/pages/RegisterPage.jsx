// MultipleFiles/RegisterPage.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  addDoc, // <- Tambahkan import addDoc
} from "firebase/firestore";
import { db } from "../firebase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Hapus error sebelumnya

    try {
      if (!email || !password || !username) {
        setError("Semua field harus diisi!");
        return;
      }

      if (password.length < 6) {
        setError("Password harus minimal 6 karakter!");
        return;
      }

      // Membuat akun baru
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Membuat collection todos untuk user ini
      const todosCollection = collection(db, `users/${user.uid}/todos`);
      // Tambahkan sample todo jika diperlukan
      await addDoc(todosCollection, {
        text: "Selamat datang! Ini adalah todo list Anda.",
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
        setError(
          "Email ini sudah terdaftar. Silakan login jika sudah memiliki akun."
        );
      } else {
        setError("Register gagal: " + error.message);
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
          autocomplete="email" // <- Tambahkan autocomplete
        />
        <input
          type="password"
          placeholder="Kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autocomplete="current-password" // <- Tambahkan autocomplete
        />
        <input
          type="text"
          placeholder="Nama Pengguna"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autocomplete="username" // <- Tambahkan autocomplete
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
