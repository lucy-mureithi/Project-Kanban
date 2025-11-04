"use client";
import { useState, useEffect } from "react";
import Board from "@/component/kanban/Board.jsx";

// Default board data
const defaultBoard = {
  stages: [
    {
      id: "stage-1",
      name: "Backlog",
      order: 0,
      cards: [
        { 
          id: "card-1", 
          title: "Project Demo", 
          description: "Project design",
          dueDate: "Mar 18",
          labels: ["design", "feature"],
          order: 0 
        },
        { 
          id: "card-2", 
          title: "Pre-Consultation Assessment", 
          description: "Create pre-consultation form",
          dueDate: "Mar 18", 
          labels: ["research"],
          order: 1 
        }
      ],
    },
    {
      id: "stage-2", 
      name: "To Do (Current Sprint)",
      order: 1,
      cards: [
        { 
          id: "card-3", 
          title: "Market Reports Access Implementation", 
          description: "Integrate market data API",
          dueDate: "Mar 4",
          progress: "0/9",
          labels: ["development", "api"],
          order: 0 
        }
      ],
    },
    {
      id: "stage-3",
      name: "Review/QA", 
      order: 2,
      cards: [],
    },
    {
      id: "stage-4",
      name: "In Progress",
      order: 3, 
      cards: [],
    },
    {
      id: "stage-5",
      name: "Done",
      order: 4,
      cards: [],
    },
    {
      id: "stage-6", 
      name: "Post-Consultation Reports",
      order: 5,
      cards: [],
    }
  ],
};

export default function Home() {
  const [board, setBoard] = useState(defaultBoard);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load board from localStorage on component mount
  useEffect(() => {
    const savedBoard = localStorage.getItem('kanban-board');
    if (savedBoard) {
      try {
        setBoard(JSON.parse(savedBoard));
      } catch (error) {
        console.error('Error loading saved board:', error);
      }
    }
    setHasLoaded(true);
  }, []);

  // Save board to localStorage whenever it changes
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('kanban-board', JSON.stringify(board));
      console.log('💾 Board saved to localStorage');
    }
  }, [board, hasLoaded]);

  const addCard = (stageId, title) => {
    if (!title || !title.trim()) return;
    setBoard((prev) => ({
      stages: prev.stages.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              cards: [
                ...stage.cards,
                { 
                  id: Date.now().toString(), 
                  title: title.trim(), 
                  description: "",
                  dueDate: "",
                  progress: "",
                  labels: [],
                  order: stage.cards.length 
                },
              ],
            }
          : stage
      ),
    }));
  };

  const handleCardMove = (source, destination, cardId) => {
    setBoard((prevBoard) => {
      const updatedStages = JSON.parse(JSON.stringify(prevBoard.stages));
      
      const sourceStage = updatedStages.find(stage => stage.id === source.droppableId);
      const destinationStage = updatedStages.find(stage => stage.id === destination.droppableId);
      
      if (!sourceStage || !destinationStage) return prevBoard;

      const cardIndex = sourceStage.cards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) return prevBoard;

      const [movedCard] = sourceStage.cards.splice(cardIndex, 1);
      destinationStage.cards.splice(destination.index, 0, movedCard);
      
      sourceStage.cards.forEach((card, index) => {
        card.order = index;
      });
      
      destinationStage.cards.forEach((card, index) => {
        card.order = index;
      });

      return {
        ...prevBoard,
        stages: updatedStages
      };
    });
  };

  // EDIT CARD FUNCTION
  const handleEditCard = (cardId, updates) => {
    setBoard((prev) => ({
      stages: prev.stages.map((stage) => ({
        ...stage,
        cards: stage.cards.map((card) =>
          card.id === cardId ? { ...card, ...updates } : card
        ),
      })),
    }));
  };

  // DELETE CARD FUNCTION
  const handleDeleteCard = (cardId) => {
    setBoard((prev) => ({
      stages: prev.stages.map((stage) => ({
        ...stage,
        cards: stage.cards.filter((card) => card.id !== cardId),
      })),
    }));
  };

  const resetBoard = () => {
    if (confirm('Are you sure you want to reset the board? This will clear all your changes.')) {
      setBoard(defaultBoard);
      localStorage.removeItem('kanban-board');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
          💾 Auto-saved
        </div>
        <button
          onClick={resetBoard}
          className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded hover:bg-red-200"
        >
          Reset Board
        </button>
      </div>
      
      <Board 
        board={board} 
        onAddCard={addCard} 
        onCardMove={handleCardMove}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
      />
    </div>
  );
}