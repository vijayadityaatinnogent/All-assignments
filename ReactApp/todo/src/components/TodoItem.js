import React, { useState } from 'react';

// 'toggleComplete' ko props mein receive kiya
function TodoItem({ task, deleteTask, updateTask, toggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim() === '') return;
    updateTask(task.id, editText);
    setIsEditing(false);
  };

  return (
    <li className="todo-item">
      {isEditing ? (
        // ----- EDIT MODE -----
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
          />
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
        </>
      ) : (
        // ----- NORMAL VIEW (UPDATED) -----
        <>
          {/* NAYA: className ko dynamic banaya hai */}
          <span className={task.isCompleted ? 'completed-text' : ''}>
            {task.text}
          </span>

          <div className="buttons">
            {/* NAYA: Complete Button */}
            <button
              onClick={() => toggleComplete(task.id)}
              className="complete-btn"
            >
              {task.isCompleted ? 'Undo' : 'Complete'}
            </button>

            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit
            </button>
            <button onClick={() => deleteTask(task.id)} className="delete-btn">
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;