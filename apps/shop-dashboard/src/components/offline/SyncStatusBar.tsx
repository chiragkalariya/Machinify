import { useSync } from '../../hooks/useSync'

export function SyncStatusBar() {
  const { pendingCount, conflictCount, isSyncing, syncNow } = useSync()

  if (pendingCount === 0 && conflictCount === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center gap-3">
        {isSyncing && (
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500 animate-spin" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 5.414 1 1 0 11-1.414-1.414 5.002 5.002 0 10-8.485 4.743A1 1 0 018.71 12H10a1 1 0 011 1v5a1 1 0 11-2 0v-3.101a7 7 0 01.3-13.176A1 1 0 014 2z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        <div className="flex-1">
          {conflictCount > 0 && (
            <p className="text-sm font-medium text-red-600">
              {conflictCount} conflict{conflictCount > 1 ? 's' : ''} need attention
            </p>
          )}
          {pendingCount > 0 && (
            <p className="text-sm font-medium text-gray-700">
              {pendingCount} action{pendingCount > 1 ? 's' : ''} pending sync
            </p>
          )}
        </div>

        <button
          onClick={syncNow}
          disabled={isSyncing}
          className="flex-shrink-0 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sync now
        </button>
      </div>
    </div>
  )
}
