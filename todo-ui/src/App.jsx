import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./styles/list.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const API = "http://localhost:3000/todos";

  
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  
  const addTodo = async (text) => {
    if (!text.trim()) return;

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, completed: false }),
    });

    const data = await res.json();
    setTodos((prev) => [...prev, data]);
  };

 
  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  
  const toggleTodo = async (todo) => {
    const res = await fetch(`${API}/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });

    const data = await res.json();

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? data : t))
    );
  };

  
  const filteredTodos = todos.filter((todo) => {
    if (filter === "inactive") return !todo.completed;   
    if (filter === "completed") return todo.completed;   
    return true;                                        
  });

  return (
    <div className="app">
      <div className="container">
        <h1>✨ Todo App</h1>

        
        <div className="filters">
          <button
            className={filter === "active" ? "activeBtn" : ""}
            onClick={() => setFilter("all")}
          >
            Active
          </button>

          <button
            className={filter === "inactive" ? "inactiveBtn" : ""}
            onClick={() => setFilter("inactive")}
          >
            Inactive
          </button>

          <button
            className={filter === "completed" ? "activeBtn" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        <TodoForm addTodo={addTodo} />

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
        />
      </div>
    </div>
  );
}

export default App;