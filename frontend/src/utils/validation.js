import { isValidPhoneNumber } from 'react-phone-number-input';

export function isBlank(value) {
  return value == null || String(value).trim() === '';
}

export function validateRequired(value, fieldLabel = 'This field') {
  return isBlank(value) ? `${fieldLabel} is required.` : '';
}

export function validateLength(value, { min, max } = {}, fieldLabel = 'This field') {
  if (isBlank(value)) return '';
  const len = String(value).trim().length;
  if (typeof min === 'number' && len < min) return `${fieldLabel} must be at least ${min} characters.`;
  if (typeof max === 'number' && len > max) return `${fieldLabel} must be at most ${max} characters.`;
  return '';
}

export function validateEmail(value) {
  if (isBlank(value)) return '';
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
  return ok ? '' : 'Please enter a valid email address.';
}

export function validatePhoneE164(value, fieldLabel = 'Phone number') {
  if (isBlank(value)) return '';
  try {
    return isValidPhoneNumber(value) ? '' : `Please enter a valid ${fieldLabel} (include country code).`;
  } catch {
    return `Please enter a valid ${fieldLabel} (include country code).`;
  }
}

export function validateNumber(value, { min, max } = {}, fieldLabel = 'This field') {
  if (isBlank(value)) return '';
  const n = Number(value);
  if (Number.isNaN(n)) return `${fieldLabel} must be a number.`;
  if (typeof min === 'number' && n < min) return `${fieldLabel} must be at least ${min}.`;
  if (typeof max === 'number' && n > max) return `${fieldLabel} must be at most ${max}.`;
  return '';
}

export function validatePassword(value, {
  minLength = 8,
  maxLength = 128,
  requireUpper = true,
  requireLower = true,
  requireNumber = true,
  requireSpecial = true,
} = {}) {
  if (isBlank(value)) return '';
  const v = String(value);
  if (v.length < minLength) return `Password must be at least ${minLength} characters.`;
  if (v.length > maxLength) return `Password must be at most ${maxLength} characters.`;
  if (requireUpper && !/[A-Z]/.test(v)) return 'Password must include at least 1 uppercase letter (A-Z).';
  if (requireLower && !/[a-z]/.test(v)) return 'Password must include at least 1 lowercase letter (a-z).';
  if (requireNumber && !/[0-9]/.test(v)) return 'Password must include at least 1 number (0-9).';
  if (requireSpecial && !/[^\w\s]/.test(v)) return 'Password must include at least 1 special character (e.g. !@#$%).';
  return '';
}


