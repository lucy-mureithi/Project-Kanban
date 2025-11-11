"use client";

export default function SyncPrompt({ syncData, syncStrategies, onClose }) {
  if (!syncData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Configuration Update Detected
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              The board configuration in your code has been updated from version{' '}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {syncData.oldVersion}
              </span>{' '}
              to{' '}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {syncData.newVersion}
              </span>
              . How would you like to proceed?
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={syncStrategies.smartMerge}
            className="w-full text-left p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-gray-900 mb-1">
              🔄 Smart Merge (Recommended)
            </div>
            <div className="text-sm text-gray-600">
              Keep all your cards and progress, but update column names and structure from the code.
            </div>
          </button>

          <button
            onClick={syncStrategies.updateColumnNames}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <div className="font-semibold text-gray-900 mb-1">
              📝 Update Column Names Only
            </div>
            <div className="text-sm text-gray-600">
              Keep everything you have, but update column names and order from the code.
            </div>
          </button>

          <button
            onClick={syncStrategies.replaceAll}
            className="w-full text-left p-4 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors"
          >
            <div className="font-semibold text-gray-900 mb-1">
              🔃 Replace All
            </div>
            <div className="text-sm text-gray-600">
              Discard all current data and load fresh from code configuration. ⚠️ This will delete your cards!
            </div>
          </button>

          <button
            onClick={syncStrategies.keepCurrent}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <div className="font-semibold text-gray-900 mb-1">
              ✋ Keep Current State
            </div>
            <div className="text-sm text-gray-600">
              Ignore code changes and continue with your current board. You can sync later.
            </div>
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <strong>💡 Tip:</strong> Edit <code className="bg-white px-1 py-0.5 rounded">src/config/boardConfig.json</code> to change default columns and cards. Increment the version to trigger this sync prompt.
        </div>
      </div>
    </div>
  );
}
