// src/lib/validators.js

// Allowed NED student email domain (single source of truth)
// verify exact NED student email domain
export const ALLOWED_EMAIL_DOMAIN = 'neduet.edu.pk';
export const MIN_GPA = 3.0;

export const SENSITIVE_KEYWORDS = [
  'whatsapp',
  'phone',
  'call me',
  'contact number',
  'cell',
  'paid',
  'assignment for money',
  'pay me',
  'easypaisa',
  'jazzcash',
];

/**
 * Validates that an email ends with the allowed university domain (neduet.edu.pk or subdomain)
 */
export function validateUniversityEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const atParts = trimmed.split('@');
  if (atParts.length !== 2) return false;
  const domain = atParts[1];
  return domain === ALLOWED_EMAIL_DOMAIN || domain.endsWith('.' + ALLOWED_EMAIL_DOMAIN);
}

/**
 * Calculate password strength (score: 0 to 3)
 * 0/1: Weak, 2: Medium, 3: Strong
 */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: 'None', width: '0%', color: 'bg-black/10' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8 && (/[A-Z]/.test(password) || /[0-9]/.test(password))) score += 1;
  if (password.length >= 10 && /[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  if (score === 1) return { score: 1, label: 'Weak', width: '33%', color: 'bg-[#B9503A]' };
  if (score === 2) return { score: 2, label: 'Medium', width: '66%', color: 'bg-[#E0A030]' };
  return { score: 3, label: 'Strong', width: '100%', color: 'bg-[#5E9680]' };
}

/**
 * Auto-detect department and batch/year hints from NED student email
 * e.g., 'ct-22089@neduet.edu.pk' -> department 'Computer Science', batch '22' -> Year 4
 * e.g., 'se-23012@neduet.edu.pk' -> department 'Software Engineering', Year 3
 */
export function guessAcademicFromEmail(email) {
  if (!email || typeof email !== 'string') return null;
  const username = email.split('@')[0].toLowerCase();

  const deptMap = {
    ct: 'Computer Science',
    cs: 'Computer Science',
    se: 'Software Engineering',
    ee: 'Electrical Engineering',
    el: 'Electronics Engineering',
    tc: 'Telecommunication Engineering',
    ce: 'Civil Engineering',
    me: 'Mechanical Engineering',
    te: 'Textile Engineering',
    ch: 'Chemical Engineering',
    be: 'Bio-Medical Engineering',
    im: 'Industrial & Manufacturing',
  };

  let detectedDept = null;
  let detectedYear = null;

  for (const [key, deptName] of Object.entries(deptMap)) {
    const regex = new RegExp(`(^|[^a-z])${key}([^a-z]|$)`, 'i');
    if (regex.test(username)) {
      detectedDept = deptName;
      break;
    }
  }

  const batchMatch = username.match(/(?:22|23|24|25|26)/);
  if (batchMatch) {
    const batch = batchMatch[0];
    if (batch === '22') detectedYear = 4;
    else if (batch === '23') detectedYear = 3;
    else if (batch === '24') detectedYear = 2;
    else if (batch === '25') detectedYear = 1;
    else if (batch === '26') detectedYear = 1;
  }

  if (detectedDept || detectedYear) {
    return {
      department: detectedDept || 'Computer Science',
      year: detectedYear || 3,
      label: `Looks like ${detectedDept || 'Computer Science'}${detectedYear ? `, Year ${detectedYear}` : ''}. Use this?`,
    };
  }

  return null;
}
