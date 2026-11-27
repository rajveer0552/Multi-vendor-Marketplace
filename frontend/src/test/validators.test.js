import { describe, expect, it } from 'vitest'

import {
  validateEmail,
  validateLogin,
  validateRegistration,
} from '../utils/validators'

describe('validateEmail', () => {
  it('accepts a valid email address', () => {
    expect(
      validateEmail('customer@example.com'),
    ).toBe(true)
  })

  it('rejects an invalid email address', () => {
    expect(validateEmail('invalid-email')).toBe(false)
  })

  it('rejects an empty email address', () => {
    expect(validateEmail('')).toBe(false)
  })
})

describe('validateLogin', () => {
  it('accepts valid login credentials', () => {
    expect(
      validateLogin({
        email: 'customer@example.com',
        password: 'Test@123456',
      }),
    ).toEqual({})
  })

  it('requires an email address', () => {
    const errors = validateLogin({
      email: '',
      password: 'Test@123456',
    })

    expect(errors.email).toBe('Email is required')
  })

  it('requires a password', () => {
    const errors = validateLogin({
      email: 'customer@example.com',
      password: '',
    })

    expect(errors.password).toBe('Password is required')
  })
})

describe('validateRegistration', () => {
  const validValues = {
    first_name: 'Test',
    last_name: 'Customer',
    email: 'customer@example.com',
    password: 'Test@123456',
    password_confirmation: 'Test@123456',
  }

  it('accepts valid registration details', () => {
    expect(
      validateRegistration(validValues),
    ).toEqual({})
  })

  it('requires a first name', () => {
    const errors = validateRegistration({
      ...validValues,
      first_name: '',
    })

    expect(errors.first_name).toBe(
      'First name is required',
    )
  })

  it('requires a last name', () => {
    const errors = validateRegistration({
      ...validValues,
      last_name: '',
    })

    expect(errors.last_name).toBe(
      'Last name is required',
    )
  })

  it('rejects a short password', () => {
    const errors = validateRegistration({
      ...validValues,
      password: '123',
      password_confirmation: '123',
    })

    expect(errors.password).toBe(
      'Password must contain at least 6 characters',
    )
  })

  it('rejects mismatched passwords', () => {
    const errors = validateRegistration({
      ...validValues,
      password_confirmation: 'DifferentPassword',
    })

    expect(errors.password_confirmation).toBe(
      'Passwords do not match',
    )
  })

  it('rejects an excessively long first name', () => {
    const errors = validateRegistration({
      ...validValues,
      first_name: 'A'.repeat(51),
    })

    expect(errors.first_name).toBe(
      'Maximum 50 characters allowed',
    )
  })
})