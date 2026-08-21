import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import SettingsForm, { validateSettings } from './SettingsForm.jsx'

function renderForm() {
  const user = userEvent.setup()
  render(<SettingsForm />)
  return {
    user,
    name: screen.getByLabelText(/^name$/i),
    email: screen.getByLabelText(/^email$/i),
    age: screen.getByLabelText(/^age$/i),
    submit: screen.getByRole('button', { name: /save changes/i }),
  }
}

function successMessage() {
  return screen.queryByText('Settings saved successfully.')
}

describe('validateSettings', () => {
  it('requires name, email, and age', () => {
    expect(validateSettings({ name: '  ', email: '', age: '' })).toEqual({
      name: 'Name is required.',
      email: 'Email is required.',
      age: 'Age is required.',
    })
  })

  it('rejects invalid email format', () => {
    expect(
      validateSettings({ name: 'Ada', email: 'ada@', age: '30' }).email,
    ).toBe('Enter a valid email address.')
  })

  it('accepts emails with surrounding whitespace', () => {
    expect(
      validateSettings({ name: 'Ada', email: '  ada@example.com  ', age: '30' }),
    ).toEqual({})
  })

  it('rejects non-numeric, too-young, and too-old ages', () => {
    expect(validateSettings({ name: 'Ada', email: 'ada@example.com', age: 'abc' }).age)
      .toBe('Age must be a number from 13 through 100.')
    expect(validateSettings({ name: 'Ada', email: 'ada@example.com', age: '12' }).age)
      .toBe('Age must be a number from 13 through 100.')
    expect(validateSettings({ name: 'Ada', email: 'ada@example.com', age: '101' }).age)
      .toBe('Age must be a number from 13 through 100.')
    expect(validateSettings({ name: 'Ada', email: 'ada@example.com', age: '13.5' }).age)
      .toBe('Age must be a number from 13 through 100.')
    expect(validateSettings({ name: 'Ada', email: 'ada@example.com', age: '-13' }).age)
      .toBe('Age must be a number from 13 through 100.')
  })

  it('accepts ages 13 and 100', () => {
    expect(validateSettings({ name: 'Ada', email: 'ada@example.com', age: '13' })).toEqual({})
    expect(validateSettings({ name: 'Ada', email: 'ada@example.com', age: '100' })).toEqual({})
    expect(validateSettings({ name: 'Ada', email: 'ada@example.com', age: ' 42 ' })).toEqual({})
  })
})

describe('SettingsForm', () => {
  it('associates labels with inputs for keyboard and screen reader use', () => {
    const { name, email, age } = renderForm()
    expect(name).toHaveAttribute('id', 'name')
    expect(email).toHaveAttribute('id', 'email')
    expect(age).toHaveAttribute('id', 'age')
    expect(screen.getByText('Name')).toHaveAttribute('for', 'name')
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email')
    expect(screen.getByText('Age')).toHaveAttribute('for', 'age')
  })

  it('does not show validation errors before submit', async () => {
    const { user, name, email, age } = renderForm()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(successMessage()).not.toBeInTheDocument()

    await user.type(name, 'Ada')
    await user.type(email, 'not-an-email')
    await user.type(age, '12')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(successMessage()).not.toBeInTheDocument()
  })

  it('shows field-specific errors for empty fields on submit', async () => {
    const { user, submit } = renderForm()
    await user.click(submit)

    expect(screen.getByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Age is required.')).toBeInTheDocument()
    expect(successMessage()).not.toBeInTheDocument()
  })

  it('shows an email format error', async () => {
    const { user, name, email, age, submit } = renderForm()
    await user.type(name, 'Ada Lovelace')
    await user.type(email, 'not-an-email')
    await user.type(age, '36')
    await user.click(submit)

    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument()
    expect(email).toHaveValue('not-an-email')
  })

  it('preserves entered values when validation fails', async () => {
    const { user, name, email, age, submit } = renderForm()
    await user.type(name, 'Ada')
    await user.type(email, 'ada@example.com')
    await user.type(age, '12')
    await user.click(submit)

    expect(screen.getByText('Age must be a number from 13 through 100.')).toBeInTheDocument()
    expect(name).toHaveValue('Ada')
    expect(email).toHaveValue('ada@example.com')
    expect(age).toHaveValue('12')
  })

  it('shows a success message on valid submit without reloading', async () => {
    const { user, name, email, age, submit } = renderForm()
    await user.type(name, 'Ada Lovelace')
    await user.type(email, 'ada@example.com')
    await user.type(age, '36')
    await user.click(submit)

    expect(screen.getByRole('status')).toHaveTextContent('Settings saved successfully.')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(name).toHaveValue('Ada Lovelace')
    expect(email).toHaveValue('ada@example.com')
    expect(age).toHaveValue('36')
    expect(screen.getByRole('form', { name: /settings/i })).toBeInTheDocument()
  })

  it('saves when submitting with the keyboard', async () => {
    const { user, name, email, age } = renderForm()
    await user.type(name, 'Ada Lovelace')
    await user.type(email, 'ada@example.com')
    await user.type(age, '36{Enter}')

    expect(screen.getByRole('status')).toHaveTextContent('Settings saved successfully.')
  })

  it('accepts boundary ages in the form', async () => {
    const { user, name, email, age, submit } = renderForm()
    await user.type(name, 'Ada')
    await user.type(email, 'ada@example.com')
    await user.type(age, '13')
    await user.click(submit)
    expect(screen.getByRole('status')).toHaveTextContent('Settings saved successfully.')

    await user.clear(age)
    await user.type(age, '100')
    await user.click(submit)
    expect(screen.getByRole('status')).toHaveTextContent('Settings saved successfully.')
  })

  it('moves focus to the first invalid field on submit', async () => {
    const { user, name, submit } = renderForm()
    await user.click(submit)
    expect(name).toHaveFocus()
  })

  it('clears a field error when the user edits that field after submit', async () => {
    const { user, name, email, age, submit } = renderForm()
    await user.click(submit)
    expect(screen.getByText('Name is required.')).toBeInTheDocument()

    await user.type(name, 'Ada')
    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Age is required.')).toBeInTheDocument()
    expect(email).toHaveValue('')
    expect(age).toHaveValue('')
  })
})
