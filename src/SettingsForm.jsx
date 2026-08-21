import { useRef, useState } from 'react'
import './SettingsForm.css'

const INITIAL_VALUES = {
  name: '',
  email: '',
  age: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INTEGER_PATTERN = /^-?\d+$/

export function validateSettings({ name, email, age }) {
  const errors = {}

  if (!name.trim()) {
    errors.name = 'Name is required.'
  }

  if (!email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  const ageValue = String(age).trim()
  if (!ageValue) {
    errors.age = 'Age is required.'
  } else if (!INTEGER_PATTERN.test(ageValue)) {
    errors.age = 'Age must be a number from 13 through 100.'
  } else {
    const ageNumber = Number(ageValue)
    if (ageNumber < 13 || ageNumber > 100) {
      errors.age = 'Age must be a number from 13 through 100.'
    }
  }

  return errors
}

export default function SettingsForm() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const ageRef = useRef(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setSubmitted(false)
    setErrors((prev) => {
      if (!prev[field]) {
        return prev
      }
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateSettings(values)
    setErrors(nextErrors)

    const fieldOrder = ['name', 'email', 'age']
    const refs = { name: nameRef, email: emailRef, age: ageRef }
    const firstInvalid = fieldOrder.find((field) => nextErrors[field])
    if (firstInvalid) {
      setSubmitted(false)
      refs[firstInvalid].current?.focus()
      return
    }

    setSubmitted(true)
  }

  return (
    <form
      className="settings-form"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="settings-heading"
    >
      <header className="settings-form__header">
        <h1 id="settings-heading">Settings</h1>
        <p>Update your name, email, and age.</p>
      </header>

      <fieldset className="settings-form__section">
        <legend>Profile</legend>

        <div className="settings-field">
          <label htmlFor="name">Name</label>
          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name ? (
            <span id="name-error" className="settings-field__error" role="alert">
              {errors.name}
            </span>
          ) : null}
        </div>

        <div className="settings-field">
          <label htmlFor="email">Email</label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email ? (
            <span id="email-error" className="settings-field__error" role="alert">
              {errors.email}
            </span>
          ) : null}
        </div>

        <div className="settings-field">
          <label htmlFor="age">Age</label>
          <input
            ref={ageRef}
            id="age"
            name="age"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={values.age}
            onChange={(e) => update('age', e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.age)}
            aria-describedby={errors.age ? 'age-error' : undefined}
          />
          {errors.age ? (
            <span id="age-error" className="settings-field__error" role="alert">
              {errors.age}
            </span>
          ) : null}
        </div>
      </fieldset>

      <div className="settings-form__actions">
        <button type="submit" className="settings-btn settings-btn--primary">
          Save changes
        </button>
        <p className="settings-form__status" role="status" aria-live="polite">
          {submitted ? 'Settings saved successfully.' : ''}
        </p>
      </div>
    </form>
  )
}
