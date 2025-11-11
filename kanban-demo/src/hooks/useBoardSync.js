import { useState, useEffect } from 'react';
import boardConfig from '@/config/boardConfig.json';

const STORAGE_KEY = 'kanban-board';
const VERSION_KEY = 'kanban-board-version';

/**
 * Custom hook to manage board state synchronization between:
 * 1. Code configuration (boardConfig.json)
 * 2. LocalStorage (user's runtime changes)
 * 
 * Features:
 * - Loads from localStorage first (preserves user changes)
 * - Detects config version changes (code edits)
 * - Prompts user to sync when code changes are detected
 * - Merges strategies available for different scenarios
 */
export function useBoardSync() {
  const [board, setBoard] = useState(boardConfig.board);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);
  const [syncData, setSyncData] = useState(null);

  // Initialize board state on mount
  useEffect(() => {
    const savedBoard = localStorage.getItem(STORAGE_KEY);
    const savedVersion = localStorage.getItem(VERSION_KEY);
    const configVersion = boardConfig.version;

    if (savedBoard && savedVersion) {
      try {
        const parsedBoard = JSON.parse(savedBoard);
        
        // Check if config version has changed (code was edited)
        if (savedVersion !== configVersion) {
          console.log('🔄 Config version changed:', savedVersion, '→', configVersion);
          
          // Show sync prompt to user
          setShowSyncPrompt(true);
          setSyncData({
            savedBoard: parsedBoard,
            newConfig: boardConfig.board,
            oldVersion: savedVersion,
            newVersion: configVersion
          });
          
          // Load saved board for now
          setBoard(parsedBoard);
        } else {
          // Same version, use saved board
          setBoard(parsedBoard);
        }
      } catch (error) {
        console.error('Error loading saved board:', error);
        setBoard(boardConfig.board);
        localStorage.setItem(VERSION_KEY, configVersion);
      }
    } else {
      // No saved data, use config
      setBoard(boardConfig.board);
      localStorage.setItem(VERSION_KEY, configVersion);
    }
    
    setHasLoaded(true);
  }, []);

  // Save board to localStorage whenever it changes
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
      console.log('💾 Board saved to localStorage');
    }
  }, [board, hasLoaded]);

  /**
   * Sync strategies for handling config changes
   */
  const syncStrategies = {
    // Replace everything with new config
    replaceAll: () => {
      setBoard(boardConfig.board);
      localStorage.setItem(VERSION_KEY, boardConfig.version);
      setShowSyncPrompt(false);
      setSyncData(null);
    },

    // Keep user data, only update column names from config
    updateColumnNames: () => {
      if (!syncData) return;
      
      const updatedBoard = {
        stages: syncData.savedBoard.stages.map(savedStage => {
          const configStage = boardConfig.board.stages.find(
            cs => cs.id === savedStage.id
          );
          
          return {
            ...savedStage,
            name: configStage ? configStage.name : savedStage.name,
            order: configStage ? configStage.order : savedStage.order
          };
        })
      };
      
      setBoard(updatedBoard);
      localStorage.setItem(VERSION_KEY, boardConfig.version);
      setShowSyncPrompt(false);
      setSyncData(null);
    },

    // Intelligent merge: keep user cards, sync everything else
    smartMerge: () => {
      if (!syncData) return;
      
      const mergedStages = boardConfig.board.stages.map(configStage => {
        const savedStage = syncData.savedBoard.stages.find(
          ss => ss.id === configStage.id
        );
        
        if (savedStage) {
          // Keep user's cards but update stage metadata
          return {
            ...configStage,
            cards: savedStage.cards
          };
        }
        
        return configStage;
      });
      
      setBoard({ stages: mergedStages });
      localStorage.setItem(VERSION_KEY, boardConfig.version);
      setShowSyncPrompt(false);
      setSyncData(null);
    },

    // Dismiss and keep current state (mark version as synced)
    keepCurrent: () => {
      localStorage.setItem(VERSION_KEY, boardConfig.version);
      setShowSyncPrompt(false);
      setSyncData(null);
    }
  };

  /**
   * Force reload from config (useful for reset)
   */
  const reloadFromConfig = () => {
    setBoard(boardConfig.board);
    localStorage.setItem(VERSION_KEY, boardConfig.version);
  };

  /**
   * Clear all saved data
   */
  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VERSION_KEY);
    setBoard(boardConfig.board);
  };

  return {
    board,
    setBoard,
    hasLoaded,
    showSyncPrompt,
    syncStrategies,
    reloadFromConfig,
    clearStorage,
    syncData
  };
}
