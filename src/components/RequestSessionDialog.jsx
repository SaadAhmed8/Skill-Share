// src/components/RequestSessionDialog.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import {
  CheckCircle,
  Clock,
  Calendar,
  Users,
  ShieldCheck,
  Warning,
  SignIn,
  ArrowRight,
} from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import { getSubjectName } from '../lib/utils';

export function RequestSessionDialog({
  mentor,
  initialSlot = '',
  open,
  onOpenChange,
}) {
  const { currentUser, createSessionRequest } = useApp();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(getSubjectName(mentor?.subjects?.[0]) || 'Programming');
  const [preferredSlot, setPreferredSlot] = useState(initialSlot || mentor?.availability?.[0] || 'Flexible');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [description, setDescription] = useState('');
  const [isGroupSession, setIsGroupSession] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (mentor) {
      setSubject(getSubjectName(mentor.subjects?.[0]) || 'Programming');
      setPreferredSlot(initialSlot || mentor.availability?.[0] || 'Flexible');
    }
  }, [mentor, initialSlot]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Please log in with your NED student account first.');
      return;
    }

    if (!description.trim()) {
      setError('Please describe what topic or concept you need help with.');
      return;
    }

    if (description.trim().length > 300) {
      setError('Description must be 300 characters or less.');
      return;
    }

    createSessionRequest({
      mentorId: mentor.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      mentorName: mentor.name,
      mentorEmail: mentor.email,
      subject,
      preferredSlot,
      durationMinutes,
      description: description.trim(),
      isGroupSession,
    });

    setIsSuccess(true);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setIsSuccess(false);
      setError('');
      setDescription('');
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl bg-white border border-[var(--line)] text-[var(--ink)] max-h-[90vh] overflow-y-auto rounded-[28px] p-6 sm:p-8 shadow-none">
        {!currentUser ? (
          <div className="text-center py-6 space-y-4">
            <div className="size-12 rounded-full bg-[var(--snow)] text-[var(--ink)] flex items-center justify-center mx-auto">
              <SignIn weight="bold" className="size-6" />
            </div>
            <h2 className="font-bold text-2xl text-[var(--ink)]">
              Log in to Request a Session
            </h2>
            <p className="text-xs text-[var(--gray-600)] max-w-sm mx-auto leading-relaxed">
              Skill Share is an exclusive university network. Please sign in or create an account with your official NED student email to book peer sessions with {mentor?.name}.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--ink)] text-white hover:bg-[var(--green-900)] transition-colors cursor-pointer"
              >
                Log In or Sign Up
              </button>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--gray-600)] border border-[var(--line)] hover:bg-[var(--snow)] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="text-center py-6 space-y-5">
            <div className="size-12 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center mx-auto">
              <CheckCircle weight="fill" className="size-7" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-[var(--mint)] text-[var(--green-900)] text-xs font-bold uppercase tracking-wider">
                Request Sent
              </span>
              <h2 className="font-bold text-2xl text-[var(--ink)] mt-3 mb-1">
                Session Requested with {mentor?.name}
              </h2>
              <p className="text-xs text-[var(--gray-600)] max-w-md mx-auto leading-relaxed">
                Your request for <strong className="text-[var(--ink)]">{subject}</strong> ({durationMinutes} mins) has been placed. You will receive a notification as soon as {mentor?.name.split(' ')[0]} confirms the final meeting link.
              </p>
            </div>

            <div className="p-4 rounded-[20px] bg-[var(--snow)] border border-[var(--line)] text-xs text-left max-w-md mx-auto space-y-1.5 text-[var(--ink)]">
              <p className="flex justify-between">
                <span className="text-[var(--gray-600)]">Requested Slot:</span>
                <span className="font-bold">{preferredSlot}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[var(--gray-600)]">Duration:</span>
                <span className="font-bold text-[var(--green-600)]">{durationMinutes} Minutes (Online)</span>
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/sessions')}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--ink)] text-white hover:bg-[var(--green-900)] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>View My Sessions</span>
                <ArrowRight className="size-3.5" weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--gray-600)] border border-[var(--line)] hover:bg-[var(--snow)] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader className="mb-2">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {mentor?.name.slice(0, 2)}
                </div>
                <div className="text-left">
                  <DialogTitle className="text-xl font-bold text-[var(--ink)]">
                    Request Session with {mentor?.name}
                  </DialogTitle>
                  <DialogDescription className="text-[var(--gray-600)] text-xs">
                    {mentor?.department} • Year {mentor?.year} • Response time: {mentor?.responseTime}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {error && (
              <div className="p-3 rounded-[14px] bg-red-50 border border-red-200 text-xs text-[var(--error)] flex items-start gap-2">
                <Warning className="size-4 shrink-0 mt-0.5" weight="bold" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-[var(--ink)]">Subject of Focus</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none cursor-pointer"
              >
              {mentor?.subjects?.map((s) => {
                const sName = getSubjectName(s);
                return (
                  <option key={sName} value={sName}>
                    {sName}
                  </option>
                );
              })}
              </select>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-[var(--ink)]">
                Preferred Weekly Time Slot
              </label>
              <select
                value={preferredSlot}
                onChange={(e) => setPreferredSlot(e.target.value)}
                className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none cursor-pointer"
              >
                {mentor?.availability?.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
                <option value="Flexible / Other Time">Flexible / Propose in chat thread</option>
              </select>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--ink)]">Session Duration</label>
                <span className="text-[11px] text-[var(--green-600)] font-bold">Minimum 1 hour</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-2 px-3 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                      durationMinutes === mins
                        ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                        : 'bg-white border-[var(--line)] text-[var(--gray-600)] hover:bg-[var(--snow)]'
                    }`}
                  >
                    {mins} mins {mins === 60 ? '(Default)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--ink)]">
                  Describe what you need help with
                </label>
                <span className="text-[11px] text-[var(--gray-600)]">{description.length} / 300</span>
              </div>
              <textarea
                rows={3}
                maxLength={300}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="I am free in this time slot and I am facing problems with this concept (e.g. recursion tree tracing, integration by parts)..."
                className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] p-3 text-xs text-[var(--ink)] outline-none resize-none leading-relaxed placeholder:text-[var(--gray-400)]"
              />
            </div>

            <div className="p-3.5 rounded-[14px] bg-[var(--snow)] border border-[var(--line)] flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <Users className="size-4 text-[var(--green-600)]" weight="bold" />
                <div>
                  <p className="text-xs font-bold text-[var(--ink)]">Group Session</p>
                  <p className="text-[11px] text-[var(--gray-600)]">Invite 2 to 3 classmates to join this meeting link</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isGroupSession}
                onChange={(e) => setIsGroupSession(e.target.checked)}
                className="size-4 rounded accent-[var(--green-600)] cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[var(--gray-600)] bg-[var(--snow)] p-3 rounded-[14px] border border-[var(--line)] text-left">
              <ShieldCheck className="size-4 text-[var(--green-600)] shrink-0" weight="bold" />
              <span>Contact details stay hidden until {mentor?.name.split(' ')[0]} confirms the session.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--gray-600)] border border-[var(--line)] hover:bg-[var(--snow)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-[var(--ink)] text-white hover:bg-[var(--green-900)] transition-colors cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
