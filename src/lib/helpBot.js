// src/lib/helpBot.js

export const HELP_INTENTS = [
  {
    id: 'what-is',
    keywords: ['what is', 'skill share', 'kya hai', 'purpose', 'about', 'platform'],
    answer: 'Skill Share is a peer mentoring platform at NED University of Engineering & Technology. It connects junior students with experienced seniors for free, 1-on-1 academic guidance.',
    actions: [
      { label: 'View Mentors', path: '/mentors' },
      { label: 'How it works', path: '/#how-it-works' },
    ],
  },
  {
    id: 'is-free',
    keywords: ['free', 'cost', 'fee', 'charge', 'price', 'paisa', 'paise', 'fees', 'free hai'],
    answer: 'Yes, Skill Share is 100% free. Mentors volunteer their time to give back to the NED community, and hours count toward community engagement certificates.',
    actions: [{ label: 'Find a Mentor', path: '/mentors' }],
  },
  {
    id: 'how-to-signup',
    keywords: ['sign up', 'signup', 'register', 'account', 'email', 'domain', 'join', 'kaise banau'],
    answer: 'Sign up requires a valid NED student email ending in @neduet.edu.pk. Select whether you are a junior seeking guidance or applying as a senior mentor.',
    actions: [{ label: 'Open Sign Up', path: '/auth' }],
  },
  {
    id: 'find-mentor',
    keywords: ['find', 'search', 'mentor', 'dhundo', 'subject', 'filter', 'course'],
    answer: 'Go to the Mentors page to search by subject (Programming, Calculus, Physics, etc.) or filter by department. You can review profiles, ratings, and volunteer hours.',
    actions: [{ label: 'Go to Mentors', path: '/mentors' }],
  },
  {
    id: 'ranking',
    keywords: ['ranking', 'score', 'algorithm', 'gpa', 'feedback', 'rank', 'top mentor'],
    answer: 'Mentor ranking is driven primarily by student feedback and session reliability, not just GPA. New mentors receive a fair boost to help them schedule their first sessions.',
    actions: [{ label: 'Browse Top Mentors', path: '/mentors' }],
  },
  {
    id: 'request-session',
    keywords: ['request', 'book', 'session kaise', 'schedule', 'ask', 'appointment'],
    answer: 'Open any mentor profile, select an available time slot, describe what topic you need help with, and submit. The mentor receives a notification to accept or propose another slot.',
    actions: [{ label: 'Browse Mentors', path: '/mentors' }],
  },
  {
    id: 'after-request',
    keywords: ['after request', 'kya hoga', 'pending', 'wait', 'approval', 'next'],
    answer: 'After you send a request, the mentor will review your topic and slot. Once accepted, a verified meeting link will be generated in your session thread.',
    actions: [{ label: 'My Sessions', path: '/sessions' }],
  },
  {
    id: 'become-mentor',
    keywords: ['become a mentor', 'apply', 'mentor kaise banu', 'gpa minimum', 'volunteer', 'senior'],
    answer: 'Seniors with a minimum CGPA of 3.0 can apply. You will select your strong subjects, upload an unofficial transcript verification, and accept the code of conduct.',
    actions: [{ label: 'Become a Mentor', path: '/auth?tab=mentor' }],
  },
  {
    id: 'duration',
    keywords: ['how long', 'duration', 'time', 'length', 'hours', 'kitni der', 'online'],
    answer: 'Sessions are 1-on-1 and conducted online. The standard duration is 1 hour (minimum 60 minutes). Group sessions can also be arranged with up to 3 peers.',
  },
  {
    id: 'cancel-reschedule',
    keywords: ['reschedule', 'cancel', 'change time', 'clash', 'can cel'],
    answer: 'You can reschedule or cancel a session directly from the My Sessions page before the confirmed slot starts. Always leave a quick reason so your peer is informed.',
    actions: [{ label: 'My Sessions', path: '/sessions' }],
  },
  {
    id: 'feedback',
    keywords: ['feedback', 'review', 'rating', 'star', 'stars', 'tareef'],
    answer: 'Once a session is marked completed, a feedback prompt appears. Rate from 1 to 5 stars and add an optional comment. Honest reviews help maintain platform quality.',
    actions: [{ label: 'View Sessions', path: '/sessions' }],
  },
  {
    id: 'privacy',
    keywords: ['privacy', 'phone', 'contact', 'whatsapp', 'number', 'hidden', 'safe', 'safety'],
    answer: 'Contact details (phone and personal email) remain strictly private until a session is confirmed. All academic coordination happens inside the thread to protect student safety.',
  },
  {
    id: 'report-problem',
    keywords: ['report', 'complaint', 'problem', 'misbehavior', 'off topic', 'shikayat'],
    answer: 'You can report any misconduct or inappropriate request directly using the Report button on mentor profiles, session threads, or session cards. Administrators review all reports.',
  },
  {
    id: 'forgot-password',
    keywords: ['forgot password', 'reset', 'password bhool gaya'],
    answer: 'In this prototype, password reset is handled via the admin demo switcher in the profile menu, or you can re-login with your demo credentials.',
  },
  {
    id: 'admin-access',
    keywords: ['admin', 'moderation', 'analytics', 'audit', 'deans list'],
    answer: 'Administrators can approve mentor applications, review flagged messages, inspect reported sessions, and export volunteer engagement logs.',
    actions: [{ label: 'Go to Dashboard', path: '/dashboard' }],
  },
];

export function findBotResponse(input) {
  if (!input || !input.trim()) {
    return null;
  }

  const query = input.toLowerCase().trim();

  // Match keyword intents
  for (const intent of HELP_INTENTS) {
    for (const kw of intent.keywords) {
      if (query.includes(kw)) {
        return intent;
      }
    }
  }

  // Fallback when nothing matches
  return {
    id: 'fallback',
    answer:
      "I couldn't find a direct answer to that question. You can pick from popular topics below, or report specific academic inquiries directly to the campus administrator.",
    actions: [
      { label: 'How it works', path: '/#how-it-works' },
      { label: 'Browse Mentors', path: '/mentors' },
      { label: 'Become a Mentor', path: '/auth?tab=mentor' },
    ],
  };
}
