import { useOffline } from '../../lib/offlineContext'
import { useSync } from '../../hooks/useSync'

export function ConnectionBadge() {
  const { isOffline } = useOffline()
  const { pendingCount } = useSync()

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
      <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-green-500'}`} />
      <span className="text-sm font-medium text-gray-700">
        {isOffline ? 'Offline' : 'Online'}
      </span>
      {pendingCount > 0 && (
        <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
          {pendingCount}
        </span>
      )}
    </div>
  )
}
