import { useState } from "react";

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, deadline);
    setText("");
    setDeadline("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20, marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Apa yang ingin kamu lakukan?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type="submit">Tambah</button>
    </form>
  );
}
