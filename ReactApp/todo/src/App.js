import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Unique ID ke liye
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

// LocalStorage ke liye ek key
const LOCAL_STORAGE_KEY = 'react-todo-tasks';

function App() {
  // ----- STATE -----
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  // ----- EFFECT -----
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]); 


  // ----- FUNCTIONS -----

  // 1. Add Task (UPDATED)
  const addTask = (text) => {
    const newTask = {
      id: uuidv4(),
      text: text,
      isCompleted: false, // <-- NAYA ADD KIYA HAI
    };
    setTasks([...tasks, newTask]);
  };

  // 2. Delete Task
  const deleteTask = (id) => {
    const remainingTasks = tasks.filter((task) => task.id !== id);
    setTasks(remainingTasks);
  };

  // 3. Update Task (Edit)
  const updateTask = (id, newText) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, text: newText };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // 4. Toggle Complete 
  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) => {
      // Agar ID match hoti hai, toh 'isCompleted' ko ulta kardo (true ka false, false ka true)
      if (task.id === id) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    setTasks(updatedTasks);
  };


  // ----- JSX (Render) -----
  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      
      <TodoForm addTask={addTask} />

      {/* 'toggleComplete' function ko yahaan pass kiya hai */}
      <TodoList
        tasks={tasks}
        deleteTask={deleteTask}
        updateTask={updateTask}
        toggleComplete={toggleComplete} 
      />
    </div>
  );
}

export default App;