// src/components/ReportMentorDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Flag, ShieldCheck, CheckCircle } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function ReportMentorDialog({
  mentor,
  open,
  onOpenChange,
}) {
  const { reportMentor } = useApp();
  const [reason, setReason] = useState('Requested external communication');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOpenChange = (val) => {
    if (!val) {
      setTimeout(() => {
        setIsSubmitted(false);
        setDetails('');
      }, 300);
    }
    onOpenChange(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details.trim()) {
      toast.error('Please describe the situation briefly for admin review.');
      return;
    }

    reportMentor({
      mentorId: mentor.id,
      mentorName: mentor.name,
      reason,
      details: details.trim(),
    });

    setIsSubmitted(true);
    toast.success('Report submitted to university administration.');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md bg-white border border-[var(--line)] text-[var(--ink)] rounded-[28px] p-6 sm:p-8 shadow-none">
        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="size-12 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center mx-auto">
              <CheckCircle weight="fill" className="size-7" />
            </div>
            <h2 className="font-bold text-xl text-[var(--ink)]">
              Report Submitted
            </h2>
            <p className="text-xs text-[var(--gray-600)] max-w-sm mx-auto leading-relaxed">
              Thank you for keeping the platform safe. University administrators will review the reported incident and conversation record.
            </p>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--ink)] text-white hover:bg-[var(--green-900)] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader className="text-left mb-2">
              <DialogTitle className="text-xl font-bold text-[var(--ink)]">
                Report {mentor?.name}
              </DialogTitle>
              <DialogDescription className="text-[var(--gray-600)] text-xs">
                Platform safety is strictly enforced. Administrators only review reported or flagged conversations.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-[var(--ink)]">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none cursor-pointer"
              >
                <option value="Requested external communication">Coercing to leave platform (e.g. WhatsApp)</option>
                <option value="No-show or unpunctual">Repeated no-show or severe unpunctuality</option>
                <option value="Inappropriate behavior">Inappropriate language or disrespectful behavior</option>
                <option value="Non-academic requests">Non-academic requests or off-topic conduct</option>
                <option value="Other concern">Other violation of Code of Conduct</option>
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-[var(--ink)]">Details and Explanation</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe what happened..."
                className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] p-3 text-xs text-[var(--ink)] outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[var(--gray-600)] bg-[var(--snow)] p-3 rounded-[14px] border border-[var(--line)] text-left">
              <ShieldCheck className="size-4 text-[var(--green-600)] shrink-0" weight="bold" />
              <span>Admins review transcripts only for reported conversations per Section 6 privacy rules.</span>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--gray-600)] border border-[var(--line)] hover:bg-[var(--snow)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-[var(--error)] text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
