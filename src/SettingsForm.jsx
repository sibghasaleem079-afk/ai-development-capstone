import { useEffect, useState } from 'react'
import './SettingsForm.css'

const STORAGE_KEY = 'ai-workflow-drill-settings'

const DEFAULT_SETTINGS = {
  displayName: '',
  email: '',
  theme: 'system',
  language: 'en',
  emailNotifications: true,
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const settings = raw
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
      : { ...DEFAULT_SETTINGS }
    applyTheme(settings.theme)
    return settings
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme)
  } else {
    root.removeAttribute('data-theme')
  }
}

export default function SettingsForm() {
  const [settings, setSettings] = useState(loadSettings)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    applyTheme(settings.theme)
  }, [settings.theme])

  function update(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function validate(data) {
    const next = {}
    if (!data.displayName.trim()) {
      next.displayName = 'Enter a display name.'
    }
    if (!data.email.trim()) {
      next.email = 'Enter an email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(settings)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    applyTheme(settings.theme)
    setSaved(true)
  }

  function handleReset() {
    setSettings({ ...DEFAULT_SETTINGS })
    setErrors({})
    setSaved(false)
    localStorage.removeItem(STORAGE_KEY)
    applyTheme(DEFAULT_SETTINGS.theme)
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <header className="settings-form__header">
        <h1>Settings</h1>
        <p>Update your profile, appearance, and notification preferences.</p>
      </header>

      <fieldset className="settings-form__section">
        <legend>Profile</legend>

        <label className="settings-field" htmlFor="displayName">
          Display name
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            value={settings.displayName}
            onChange={(e) => update('displayName', e.target.value)}
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby={errors.displayName ? 'displayName-error' : undefined}
          />
          {errors.displayName ? (
            <span id="displayName-error" className="settings-field__error" role="alert">
              {errors.displayName}
            </span>
          ) : null}
        </label>

        <label className="settings-field" htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={settings.email}
            onChange={(e) => update('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email ? (
            <span id="email-error" className="settings-field__error" role="alert">
              {errors.email}
            </span>
          ) : null}
        </label>
      </fieldset>

      <fieldset className="settings-form__section">
        <legend>Appearance</legend>

        <label className="settings-field" htmlFor="theme">
          Theme
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={(e) => update('theme', e.target.value)}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label className="settings-field" htmlFor="language">
          Language
          <select
            id="language"
            name="language"
            value={settings.language}
            onChange={(e) => update('language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </label>
      </fieldset>

      <fieldset className="settings-form__section">
        <legend>Notifications</legend>

        <label className="settings-toggle" htmlFor="emailNotifications">
          <input
            id="emailNotifications"
            name="emailNotifications"
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => update('emailNotifications', e.target.checked)}
          />
          <span>
            Email notifications
            <small>Receive product updates and account alerts by email.</small>
          </span>
        </label>
      </fieldset>

      <div className="settings-form__actions">
        <button type="submit" className="settings-btn settings-btn--primary">
          Save changes
        </button>
        <button type="button" className="settings-btn" onClick={handleReset}>
          Reset
        </button>
        {saved ? (
          <p className="settings-form__status" role="status">
            Settings saved.
          </p>
        ) : null}
      </div>
    </form>
  )
}
