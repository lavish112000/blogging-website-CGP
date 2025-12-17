'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Globe, Search, Bell, Save } from 'lucide-react'

/**
 * ADMIN SETTINGS
 * Site configuration and preferences
 * ADMIN ONLY - Protected by layout
 * NO INDEX - Blocked from search engines via parent layout
 */
export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Tech-Knowlogia',
    tagline: 'Premium Knowledge for Modern Professionals',
    defaultAuthor: 'Lalit Choudhary',
    googleSearchConsole: 'xFq0YlVAHvByrrreIXbZo37PxtrJ5_j9Ypw3l9rzQsc',
    discoverEnabled: true,
    breakingNewsNotifications: true,
    aiDraftEnabled: true,
    editorialWorkflow: true,
  })

  const [saving, setSaving] = useState(false)

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // In production, save to API or database
      // await fetch('/api/admin/settings', { method: 'PUT', body: JSON.stringify(settings) })
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your site settings and preferences
          </p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">General Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => updateSetting('siteName', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => updateSetting('tagline', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Author</label>
            <input
              type="text"
              value={settings.defaultAuthor}
              onChange={(e) => updateSetting('defaultAuthor', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">SEO & Discovery</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Google Search Console Verification</label>
            <input
              type="text"
              value={settings.googleSearchConsole}
              onChange={(e) => updateSetting('googleSearchConsole', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              placeholder="Verification code"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Already configured in layout.tsx metadata
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-medium">Google Discover Optimization</p>
              <p className="text-sm text-muted-foreground">Enable Google Discover features</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.discoverEnabled}
                onChange={(e) => updateSetting('discoverEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Features</h2>
        </div>
        <div className="space-y-3">
          <ToggleFeature
            title="Breaking News Notifications"
            description="Send push notifications for breaking news"
            enabled={settings.breakingNewsNotifications}
            onChange={(val) => updateSetting('breakingNewsNotifications', val)}
          />

          <ToggleFeature
            title="AI Draft Generation"
            description="Enable AI-assisted article drafting"
            enabled={settings.aiDraftEnabled}
            onChange={(val) => updateSetting('aiDraftEnabled', val)}
          />

          <ToggleFeature
            title="Editorial Workflow"
            description="Require admin approval before publishing"
            enabled={settings.editorialWorkflow}
            onChange={(val) => updateSetting('editorialWorkflow', val)}
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border-2 border-red-500 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Clear Analytics Data</p>
              <p className="text-sm text-muted-foreground">Reset all view counts and analytics</p>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
              Clear Data
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rebuild Sitemap</p>
              <p className="text-sm text-muted-foreground">Regenerate sitemap and news sitemap</p>
            </div>
            <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm">
              Rebuild
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> Settings are currently stored in component state. For production, integrate with a database or configuration file to persist changes.
        </p>
      </div>
    </div>
  )
}

function ToggleFeature({
  title,
  description,
  enabled,
  onChange
}: {
  title: string
  description: string
  enabled: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  )
}
