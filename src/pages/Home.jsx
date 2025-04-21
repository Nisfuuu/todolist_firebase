// MultipleFiles/Home.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Home({ user }) {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const userUid = user?.uid;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Hapus semua data di localStorage
        localStorage.clear();
        navigate("/login");
      })
      .catch((error) => {
        console.error("Gagal logout:", error);
      });
  };

  useEffect(() => {
    if (!userUid) {
      navigate("/login");
      return;
    }

    const todosCollection = collection(db, `users/${userUid}/todos`);
    const q = query(todosCollection);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(data);
    });

    return () => unsubscribe();
  }, [userUid, navigate]);

  const addTodo = async (text, deadline) => {
    try {
      const todosCollection = collection(db, `users/${userUid}/todos`);
      await addDoc(todosCollection, {
        text,
        done: false,
        deadline,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Gagal menambahkan todo:", error);
    }
  };

  const toggleTodo = async (id, current) => {
    try {
      const todoRef = doc(db, `users/${userUid}/todos/${id}`);
      await updateDoc(todoRef, {
        done: !current,
      });
    } catch (error) {
      console.error("Gagal mengubah status todo:", error);
    }
  };

  const editTodo = async (id, newText) => {
    try {
      const todoRef = doc(db, `users/${userUid}/todos/${id}`);
      await updateDoc(todoRef, {
        text: newText,
      });
    } catch (error) {
      console.error("Gagal mengubah todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const todoRef = doc(db, `users/${userUid}/todos/${id}`);
      await deleteDoc(todoRef);
    } catch (error) {
      console.error("Gagal menghapus todo:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <h2>Welcome, {user?.email}</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
      <TodoForm onAdd={addTodo} />
      <TodoList
        todos={todos}
        onToggle={(id) => {
          const todo = todos.find((t) => t.id === id);
          toggleTodo(id, todo.done);
        }}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />
    </div>
  );
}
