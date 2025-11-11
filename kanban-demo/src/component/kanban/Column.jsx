import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import Card from "./Card.jsx";

export default function Column({ stage, index, onAddCard, onEditCard, onDeleteCard, onEditColumn }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [editedColumnName, setEditedColumnName] = useState(stage.name);

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

  const handleColumnNameSave = () => {
    if (editedColumnName.trim() && onEditColumn) {
      onEditColumn(stage.id, editedColumnName.trim());
      setIsEditingColumn(false);
    }
  };

  const handleColumnNameCancel = () => {
    setEditedColumnName(stage.name);
    setIsEditingColumn(false);
  };

  const handleColumnKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleColumnNameSave();
    } else if (e.key === 'Escape') {
      handleColumnNameCancel();
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg w-72 flex-shrink-0">
      {/* Column Header */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          {isEditingColumn ? (
            <div className="flex items-center space-x-2 flex-1">
              <input
                type="text"
                value={editedColumnName}
                onChange={(e) => setEditedColumnName(e.target.value)}
                onKeyDown={handleColumnKeyPress}
                onBlur={handleColumnNameSave}
                className="flex-1 px-2 py-1 text-sm font-semibold text-gray-700 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleColumnNameSave}
                className="text-green-600 hover:text-green-700 text-xs"
                title="Save"
              >
                ✓
              </button>
              <button
                onClick={handleColumnNameCancel}
                className="text-red-600 hover:text-red-700 text-xs"
                title="Cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <h2 
              className="font-semibold text-gray-700 text-sm cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setIsEditingColumn(true)}
              title="Click to edit column name"
            >
              {stage.name}
            </h2>
          )}
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded ml-2">
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