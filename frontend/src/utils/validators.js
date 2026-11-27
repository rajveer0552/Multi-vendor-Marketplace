export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateLogin(values) {
  const errors = {}

  if (!values.email.trim()) {
    errors.email = 'Email is required'
  } else if (!validateEmail(values.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  }

  return errors
}

export function validateRegistration(values) {
  const errors = validateLogin(values)

  if (!values.first_name.trim()) {
    errors.first_name = 'First name is required'
  } else if (values.first_name.trim().length > 50) {
    errors.first_name = 'Maximum 50 characters allowed'
  }

  if (!values.last_name.trim()) {
    errors.last_name = 'Last name is required'
  } else if (values.last_name.trim().length > 50) {
    errors.last_name = 'Maximum 50 characters allowed'
  }

  if (values.password.length < 6) {
    errors.password = 'Password must contain at least 6 characters'
  } else if (values.password.length > 128) {
    errors.password = 'Password is too long'
  }

  if (!values.password_confirmation) {
    errors.password_confirmation = 'Confirm your password'
  } else if (
    values.password !== values.password_confirmation
  ) {
    errors.password_confirmation = 'Passwords do not match'
  }

  return errors
}