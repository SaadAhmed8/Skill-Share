// src/components/FeedbackDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Star, CheckCircle, Warning } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function FeedbackDialog({
  session,
  open,
  onOpenChange,
}) {
  const { currentUser, submitStudentFeedback, submitMentorFeedback } = useApp();

  const isMentor = currentUser?.id === session?.mentorId;

  // Student Review Form State
  const [teachingRating, setTeachingRating] = useState(5);
  const [clarityRating, setClarityRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [overallRating, setOverallRating] = useState(5);
  const [comment, setComment] = useState('');
  const [platformRating, setPlatformRating] = useState(5);
  const [platformSuggestion, setPlatformSuggestion] = useState('');

  // Mentor Review Form State
  const [studentExperienceRating, setStudentExperienceRating] = useState(5);
  const [studentNote, setStudentNote] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!session) return null;

  const handleOpenChange = (val) => {
    if (!val) {
      setTimeout(() => {
        setIsSuccess(false);
        setError('');
        setComment('');
      }, 300);
    }
    onOpenChange(val);
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (session.status !== 'completed') {
      const err = 'Feedback can only be submitted for completed sessions.';
      setError(err);
      toast.error(err);
      return;
    }

    if (session.feedbackGiven) {
      const err = 'Feedback has already been given for this session.';
      setError(err);
      toast.error(err);
      return;
    }

    if (currentUser?.id && session.studentId && currentUser.id !== session.studentId) {
      const err = 'Only the student who requested this session can leave student feedback.';
      setError(err);
      toast.error(err);
      return;
    }

    if (!teachingRating || !clarityRating || !punctualityRating || !overallRating) {
      const err = 'Please provide a star rating for all four mentor evaluation criteria.';
      setError(err);
      toast.error(err);
      return;
    }

    if (!comment.trim() || comment.trim().length < 10) {
      const err = 'Please provide at least 10 characters in your written review.';
      setError(err);
      toast.error(err);
      return;
    }

    try {
      submitStudentFeedback({
        sessionId: session.id,
        mentorId: session.mentorId,
        teachingRating,
        clarityRating,
        punctualityRating,
        overallRating,
        comment: comment.trim(),
        platformRating,
        platformSuggestion: platformSuggestion.trim(),
      });

      setIsSuccess(true);
      toast.success('Feedback published');
    } catch (err) {
      const msg = err?.message || 'Failed to publish feedback. Please try again.';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleMentorSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (session.status !== 'completed') {
      const err = 'Feedback can only be submitted for completed sessions.';
      setError(err);
      toast.error(err);
      return;
    }

    if (session.feedbackGiven) {
      const err = 'Feedback has already been given for this session.';
      setError(err);
      toast.error(err);
      return;
    }

    try {
      submitMentorFeedback({
        sessionId: session.id,
        studentExperienceRating,
        studentNote: studentNote.trim(),
        platformRating,
        platformSuggestion: platformSuggestion.trim(),
      });

      setIsSuccess(true);
      toast.success('Feedback published');
    } catch (err) {
      const msg = err?.message || 'Failed to submit feedback. Please try again.';
      setError(msg);
      toast.error(msg);
    }
  };

  const StarInput = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[var(--ink)] font-bold">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 text-[var(--gray-400)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            aria-label={`${label}: ${star} stars`}
          >
            <Star
              weight={star <= value ? 'fill' : 'bold'}
              className={`size-4.5 ${star <= value ? 'text-[var(--ink)]' : 'text-[var(--line)]'
                }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg bg-white border border-[var(--line)] text-[var(--ink)] max-h-[90vh] overflow-y-auto rounded-[28px] p-6 sm:p-8 shadow-none">
        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="size-12 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center mx-auto">
              <CheckCircle weight="fill" className="size-7" />
            </div>
            <h2 className="font-bold text-2xl text-[var(--ink)]">
              Feedback Submitted
            </h2>
            <p className="text-xs text-[var(--gray-600)] max-w-sm mx-auto leading-relaxed">
              Your evaluation directly shapes mentor recognition, volunteer hour credits, and continuous campus peer-learning quality.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--ink)] text-white hover:bg-[var(--green-900)] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : isMentor ? (
          <form onSubmit={handleMentorSubmit} className="space-y-5 text-left">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl font-bold text-[var(--ink)]">
                Mentor Post-Session Feedback
              </DialogTitle>
              <DialogDescription className="text-[var(--gray-600)] text-xs">
                Session with {session.studentName} on {session.subject}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 p-4 rounded-[20px] bg-[var(--snow)] border border-[var(--line)]">
              <p className="text-xs font-bold text-[var(--green-600)] uppercase tracking-wider">
                1. Student Interaction and Readiness
              </p>
              <StarInput
                label="Student preparation and engagement"
                value={studentExperienceRating}
                onChange={setStudentExperienceRating}
              />
              <textarea
                rows={2}
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                placeholder="Optional notes on student progress or topics covered..."
                className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] p-2.5 text-xs text-[var(--ink)] outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-3 p-4 rounded-[20px] bg-[var(--snow)] border border-[var(--line)]">
              <p className="text-xs font-bold text-[var(--green-600)] uppercase tracking-wider">
                2. Platform Experience
              </p>
              <StarInput
                label="Ease of coordinating and hosting session"
                value={platformRating}
                onChange={setPlatformRating}
              />
              <textarea
                rows={2}
                value={platformSuggestion}
                onChange={(e) => setPlatformSuggestion(e.target.value)}
                placeholder="Suggestions for improving Skill Share for seniors..."
                className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] p-2.5 text-xs text-[var(--ink)] outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
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
                Submit Feedback
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleStudentSubmit} className="space-y-5 text-left">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl font-bold text-[var(--ink)]">
                Rate Your Session with {session.mentorName}
              </DialogTitle>
              <DialogDescription className="text-[var(--gray-600)] text-xs">
                Topic: {session.subject} • Completed 1-on-1 Online Consultation
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="p-3 rounded-[14px] bg-red-50 border border-red-200 text-xs text-[var(--error)] flex items-center gap-2">
                <Warning className="size-4 shrink-0" weight="bold" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3.5 p-4 rounded-[20px] bg-[var(--snow)] border border-[var(--line)]">
              <p className="text-xs font-bold text-[var(--green-600)] uppercase tracking-wider">
                1. Mentor Evaluation
              </p>
              <div className="space-y-2">
                <StarInput
                  label="Teaching Quality"
                  value={teachingRating}
                  onChange={setTeachingRating}
                />
                <StarInput
                  label="Conceptual Clarity"
                  value={clarityRating}
                  onChange={setClarityRating}
                />
                <StarInput
                  label="Punctuality"
                  value={punctualityRating}
                  onChange={setPunctualityRating}
                />
                <StarInput
                  label="Overall Experience"
                  value={overallRating}
                  onChange={setOverallRating}
                />
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-[var(--gray-600)]">
                  <span className="font-bold text-[var(--ink)]">Written Review</span>
                  <span>{comment.length} / 300</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How did the senior explain the concept? Did it help your academic confidence? (min 10 characters)"
                  className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] p-3 text-xs text-[var(--ink)] outline-none resize-none leading-relaxed placeholder:text-[var(--gray-400)]"
                />
                <p className="text-[10px] text-[var(--gray-600)]">
                  Published publicly on the mentor profile under your first name ({session.studentName?.split(' ')[0]}).
                </p>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-[20px] bg-[var(--snow)] border border-[var(--line)]">
              <p className="text-xs font-bold text-[var(--green-600)] uppercase tracking-wider">
                2. Platform Evaluation
              </p>
              <StarInput
                label="Ease of Use and Scheduling"
                value={platformRating}
                onChange={setPlatformRating}
              />
              <textarea
                rows={2}
                value={platformSuggestion}
                onChange={(e) => setPlatformSuggestion(e.target.value)}
                placeholder="Any suggestions or features you would like to see on Skill Share? (optional)"
                className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] p-2.5 text-xs text-[var(--ink)] outline-none resize-none leading-relaxed placeholder:text-[var(--gray-400)]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
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
                Publish Feedback
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
