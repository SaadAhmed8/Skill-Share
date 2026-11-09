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
import { Logo } from './Logo';
import { CERTIFICATE_MIN_HOURS } from '../lib/utils';
import { useApp } from '../context/AppContext';

export function CertificateModal({
  mentor,
  open,
  onOpenChange,
}) {
  const { getMentorStats } = useApp();
  if (!mentor) return null;

  const stats = getMentorStats ? getMentorStats(mentor.id) : null;
  const hours = stats?.hoursTaught !== undefined ? stats.hoursTaught : (mentor.hoursTaught || 0);
  const studentsTaught = stats?.studentsTaught || Math.max(1, Math.round(hours * 0.7));
  const sessionsCount = stats?.completedSessionsCount || Math.max(1, Math.round(hours * 0.9));
  const rating = stats?.rating && stats.rating > 0 ? stats.rating : (mentor.rating || 4.9);

  const isEligible = hours >= CERTIFICATE_MIN_HOURS;
  const hoursRemaining = Math.max(0, CERTIFICATE_MIN_HOURS - hours);
  const progressPct = Math.min(100, Math.round((hours / CERTIFICATE_MIN_HOURS) * 100));

  // Tier determination:
  // 30 hours: Bronze Volunteer
  // 60 hours: Silver Volunteer
  // 100+ hours: Gold Volunteer
  let tierLabel = "Bronze Volunteer";
  let sealCenterText = "30+ HOURS";
  if (hours >= 100) {
    tierLabel = "Gold Volunteer";
    sealCenterText = "100+ HOURS";
  } else if (hours >= 60) {
    tierLabel = "Silver Volunteer";
    sealCenterText = "60+ HOURS";
  }

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subjectsList = mentor.subjects && mentor.subjects.length > 0
    ? mentor.subjects.join(', ')
    : 'Engineering Fundamentals';

  const certId = `SKL-2026-${mentor.id.toUpperCase()}-${hours}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-white border border-[var(--line)] text-[var(--ink)] rounded-[28px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto shadow-none">
        <DialogHeader className="no-print mb-2">
          <DialogTitle className="text-xl font-bold text-[var(--ink)]">
            Volunteer Certificate
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--gray-600)]">
            Official recognition for peer tutoring and academic service at NED University.
          </DialogDescription>
        </DialogHeader>

        {!isEligible ? (
          /* LOCKED STATE */
          <div className="py-12 px-6 sm:px-12 text-center max-w-lg mx-auto space-y-5">
            <div className="size-14 rounded-full bg-[var(--snow)] border border-[var(--line)] text-[var(--ink)] flex items-center justify-center mx-auto text-xl font-bold">
              🔒
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-[var(--ink)]">
                Certificate Locked
              </h2>
              <p className="text-sm font-semibold text-[var(--gray-600)]">
                Reach {CERTIFICATE_MIN_HOURS} volunteer hours to unlock your certificate.
              </p>
              <p className="text-xs text-[var(--gray-600)]">
                You currently have <strong className="text-[var(--ink)] font-bold">{hours} hours</strong> logged ({hoursRemaining} more hours needed).
              </p>
            </div>

            {/* Progress track */}
            <div className="space-y-1.5 pt-2">
              <div className="h-3 w-full bg-[var(--snow)] border border-[var(--line)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--green-600)] transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-[var(--gray-600)]">
                <span>0 hrs</span>
                <span>{progressPct}% completed</span>
                <span>{CERTIFICATE_MIN_HOURS} hrs</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-6 py-2.5 rounded-full border border-[var(--line)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--snow)] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED CERTIFICATE */
          <>
            {/* PRINTABLE CERTIFICATE CONTAINER (Landscape A4: 297:210, width min(100%, 1040px)) */}
            <div className="w-full flex justify-center py-2 overflow-x-auto">
              <div
                className="print-certificate bg-white text-[var(--ink)] p-5 sm:p-8 md:p-10 relative flex flex-col justify-between text-center"
                style={{
                  aspectRatio: '297 / 210',
                  width: 'min(100%, 1040px)',
                  boxSizing: 'border-box',
                }}
              >
                {/* Double border: 2px black outer, 1px green-600 inner, flat, black and green only */}
                <div className="border-2 border-black p-2 h-full flex flex-col">
                  <div className="border border-[#1F9D55] p-5 sm:p-7 md:p-8 h-full flex flex-col justify-between">

                    {/* Top Center: Logo and under it NED University of Engineering & Technology */}
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <Logo
                        showSubtitle={false}
                        size="sm"
                        className="justify-center"
                      />
                      <p className="text-[11px] sm:text-xs uppercase tracking-widest text-black font-bold">
                        NED University of Engineering &amp; Technology
                      </p>
                    </div>

                    {/* Tier and Title */}
                    <div className="space-y-1 pt-1">
                      <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0E4F2C]">
                        {tierLabel}
                      </p>
                      <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-black tracking-tight leading-none uppercase">
                        Certificate of Appreciation
                      </h1>
                      <p className="text-xs sm:text-sm text-black font-semibold tracking-wide">
                        Volunteer Mentoring Service
                      </p>
                    </div>

                    {/* Recipient Presentation */}
                    <div className="space-y-1 py-1 max-w-2xl mx-auto w-full">
                      <p className="text-xs sm:text-sm text-black italic">
                        This certificate is proudly presented to
                      </p>
                      <div className="max-w-xl mx-auto px-4">
                        <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-black tracking-tight leading-tight break-words">
                          {mentor.name}
                        </h2>
                        <div className="h-[1px] w-full max-w-md bg-black mx-auto mt-1" />
                      </div>
                    </div>

                    {/* Body Text */}
                    <div className="max-w-2xl mx-auto px-2">
                      <p className="text-[11px] sm:text-xs md:text-sm text-black leading-relaxed">
                        in sincere appreciation of <strong className="font-bold">{hours} hours</strong> of voluntary teaching and mentoring provided to fellow students through Skill Share, a free peer mentoring platform at NED University of Engineering &amp; Technology, in the subjects of <strong className="font-bold">{subjectsList}</strong>. Your time, patience and knowledge have helped <strong className="font-bold">{studentsTaught} students</strong> learn with confidence and have strengthened our university community.
                      </p>
                    </div>

                    {/* Stats Row (plain big numbers, no boxes) */}
                    <div className="grid grid-cols-4 gap-2 text-center py-2 max-w-2xl mx-auto w-full border-t border-b border-[#1F9D55]/30">
                      <div>
                        <p className="font-bold text-lg sm:text-xl md:text-2xl text-black">{hours}</p>
                        <p className="text-[10px] uppercase font-semibold text-black tracking-wider">Hours Volunteered</p>
                      </div>
                      <div>
                        <p className="font-bold text-lg sm:text-xl md:text-2xl text-black">{studentsTaught}</p>
                        <p className="text-[10px] uppercase font-semibold text-black tracking-wider">Students Taught</p>
                      </div>
                      <div>
                        <p className="font-bold text-lg sm:text-xl md:text-2xl text-black">{sessionsCount}</p>
                        <p className="text-[10px] uppercase font-semibold text-black tracking-wider">Sessions Completed</p>
                      </div>
                      <div>
                        <p className="font-bold text-lg sm:text-xl md:text-2xl text-black">{rating.toFixed(1)} ★</p>
                        <p className="text-[10px] uppercase font-semibold text-black tracking-wider">Average Rating</p>
                      </div>
                    </div>

                    {/* Footer Row: 3 columns (Date left, Seal center, Signature right) */}
                    <div className="grid grid-cols-3 gap-4 items-center pt-2 max-w-3xl mx-auto w-full text-xs">
                      {/* Left: Date */}
                      <div className="text-left space-y-1">
                        <p className="text-[10px] uppercase font-bold text-black tracking-wider">Date of issue</p>
                        <p className="font-semibold text-xs text-black">{currentDate}</p>
                        <div className="h-[1px] w-28 bg-black mt-1" />
                      </div>

                      {/* Center: Flat Round Seal */}
                      <div className="flex justify-center items-center">
                        <svg
                          width="84"
                          height="84"
                          viewBox="0 0 100 100"
                          className="shrink-0 select-none"
                          aria-label="Skill Share Official Seal"
                        >
                          <circle cx="50" cy="50" r="48" fill="#0E4F2C" />
                          <circle cx="50" cy="50" r="44" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 2" />
                          <circle cx="50" cy="50" r="41" fill="none" stroke="#FFFFFF" strokeWidth="0.75" />

                          <path
                            id={`seal-curve-${mentor.id}`}
                            d="M 20 50 A 30 30 0 1 1 80 50"
                            fill="none"
                          />
                          <text fill="#FFFFFF" fontSize="9" fontWeight="bold" letterSpacing="2">
                            <textPath
                              href={`#seal-curve-${mentor.id}`}
                              startOffset="50%"
                              textAnchor="middle"
                            >
                              SKILL SHARE
                            </textPath>
                          </text>

                          <text
                            x="50"
                            y="53"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="9"
                            fontFamily="system-ui, sans-serif"
                            fontWeight="800"
                            letterSpacing="0.5"
                          >
                            {sealCenterText}
                          </text>
                          <text
                            x="50"
                            y="63"
                            textAnchor="middle"
                            fill="#3DDC84"
                            fontSize="6"
                            fontWeight="bold"
                            letterSpacing="1"
                          >
                            NED OFFICIAL
                          </text>
                        </svg>
                      </div>

                      {/* Right: Signature */}
                      <div className="text-right space-y-1">
                        <div className="flex justify-end">
                          {/* Clean flat SVG signature */}
                          <svg width="110" height="26" viewBox="0 0 120 30" fill="none" className="shrink-0">
                            <path
                              d="M5 22 C 20 5, 25 28, 40 12 C 55 -2, 60 25, 75 14 C 85 8, 95 24, 115 10"
                              stroke="#0B0B0B"
                              strokeWidth="2"
                              strokeLinecap="round"
                              fill="none"
                            />
                            <path
                              d="M30 18 Q 60 25 100 16"
                              stroke="#0B0B0B"
                              strokeWidth="1.2"
                              fill="none"
                            />
                          </svg>
                        </div>
                        <div className="h-[1px] w-32 bg-black ml-auto" />
                        <p className="font-bold text-xs text-black">Admin, Skill Share</p>
                      </div>
                    </div>

                    {/* Bottom Center Verification Note */}
                    <div className="text-center pt-1 border-t border-[#1F9D55]/20">
                      <p className="text-[10px] text-black font-semibold">
                        Course: Civics and Community Engagement
                      </p>
                      <p className="text-[9px] text-black/75 tracking-wider font-mono">
                        ID: {certId} • Issued by Skill Share. ID can be checked by the admin.
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Print or save as PDF, Close */}
            <div className="no-print flex justify-end items-center gap-3 pt-3 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-5 py-2 rounded-full border border-[var(--line)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--snow)] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-6 py-2 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer weight="bold" className="size-4" />
                <span>Print or save as PDF</span>
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
