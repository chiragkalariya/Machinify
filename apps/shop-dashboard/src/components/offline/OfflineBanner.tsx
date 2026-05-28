import { useOffline } from '../../lib/offlineContext'

export function OfflineBanner() {
  const { isOffline } = useOffline()

  if (!isOffline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 border-b border-yellow-300 px-4 py-3 flex items-center gap-3">
      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
      </svg>
      <p className="text-sm font-medium text-yellow-800">
        You are working offline. Changes will sync when connection is restored.
      </p>
    </div>
  )
}
