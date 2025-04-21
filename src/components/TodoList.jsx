// MultipleFiles/TodoList.jsx
export default function TodoList({ todos, onToggle, onDelete, onEdit }) {
  const handleEdit = (id) => {
    const newText = prompt("Edit tugas:");
    if (newText) onEdit(id, newText);
  };

  const isOverdue = (deadline) => {
    const today = new Date().toISOString().split("T")[0];
    return deadline && deadline < today;
  };

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{
            backgroundColor: "#fff",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "6px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            textDecoration: todo.done ? "line-through" : "none",
          }}
        >
          <div>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => onToggle(todo.id)}
            />
            <span style={{ marginLeft: 8 }}>{todo.text}</span>
            {todo.deadline && (
              <div
                style={{
                  fontSize: "0.8rem",
                  color: isOverdue(todo.deadline) ? "red" : "#555",
                  marginLeft: "1.5rem",
                }}
              >
                📅 Deadline: {todo.deadline}
              </div>
            )}
          </div>
          <div style={{ marginTop: 5 }}>
            <button
              onClick={() => handleEdit(todo.id)}
              style={{ marginRight: 8 }}
            >
              Edit
            </button>
            <button onClick={() => onDelete(todo.id)}>Hapus</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
