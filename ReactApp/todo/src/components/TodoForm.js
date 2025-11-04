import React, { useState } from 'react';

function TodoForm({addTask} ) {
  // console.log(addTask)
  // console.log({addTask})

  // Yeh state sirf iss input field ko control karne ke liye hai
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Form submit hone par page ko refresh hone se rokta hai
    
    // Check karte hain ki input khali na ho
    if (inputValue.trim() === '') return alert("plz give value");

    // `addTask` function (jo App.js se aa raha hai) ko call karte hain
    addTask(inputValue);
    
    // Input field ko wapas khali kar dete hain
    setInputValue('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new task..."
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TodoForm;