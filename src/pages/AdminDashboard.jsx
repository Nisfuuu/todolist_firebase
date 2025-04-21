import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/"); // Redirect ke halaman utama jika bukan admin
    }
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Halo, Admin!</h1>
      {/* Konten halaman admin */}
    </div>
  );
}
