import React from 'react';
import TodoItem from './TodoItem';

// 'toggleComplete' ko props mein receive kiya
function TodoList({ tasks, deleteTask, updateTask, toggleComplete }) {
  return (
    <ul className="todo-list">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          updateTask={updateTask}
          toggleComplete={toggleComplete} // <-- 'toggleComplete' ko aage pass kar diya
        />
      ))}
    </ul>
  );
}

export default TodoList;