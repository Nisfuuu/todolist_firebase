import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [doneCount, setDoneCount] = useState(0);
  const [notDoneCount, setNotDoneCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnap = await getDocs(collection(db, "users"));
        const userList = [];

        let totalDone = 0;
        let totalNotDone = 0;

        for (const docUser of userSnap.docs) {
          const userData = docUser.data();
          const userId = docUser.id;

          const todosSnap = await getDocs(
            collection(db, `users/${userId}/todos`)
          );
          const todoCount = todosSnap.size;

          // hitung done vs not done
          todosSnap.docs.forEach((todo) => {
            const data = todo.data();
            if (data.done) totalDone++;
            else totalNotDone++;
          });

          userList.push({
            id: userId,
            email: userData.email,
            username: userData.username,
            role: userData.role,
            totalTodos: todoCount,
          });
        }

        setUsers(userList);
        setDoneCount(totalDone);
        setNotDoneCount(totalNotDone);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  const pieData = {
    labels: ["Selesai", "Belum Selesai"],
    datasets: [
      {
        data: [doneCount, notDoneCount],
        backgroundColor: ["#4CAF50", "#FF5722"],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>Hello Admin 👑</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <p>📊 Statistik jumlah todo per user (Bar Chart):</p>
      <Bar
        data={{
          labels: users.map((u) => u.username || u.email),
          datasets: [
            {
              label: "Jumlah Todo",
              data: users.map((u) => u.totalTodos),
              backgroundColor: "#2196F3",
            },
          ],
        }}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              precision: 0,
            },
          },
        }}
      />

      <p style={{ marginTop: 40 }}>
        🥧 Statistik todo selesai vs belum (Pie Chart):
      </p>
      <div style={{ maxWidth: "400px", margin: "auto" }}>
        <Pie data={pieData} />
      </div>
    </div>
  );
}
