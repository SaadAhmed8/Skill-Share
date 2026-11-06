// src/components/CertificateModal.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Printer } from '@phosphor-icons/react';

export function CertificateModal({
  mentor,
  open,
  onOpenChange,
}) {
  if (!mentor) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-white border border-[var(--line)] text-[var(--ink)] rounded-[28px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto shadow-none">
        <DialogHeader className="no-print mb-3">
          <DialogTitle className="text-xl font-bold text-[var(--ink)]">
            Certificate of Volunteer Service
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--gray-600)]">
            Official volunteer recognition by NED University of Engineering &amp; Technology
          </DialogDescription>
        </DialogHeader>

        {/* PRINTABLE CERTIFICATE CONTAINER (Landscape A4: 297:210, width min(100%, 1040px)) */}
        <div className="w-full flex justify-center py-2 overflow-x-auto">
          <div
            className="print-certificate bg-white text-[var(--ink)] p-8 sm:p-12 relative flex flex-col justify-between text-center"
            style={{
              aspectRatio: '297 / 210',
              width: 'min(100%, 1040px)',
              boxSizing: 'border-box',
            }}
          >
            {/* Double border: 2px black outer, 1px green-600 inner, title in bold Instrument Sans, no icons */}
            <div className="border-2 border-[var(--ink)] p-1.5 h-full flex flex-col">
              <div className="border border-[var(--green-600)] p-6 sm:p-8 h-full flex flex-col justify-between">
                {/* Header Section */}
                <div className="space-y-1">
                  <p className="text-[11px] sm:text-xs uppercase tracking-widest text-[var(--gray-600)] font-bold">
                    NED University of Engineering &amp; Technology
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--green-600)]">
                    Civics and Community Engagement
                  </p>
                  <h1 className="font-bold text-2xl sm:text-4xl text-[var(--ink)] tracking-tight uppercase pt-2">
                    Certificate of Volunteer Service
                  </h1>
                  <p className="text-xs sm:text-sm uppercase tracking-wider text-[var(--gray-600)] font-semibold">
                    Skill Share Peer Mentoring Program
                  </p>
                </div>

                {/* Recipient Section */}
                <div className="space-y-2 py-4">
                  <p className="text-xs sm:text-sm text-[var(--gray-600)]">
                    This official certificate is presented in honor of
                  </p>
                  <h2 className="font-bold text-2xl sm:text-4xl text-[var(--ink)] tracking-tight border-b-2 border-[var(--ink)] inline-block px-8 pb-1 max-w-full break-words">
                    {mentor.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--gray-600)] font-medium pt-1">
                    Department of {mentor.department}
                  </p>
                </div>

                {/* Recognition Statement */}
                <div className="max-w-xl mx-auto space-y-1.5 text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
                  <p>
                    For contributing <strong className="font-bold">{mentor.hoursTaught || 0} hours</strong> of dedicated peer tutoring and academic service to junior students.
                  </p>
                  {mentor.subjects && mentor.subjects.length > 0 && (
                    <p className="text-xs text-[var(--gray-600)]">
                      Subjects taught: {mentor.subjects.join(', ')}
                    </p>
                  )}
                </div>

                {/* Signature Row */}
                <div className="grid grid-cols-2 gap-8 pt-6 text-center text-xs border-t border-[var(--line)] mt-4">
                  <div>
                    <p className="font-bold text-sm text-[var(--ink)]">Admin, Skill Share</p>
                    <div className="h-[1px] w-36 bg-[var(--ink)] mx-auto my-1" />
                    <p className="text-[10px] text-[var(--gray-600)]">Academic Affairs &amp; Community Engagement</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[var(--ink)]">Issued Date</p>
                    <div className="h-[1px] w-36 bg-[var(--ink)] mx-auto my-1" />
                    <p className="text-[10px] text-[var(--gray-600)]">{currentDate}</p>
                  </div>
                </div>

                {/* Verification Footer */}
                <p className="text-[9px] text-[var(--gray-400)] uppercase tracking-wider pt-3">
                  Verification ID: NED-SS-{mentor.id.toUpperCase()} • Verified via Skill Share Digital Credential System
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="no-print flex justify-end gap-3 pt-3 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer weight="bold" className="size-4" />
            <span>Print or Save as PDF</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
