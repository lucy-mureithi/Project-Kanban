import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

// Available label colors
const labelColors = {
  design: { bg: 'bg-green-100', text: 'text-green-800', name: 'Design' },
  feature: { bg: 'bg-blue-100', text: 'text-blue-800', name: 'Feature' },
  research: { bg: 'bg-yellow-100', text: 'text-yellow-800', name: 'Research' },
  development: { bg: 'bg-purple-100', text: 'text-purple-800', name: 'Development' },
  api: { bg: 'bg-red-100', text: 'text-red-800', name: 'API' },
  bug: { bg: 'bg-pink-100', text: 'text-pink-800', name: 'Bug' },
  urgent: { bg: 'bg-orange-100', text: 'text-orange-800', name: 'Urgent' },
  documentation: { bg: 'bg-indigo-100', text: 'text-indigo-800', name: 'Docs' },
};

export default function Card({ card, index, onEditCard, onDeleteCard }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onEditCard(card.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(card.title);
    setEditedDescription(card.description);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="bg-white rounded-md shadow-sm border-2 border-blue-300 p-3"
            style={provided.draggableProps.style}
          >
            {/* Edit Mode */}
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full text-sm font-medium text-gray-800 mb-2 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              autoFocus
            />
            
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add description..."
              className="w-full text-xs text-gray-600 mb-2 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
              rows="3"
            />
            
            <div className="flex justify-between items-center text-xs">
              <div className="text-gray-500">
                Press Ctrl+Enter to save, Esc to cancel
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-md shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer ${
            snapshot.isDragging ? 'rotate-5 shadow-lg' : ''
          }`}
          style={provided.draggableProps.style}
          onDoubleClick={() => setIsEditing(true)}
        >
          {/* Enhanced Labels */}
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.map((label, index) => {
                const labelConfig = labelColors[label] || { bg: 'bg-gray-100', text: 'text-gray-800', name: label };
                return (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded capitalize ${labelConfig.bg} ${labelConfig.text}`}
                  >
                    {labelConfig.name}
                  </span>
                );
              })}
            </div>
          )}
          
          {/* Card Title */}
          <h3 className="text-sm font-medium text-gray-800 mb-2">{card.title}</h3>
          
          {/* Description (if any) */}
          {card.description && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{card.description}</p>
          )}
          
          {/* Enhanced Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
            <div className="flex items-center space-x-3">
              {card.dueDate && (
                <span className="flex items-center bg-gray-100 px-2 py-1 rounded">
                  <span className="mr-1">📅</span>
                  {card.dueDate}
                </span>
              )}
              {card.progress && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {card.progress}
                </span>
              )}
            </div>
            
            {/* Card Actions */}
            <div className="flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-gray-400 hover:text-blue-600 p-1"
                title="Edit card"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this card?')) {
                    onDeleteCard(card.id);
                  }
                }}
                className="text-gray-400 hover:text-red-600 p-1"
                title="Delete card"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {/* Edit Hint */}
          <div className="text-xs text-gray-400 mt-2 text-center">
            Double-click to edit
          </div>
        </div>
      )}
    </Draggable>
  );
}