export { cn } from "cn";
import {
  Code,
  Calculator,
  Atom,
  BookOpen,
  Cpu,
  ShareNetwork,
  GraduationCap,
} from '@phosphor-icons/react';

/**
 * Normalizes subject representation to string name
 * Handles both plain strings (e.g. "Programming") and objects ({ id, name, ... })
 */
export function getSubjectName(s) {
  if (!s) return '';
  if (typeof s === 'string') return s;
  return s.name || s.id || '';
}

/**
 * Normalizes subject id
 */
export function getSubjectId(s) {
  if (!s) return '';
  if (typeof s === 'string') return s;
  return s.id || s.name || '';
}

/**
 * Helper to map string icon names (e.g. from mockData) to a Phosphor React component
 */
export function getSubjectIcon(iconName) {
  switch (iconName) {
    case 'Code':
      return Code;
    case 'Calculator':
      return Calculator;
    case 'Atom':
      return Atom;
    case 'BookOpen':
      return BookOpen;
    case 'Cpu':
      return Cpu;
    case 'Network':
      return ShareNetwork;
    default:
      return GraduationCap;
  }
}

/**
 * Returns human-friendly relative time string (e.g., "5m ago", "2h ago", "yesterday", "just now")
 */
export function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return 'just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

/**
 * Check if a confirmed session date is within the next 24 hours (starts soon)
 */
export function isStartingSoon(confirmedTime) {
  if (!confirmedTime) return false;
  const sessionDate = new Date(confirmedTime).getTime();
  const now = Date.now();
  const diffHours = (sessionDate - now) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours <= 24;
}

/**
 * Generate a random mock platform meeting link
 */
export function generatePlatformMeetingLink() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const randPart = (len) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `https://meet.google.com/skl-${randPart(4)}-${randPart(3)}`;
}
