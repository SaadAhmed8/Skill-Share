// src/components/CertificateModal.jsx
import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { DownloadSimple, Printer, SpinnerGap } from '@phosphor-icons/react';
import { Logo } from './Logo';
import { CERTIFICATE_MIN_HOURS } from '../lib/utils';
import { getMentorStats } from '../lib/mentorStats';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

const CERT_BASE_WIDTH = 960;
const CERT_BASE_HEIGHT = 678; // 960 / (297 / 210) = 678.78 (Standard A4 Landscape)

export function CertificateModal({
  mentor,
  open,
  onOpenChange,
}) {
  const { reviews, sessionRequests } = useApp();
  const certRef = useRef(null);
  const containerRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(CERT_BASE_WIDTH);

  useEffect(() => {
    if (!open) return;

    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) setContainerWidth(w);
      }
    };

    measure();
    const timer = setTimeout(measure, 50);

    let ro;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0) {
            setContainerWidth(entry.contentRect.width);
          }
        }
      });
      ro.observe(containerRef.current);
    }

    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
    };
  }, [open]);

  if (!mentor) return null;

  const stats = getMentorStats(mentor, reviews, sessionRequests);
  const hours = stats.hoursTaught;
  const studentsTaught = stats.studentsTaught || Math.max(1, Math.round(hours * 0.7));
  const sessionsCount = stats.completedSessions || Math.max(1, Math.round(hours * 0.9));
  const rating = stats.rating ?? 4.9;

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

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subjectsList = mentor.subjects && mentor.subjects.length > 0
    ? mentor.subjects.join(', ')
    : 'Engineering Fundamentals';

  const certId = `SKL-2026-${mentor.id.toUpperCase()}-${hours}`;

  // Proportional scale factor based on container width
  const scale = Math.min(1, Math.max(0.32, (containerWidth - 8) / CERT_BASE_WIDTH));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    const toastId = toast.loading('Generating high-resolution PDF certificate...');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = certRef.current;

      // Render at 2x scale for ultra-crisp vector/text quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        width: CERT_BASE_WIDTH,
        height: CERT_BASE_HEIGHT,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('certificate-print-node');
          if (el) {
            el.style.transform = 'none';
            el.style.position = 'static';
            el.style.width = `${CERT_BASE_WIDTH}px`;
            el.style.height = `${CERT_BASE_HEIGHT}px`;
          }
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // Create landscape A4 PDF (297mm x 210mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Fit edge-to-edge across the A4 landscape canvas
      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
      const cleanFileName = `Certificate-${mentor.name.replace(/[^a-zA-Z0-9]/g, '_')}-${hours}h.pdf`;
      pdf.save(cleanFileName);

      toast.success('Certificate PDF downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error('Failed to generate PDF certificate:', err);
      toast.error('Could not generate PDF directly. Opening print dialog...', { id: toastId });
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-white border border-[var(--line)] text-[var(--ink)] rounded-[28px] p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-none">
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
            {/* RESPONSIVE SCALED PREVIEW WRAPPER */}
            <div
              ref={containerRef}
              className="w-full flex justify-center py-2 overflow-hidden"
            >
              <div
                style={{
                  width: `${CERT_BASE_WIDTH * scale}px`,
                  height: `${CERT_BASE_HEIGHT * scale}px`,
                  position: 'relative',
                  transition: 'width 0.15s ease, height 0.15s ease',
                }}
              >
                <div
                  ref={certRef}
                  id="certificate-print-node"
                  style={{
                    width: `${CERT_BASE_WIDTH}px`,
                    height: `${CERT_BASE_HEIGHT}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    boxSizing: 'border-box',
                  }}
                  className="print-certificate bg-white text-black p-6 select-none"
                >
                  {/* Double border: 2px black outer, 1.5px forest green inner */}
                  <div className="border-2 border-black p-2 h-full flex flex-col box-border">
                    <div className="border-[1.5px] border-[#1F9D55] p-6 h-full flex flex-col justify-between box-border text-center overflow-hidden">

                      {/* Top Header: Logo and University Title */}
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <Logo
                          showSubtitle={false}
                          size="sm"
                          className="justify-center"
                        />
                        <p className="text-[12px] uppercase tracking-[0.25em] text-black font-bold">
                          NED University of Engineering &amp; Technology
                        </p>
                      </div>

                      {/* Tier and Title */}
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E4F2C]">
                          {tierLabel}
                        </p>
                        <h1 className="font-heading font-black text-[28px] text-black tracking-[0.08em] leading-tight uppercase">
                          Certificate of Appreciation
                        </h1>
                        <p className="text-[11px] text-gray-700 font-semibold tracking-[0.2em] uppercase">
                          Volunteer Mentoring Service
                        </p>
                      </div>

                      {/* Recipient Presentation */}
                      <div className="space-y-1 max-w-xl mx-auto w-full">
                        <p className="text-xs text-gray-800 italic font-serif">
                          This certificate is proudly presented to
                        </p>
                        <div className="max-w-lg mx-auto px-4">
                          <h2 className="font-heading font-bold text-[26px] text-black tracking-normal leading-snug">
                            {mentor.name}
                          </h2>
                          <div className="h-[1.5px] w-64 bg-black mx-auto mt-1" />
                        </div>
                      </div>

                      {/* Body Citation Text */}
                      <div className="max-w-2xl mx-auto px-4">
                        <p className="text-[12px] text-black leading-relaxed">
                          in sincere appreciation of <strong className="font-bold">{hours} hours</strong> of voluntary teaching and mentoring provided to fellow students through Skill Share, a free peer mentoring platform at NED University of Engineering &amp; Technology, in the subjects of <strong className="font-bold">{subjectsList}</strong>. Your dedication and academic guidance have helped <strong className="font-bold">{studentsTaught} students</strong> learn with confidence and strengthened our university community.
                        </p>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-4 gap-4 text-center py-2.5 max-w-2xl mx-auto w-full border-t border-b border-[#1F9D55]/30">
                        <div>
                          <p className="font-bold text-xl text-black">{hours}</p>
                          <p className="text-[10px] uppercase font-semibold text-black tracking-wider">Hours Volunteered</p>
                        </div>
                        <div>
                          <p className="font-bold text-xl text-black">{studentsTaught}</p>
                          <p className="text-[10px] uppercase font-semibold text-black tracking-wider">Students Taught</p>
                        </div>
                        <div>
                          <p className="font-bold text-xl text-black">{sessionsCount}</p>
                          <p className="text-[10px] uppercase font-semibold text-black tracking-wider">Sessions Completed</p>
                        </div>
                        <div>
                          <p className="font-bold text-xl text-black">{rating.toFixed(1)} ★</p>
                          <p className="text-[10px] uppercase font-semibold text-black tracking-wider">Average Rating</p>
                        </div>
                      </div>

                      {/* Footer Row: Date, Official Seal, Signature */}
                      <div className="grid grid-cols-3 gap-4 items-center max-w-2xl mx-auto w-full pt-1 text-xs">
                        {/* Left: Date */}
                        <div className="text-left space-y-1">
                          <p className="text-[9px] uppercase font-bold text-black tracking-wider">Date of issue</p>
                          <p className="font-semibold text-xs text-black">{currentDate}</p>
                          <div className="h-[1px] w-28 bg-black mt-1" />
                        </div>

                        {/* Center: Official Seal */}
                        <div className="flex justify-center items-center">
                          <svg
                            width="76"
                            height="76"
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
                            <svg width="105" height="24" viewBox="0 0 120 30" fill="none" className="shrink-0">
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

                      {/* Bottom Verification Strip */}
                      <div className="text-center pt-1 border-t border-[#1F9D55]/20">
                        <p className="text-[10px] text-black font-semibold">
                          Course: Civics and Community Engagement
                        </p>
                        <p className="text-[9px] text-black/75 tracking-wider font-mono">
                          ID: {certId} • Issued by Skill Share. Validated officially.
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Download PDF, Print, Close */}
            <div className="no-print flex flex-wrap justify-end items-center gap-2.5 pt-3 border-t border-[var(--line)]">
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
                className="px-5 py-2 rounded-full border border-[var(--line)] bg-white hover:bg-[var(--snow)] text-[var(--ink)] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Printer weight="bold" className="size-4" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="px-6 py-2.5 rounded-full bg-[var(--green-900)] text-white hover:bg-black text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
              >
                {downloading ? (
                  <>
                    <SpinnerGap className="size-4 animate-spin" />
                    <span>Preparing PDF...</span>
                  </>
                ) : (
                  <>
                    <DownloadSimple weight="bold" className="size-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
