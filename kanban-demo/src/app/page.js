"use client";
import Board from "@/component/kanban/Board.jsx";
import SyncPrompt from "@/component/SyncPrompt.jsx";
import { useBoardSync } from "@/hooks/useBoardSync";

export default function Home() {
  const { 
    board, 
    setBoard, 
    hasLoaded, 
    showSyncPrompt, 
    syncStrategies, 
    reloadFromConfig, 
    clearStorage, 
    syncData 
  } = useBoardSync();

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

  // EDIT COLUMN NAME FUNCTION
  const handleEditColumn = (stageId, newName) => {
    setBoard((prev) => ({
      stages: prev.stages.map((stage) =>
        stage.id === stageId ? { ...stage, name: newName } : stage
      ),
    }));
  };

  const resetBoard = () => {
    if (confirm('Are you sure you want to reset the board? This will clear all your changes and reload from config.')) {
      clearStorage();
      reloadFromConfig();
    }
  };

  // Calculate stats
  const totalMembers = board.stages.reduce((sum, stage) => sum + stage.cards.length, 0);
  const activeMembers = board.stages.find(s => s.id === 'active')?.cards.length || 0;
  const pendingRenewals = board.stages.find(s => s.id === 'pending-renewal')?.cards.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Sync Prompt Modal */}
      {showSyncPrompt && (
        <SyncPrompt 
          syncData={syncData} 
          syncStrategies={syncStrategies}
        />
      )}
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              🏋️ FitOps
              <span className="ml-3 text-sm font-normal text-gray-500">Gym Management Dashboard</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Track member progress, renewals, and engagement in real-time
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => reloadFromConfig()}
              className="text-sm text-blue-600 bg-blue-100 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              title="Reload board from config file"
            >
              🔄 Reload
            </button>
            <button
              onClick={resetBoard}
              className="text-sm text-red-600 bg-red-100 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              🗑️ Reset
            </button>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{totalMembers}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow-sm p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-700">{activeMembers}</div>
            <div className="text-sm text-green-600">Active Members</div>
          </div>
          <div className="bg-orange-50 rounded-lg shadow-sm p-4 border border-orange-200">
            <div className="text-2xl font-bold text-orange-700">{pendingRenewals}</div>
            <div className="text-sm text-orange-600">Pending Renewals</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
            <div className="flex items-center">
              <span className="text-sm text-green-600 font-medium">💾 Auto-saved</span>
              <span className="ml-2 text-xs text-gray-500">• Click columns to edit</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Board */}
      <Board 
        board={board} 
        onAddCard={addCard} 
        onCardMove={handleCardMove}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        onEditColumn={handleEditColumn}
      />
      
      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>💡 Drag members between stages • Double-click to edit details • System syncs with Google Sheets</p>
      </div>
    </div>
  );
}