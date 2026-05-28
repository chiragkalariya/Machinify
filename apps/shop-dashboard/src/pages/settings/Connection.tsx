import { useOffline } from '../../lib/offlineContext'
import { useSync } from '../../hooks/useSync'
import type { ConnectionMode, OfflineFeatures, OfflineSyncSettings } from '@bizflow/types'

const FEATURE_LABELS: Record<keyof OfflineFeatures, string> = {
  orders: 'Create & manage orders',
  inventory: 'Inventory management',
  invoices: 'Invoice & billing',
  ledger: 'Accounts & ledger',
  delivery: 'Delivery tracking',
  notifications: 'WhatsApp notifications'
}

const FEATURE_DESCRIPTIONS: Record<keyof OfflineFeatures, string> = {
  orders: 'Work with orders offline',
  inventory: 'Update stock levels offline',
  invoices: 'Create invoices offline',
  ledger: 'Record ledger entries offline',
  delivery: 'Track shipments in real-time',
  notifications: 'Receive WhatsApp messages'
}

export function Connection() {
  const { settings, update } = useOffline()
  const { pendingCount } = useSync()

  const handleModeChange = (mode: ConnectionMode) => {
    update({ mode })
  }

  const handleFeatureToggle = (feature: keyof OfflineFeatures) => {
    if (feature === 'delivery') return // Locked feature
    update({
      features: {
        ...settings.features,
        [feature]: !settings.features[feature]
      }
    })
  }

  const handleSyncSettingToggle = (key: keyof OfflineSyncSettings) => {
    update({
      sync: {
        ...settings.sync,
        [key]: !settings.sync[key]
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connection Settings</h1>
        {pendingCount > 0 && (
          <p className="text-sm text-blue-600 font-medium">
            {pendingCount} action{pendingCount > 1 ? 's' : ''} pending sync
          </p>
        )}
      </div>

      {/* Section 1: Connection Mode */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['auto', 'offline', 'online'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                settings.mode === mode
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  settings.mode === mode ? 'border-blue-500' : 'border-gray-300'
                }`}>
                  {settings.mode === mode && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
                <h3 className="font-semibold text-gray-900 capitalize">{mode}</h3>
              </div>
              <p className="text-sm text-gray-600">
                {mode === 'auto' && 'Automatically follow your internet connection'}
                {mode === 'offline' && 'Always work offline, never sync automatically'}
                {mode === 'online' && 'Require internet connection to work'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Feature Toggles */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Offline Features</h2>
        <div className="space-y-3">
          {(Object.keys(FEATURE_LABELS) as Array<keyof OfflineFeatures>).map(feature => (
            <div key={feature} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">{FEATURE_LABELS[feature]}</label>
                <p className="text-xs text-gray-500 mt-1">{FEATURE_DESCRIPTIONS[feature]}</p>
              </div>
              <button
                onClick={() => handleFeatureToggle(feature)}
                disabled={feature === 'delivery'}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                  settings.features[feature]
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                } ${feature === 'delivery' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                title={feature === 'delivery' ? 'Delivery tracking requires live connection' : ''}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  settings.features[feature] ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Auto-sync Settings */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Auto-Sync Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-900">Sync on reconnect</label>
              <p className="text-xs text-gray-500 mt-1">Automatically sync pending actions when connection returns</p>
            </div>
            <button
              onClick={() => handleSyncSettingToggle('onReconnect')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                settings.sync.onReconnect ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                settings.sync.onReconnect ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-900">Notify on complete</label>
              <p className="text-xs text-gray-500 mt-1">Show notification when sync finishes</p>
            </div>
            <button
              onClick={() => handleSyncSettingToggle('notifyOnComplete')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                settings.sync.notifyOnComplete ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                settings.sync.notifyOnComplete ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-900">Alert on conflict</label>
              <p className="text-xs text-gray-500 mt-1">Show alert when sync conflicts are detected</p>
            </div>
            <button
              onClick={() => handleSyncSettingToggle('alertOnConflict')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                settings.sync.alertOnConflict ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                settings.sync.alertOnConflict ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
