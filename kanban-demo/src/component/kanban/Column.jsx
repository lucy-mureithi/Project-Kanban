import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import Card from "./Card.jsx";

export default function Column({ stage, index, onAddCard, onEditCard, onDeleteCard }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(stage.id, newCardTitle);
      setNewCardTitle("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCard();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewCardTitle("");
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg w-72 flex-shrink-0">
      {/* Column Header */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-700 text-sm">{stage.name}</h2>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
            {stage.cards.length}
          </span>
        </div>
      </div>

      {/* Cards Container */}
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`px-2 pb-2 space-y-2 min-h-20 ${
              snapshot.isDraggingOver ? 'bg-blue-50 rounded' : ''
            }`}
          >
            {stage.cards
              .sort((a, b) => a.order - b.order)
              .map((card, index) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  index={index}
                  onEditCard={onEditCard}
                  onDeleteCard={onDeleteCard}
                />
              ))}
            {provided.placeholder}
            
            {/* Add Card Section */}
            {isAdding ? (
              <div className="bg-white rounded-md shadow-sm border p-2">
                <input
                  type="text"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter a title for this card..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <div className="flex items-center mt-2 space-x-2">
                  <button
                    onClick={handleAddCard}
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                  >
                    Add card
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewCardTitle("");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full text-left text-gray-500 hover:bg-gray-200 rounded-md p-2 text-sm flex items-center"
              >
                <span className="mr-1">+</span>
                Add a card
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}