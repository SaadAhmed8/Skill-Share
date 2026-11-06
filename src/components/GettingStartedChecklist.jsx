// src/components/GettingStartedChecklist.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';

export function GettingStartedChecklist({ page = 'mentors' }) {
  const { currentUser, sessionRequests } = useApp();
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('skill_share_getting_started_dismissed') === 'true';
  });

  if (dismissed) return null;

  // Real data ticks
  const hasAccount = !!currentUser;
  const userSessions = (sessionRequests || []).filter(
    (s) => s.studentId === currentUser?.id || s.mentorId === currentUser?.id
  );
  const hasSentRequest = userSessions.length > 0;
  const hasJoinedSession = userSessions.some(
    (s) => s.status === 'completed' || s.status === 'accepted'
  );
  const hasLeftFeedback = userSessions.some((s) => s.feedbackGiven);

  const checklistItems = [
    { num: 1, label: 'Complete your account', done: hasAccount, link: '/auth' },
    { num: 2, label: 'Browse mentors', done: true, link: '/mentors' },
    { num: 3, label: 'Send a request', done: hasSentRequest, link: '/mentors' },
    { num: 4, label: 'Join your session', done: hasJoinedSession, link: '/sessions' },
    { num: 5, label: 'Leave feedback', done: hasLeftFeedback, link: '/sessions' },
  ];

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('skill_share_getting_started_dismissed', 'true');
  };

  return (
    <div className="w-full mb-6 p-5 rounded-[28px] border border-[var(--line)] bg-[var(--snow)] text-[var(--ink)]">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--line)]">
        <div>
          <h3 className="font-bold text-sm text-[var(--ink)]">
            Getting Started with Skill Share
          </h3>
          <p className="text-[11px] text-[var(--gray-600)]">
            A quick 5-step roadmap for junior students at NED University
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs text-[var(--gray-600)] hover:text-[var(--ink)] p-1 flex items-center gap-1 cursor-pointer"
          title="Dismiss checklist"
        >
          <X className="size-3.5" weight="bold" />
          <span>Dismiss</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        {checklistItems.map((item) => (
          <Link
            key={item.num}
            to={item.link}
            className={`p-3 rounded-[14px] border flex flex-col justify-between transition-colors ${
              item.done
                ? 'bg-white border-[var(--green-600)]/40 text-[var(--ink)]'
                : 'bg-white/60 border-[var(--line)] text-[var(--gray-600)] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[10px] text-[var(--gray-400)]">0{item.num}</span>
              {item.done ? (
                <span className="size-5 rounded-full bg-[var(--green-600)] text-white flex items-center justify-center text-[10px]">
                  <Check className="size-3" weight="bold" />
                </span>
              ) : (
                <span className="size-4 rounded-full border border-[var(--line)] bg-white" />
              )}
            </div>
            <span className={`text-[11px] leading-snug ${item.done ? 'font-bold text-[var(--ink)]' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
