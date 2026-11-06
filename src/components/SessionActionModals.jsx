// src/components/SessionActionModals.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { toast } from 'sonner';

/**
 * 1. Accept Session Modal (Mentor Role)
 */
export function AcceptSessionModal({
  session,
  open,
  onOpenChange,
  onConfirm,
}) {
  const [dateStr, setDateStr] = useState(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    tmrw.setHours(18, 0, 0, 0);
    return tmrw.toISOString().slice(0, 16);
  });
  const [duration, setDuration] = useState(60);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!session) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dateStr) {
      setError('Please choose a valid date and time.');
      return;
    }

    const meetingLink = `https://meet.google.com/ned-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
    const finalTime = new Date(dateStr).toISOString();

    onConfirm(session.id, meetingLink, finalTime, duration, note);
    onOpenChange(false);
    toast.success('Session confirmed and Google Meet link generated.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border border-[var(--line)] text-[var(--ink)] rounded-[28px] p-6 sm:p-8 shadow-none">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold text-[var(--ink)]">
              Accept and Set Session Time
            </DialogTitle>
            <DialogDescription className="text-[var(--gray-600)] text-xs">
              Student: {session.studentName} • Requested Slot: {session.preferredSlot}
            </DialogDescription>
          </DialogHeader>

          {error && <p className="text-xs text-[var(--error)] font-semibold">{error}</p>}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ink)]">Confirmed Date and Time</label>
            <input
              type="datetime-local"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-[var(--ink)]">Duration</label>
              <span className="text-[11px] text-[var(--green-600)] font-semibold">Minimum 60 mins</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[60, 90, 120].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDuration(m)}
                  className={`py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    duration === m
                      ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                      : 'bg-white border-[var(--line)] text-[var(--gray-600)] hover:bg-[var(--snow)]'
                  }`}
                >
                  {m} mins
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ink)]">Note to Student (Optional)</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. See you online! Please have your course material ready."
              className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] p-3 text-xs text-[var(--ink)] outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--gray-600)] border border-[var(--line)] hover:bg-[var(--snow)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[var(--ink)] text-white hover:bg-[var(--green-900)] transition-colors cursor-pointer"
            >
              Confirm and Generate Link
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 2. Reschedule Session Modal (Both Roles)
 */
export function RescheduleSessionModal({
  session,
  open,
  onOpenChange,
  onReschedule,
}) {
  const [newTimeStr, setNewTimeStr] = useState(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 2);
    tmrw.setHours(17, 0, 0, 0);
    return tmrw.toISOString().slice(0, 16);
  });
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!session) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 10) {
      setError('Please provide a reason of at least 10 characters.');
      return;
    }

    onReschedule(session.id, {
      newTime: new Date(newTimeStr).toISOString(),
      reason: reason.trim(),
    });
    onOpenChange(false);
    toast.success('Session rescheduled successfully.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border border-[var(--line)] text-[var(--ink)] rounded-[28px] p-6 sm:p-8 shadow-none">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold text-[var(--ink)]">
              Reschedule Session
            </DialogTitle>
            <DialogDescription className="text-[var(--gray-600)] text-xs">
              Topic: {session.subject}
            </DialogDescription>
          </DialogHeader>

          {error && <p className="text-xs text-[var(--error)] font-semibold">{error}</p>}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ink)]">Proposed New Date and Time</label>
            <input
              type="datetime-local"
              value={newTimeStr}
              onChange={(e) => setNewTimeStr(e.target.value)}
              className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-[var(--ink)]">Reason for Rescheduling</label>
              <span className="text-[10px] text-[var(--gray-600)]">Min 10 characters</span>
            </div>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Unforeseen academic clash with lab exam..."
              className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] p-3 text-xs text-[var(--ink)] outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--gray-600)] border border-[var(--line)] hover:bg-[var(--snow)] cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[var(--ink)] text-white hover:bg-[var(--green-900)] transition-colors cursor-pointer"
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 3. Cancel / Decline Modal with Mandatory Reason
 */
export function CancelSessionModal({
  session,
  isDecline = false,
  open,
  onOpenChange,
  onCancel,
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!session) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 10) {
      setError('Please provide a reason of at least 10 characters.');
      return;
    }

    onCancel(session.id, { reason: reason.trim() });
    onOpenChange(false);
    toast.info(isDecline ? 'Session request declined.' : 'Session cancelled.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border border-[var(--line)] text-[var(--ink)] rounded-[28px] p-6 sm:p-8 shadow-none">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold text-[var(--ink)]">
              {isDecline ? 'Decline Request' : 'Cancel Session'}
            </DialogTitle>
            <DialogDescription className="text-[var(--gray-600)] text-xs">
              Subject: {session.subject}
            </DialogDescription>
          </DialogHeader>

          {error && <p className="text-xs text-[var(--error)] font-semibold">{error}</p>}

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-[var(--ink)]">Reason</label>
              <span className="text-[10px] text-[var(--gray-600)]">Min 10 characters required</span>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you need to cancel this session..."
              className="w-full bg-white border border-[var(--line)] focus:border-[var(--error)] rounded-[14px] p-3 text-xs text-[var(--ink)] outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--gray-600)] border border-[var(--line)] hover:bg-[var(--snow)] cursor-pointer"
            >
              Keep Session
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[var(--error)] text-white hover:bg-red-700 transition-colors cursor-pointer"
            >
              {isDecline ? 'Decline' : 'Confirm Cancel'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
