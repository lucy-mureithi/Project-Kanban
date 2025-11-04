import React, { useState } from "react";
import "./App.css";

// Column Component
function Column({ title, cards, onAddCard }) {
  const [newCard, setNewCard] = useState("");

  const handleAdd = () => {
    if (newCard.trim() === "") return;
    onAddCard(title, newCard);
    setNewCard("");
  };

  return (
    <div className="column">
      <div className="column-header">{title}</div>
      <div className="column-body">
        {cards.map((card, index) => (
          <div key={index} className="card">
            {card}
          </div>
        ))}
      </div>
      <div className="column-footer">
        <input
          type="text"
          placeholder="Add card"
          value={newCard}
          onChange={(e) => setNewCard(e.target.value)}
        />
        <button onClick={handleAdd}>+</button>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [board, setBoard] = useState({
    "Backlog": ["Research ideas"],
    "To Do": ["Set up project"],
    "In Progress": ["Design wireframe"],
    "Review": ["Peer feedback"],
    "Done": ["Project approved"],
  });

  const addCard = (column, card) => {
    setBoard((prev) => ({
      ...prev,
      [column]: [...prev[column], card],
    }));
  };

  return (
    <div className="app-root">
      <div className="board">
        {Object.keys(board).map((colTitle) => (
          <Column
            key={colTitle}
            title={colTitle}
            cards={board[colTitle]}
            onAddCard={addCard}
          />
        ))}
      </div>
    </div>
  );
}
