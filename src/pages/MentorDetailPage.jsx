// src/pages/MentorDetailPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  ShareNetwork,
  Flag,
  CaretRight,
  Clock,
  Star,
  CheckCircle,
  Certificate,
} from '@phosphor-icons/react';
import { SectionWrapper } from '../components/SectionWrapper';
import { RequestSessionDialog } from '../components/RequestSessionDialog';
import { ReportMentorDialog } from '../components/ReportMentorDialog';
import { CertificateModal } from '../components/CertificateModal';
import { useApp } from '../context/AppContext';
import { getSubjectName } from '../lib/utils';
import { getMentorStats } from '../lib/mentorStats';
import { toast } from 'sonner';

export function MentorDetailPage() {
  const { id } = useParams();
  const {
    currentUser,
    getMentorById,
    getMentorReviews,
    getMentorSessions,
    reviews: allReviews,
    sessionRequests,
  } = useApp();

  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedSlotForRequest, setSelectedSlotForRequest] = useState('');
  const [reviewsVisibleCount, setReviewsVisibleCount] = useState(6);
  const [reviewSort, setReviewSort] = useState('newest'); // 'newest' | 'highest' | 'lowest'

  const mentor = getMentorById(id);

  if (!mentor || mentor.status !== 'approved') {
    return (
      <SectionWrapper variant="light" containerClassName="py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="font-bold text-2xl text-[var(--ink)]">
            Mentor profile not found
          </h1>
          <p className="text-sm text-[var(--gray-600)]">
            This profile either does not exist or is currently pending review.
          </p>
          <Link
            to="/mentors"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[var(--ink)] text-white text-xs font-semibold hover:bg-[var(--green-900)] transition-colors"
          >
            <ArrowLeft className="size-3.5" weight="bold" />
            <span>Back to Mentors Directory</span>
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  const reviews = getMentorReviews(mentor.id);
  const completedSessions = getMentorSessions(mentor.id);
  const mentorStats = getMentorStats(mentor, allReviews, sessionRequests);

  const totalReviews = mentorStats.reviewCount;
  const ratingAverage = mentorStats.rating;
  const volunteerHours = mentorStats.hoursTaught;
  const isNew = mentor.isNew || totalReviews === 0 || ratingAverage === null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Mentor profile link copied to clipboard.');
  };

  const handleSlotClick = (slot) => {
    setSelectedSlotForRequest(slot);
    setRequestDialogOpen(true);
  };

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(Number(r.rating) || 5);
    if (ratingCounts[star] !== undefined) ratingCounts[star]++;
  });

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === 'highest') {
      return (Number(b.rating) || 0) - (Number(a.rating) || 0);
    }
    if (reviewSort === 'lowest') {
      return (Number(a.rating) || 0) - (Number(b.rating) || 0);
    }
    // Newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const displayedReviews = sortedReviews.slice(0, reviewsVisibleCount);

  const initials = mentor.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <div className="flex flex-col w-full bg-[var(--white)]">
      {/* Breadcrumbs */}
      <div className="w-full bg-white border-b border-[var(--line)] px-4 sm:px-6 lg:px-8 py-3">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-xs text-[var(--gray-600)]">
          <nav className="flex items-center gap-2 truncate">
            <Link to="/" className="hover:text-[var(--ink)] transition-colors">
              Home
            </Link>
            <CaretRight className="size-3 text-[var(--gray-400)]" weight="bold" />
            <Link to="/mentors" className="hover:text-[var(--ink)] transition-colors">
              Mentors
            </Link>
            <CaretRight className="size-3 text-[var(--gray-400)]" weight="bold" />
            <span className="text-[var(--ink)] font-semibold truncate">{mentor.name}</span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Certificate button: shown on the mentor's own profile (mentor only) */}
            {currentUser?.id === mentor.userId && currentUser?.role === 'mentor' && (
              <button
                type="button"
                onClick={() => setCertModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full border border-[var(--green-600)] bg-[var(--green-900)] text-white hover:bg-black text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Certificate className="size-3.5" weight="bold" />
                <span>Certificate</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-full border border-[var(--line)] bg-white hover:bg-[var(--snow)] text-xs text-[var(--ink)] font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ShareNetwork className="size-3.5" weight="bold" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => setReportDialogOpen(true)}
              className="px-3.5 py-1.5 rounded-full border border-[var(--line)] bg-white hover:bg-[var(--snow)] hover:text-[var(--error)] text-xs text-[var(--gray-600)] flex items-center gap-1.5 cursor-pointer"
            >
              <Flag className="size-3.5" weight="bold" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. PROFILE HEADER (Dark Band) */}
      <SectionWrapper variant="dark" containerClassName="py-14 sm:py-18">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="size-20 sm:size-24 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shrink-0">
              {initials}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                  Verified Senior Mentor
                </span>
                {isNew ? (
                  <span className="px-3 py-1 rounded-full bg-[var(--green-400)] text-[var(--ink)] text-xs font-bold uppercase">
                    New Mentor
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--green-400)] font-bold">
                    <Star className="size-3.5" weight="fill" />
                    <span>{ratingAverage.toFixed(1)} ({totalReviews} reviews)</span>
                  </div>
                )}
              </div>

              <h1 className="font-bold text-3xl sm:text-5xl text-white tracking-[-0.03em]">
                {mentor.name}
              </h1>

              <p className="text-sm text-[var(--gray-400)]">
                Department of {mentor.department} • Year {mentor.year}
              </p>

              <p className="text-xs text-[var(--gray-400)] pt-1">
                Typical response time: {mentor.responseTime}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedSlotForRequest(mentor.availability?.[0] || '');
                setRequestDialogOpen(true);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--green-400)] hover:bg-white text-[var(--ink)] text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="size-4" weight="bold" />
              <span>Request a Session</span>
            </button>
            <span className="text-[11px] text-[var(--gray-400)]">
              100% Free • Online • Minimum 1 hour
            </span>
          </div>
        </div>
      </SectionWrapper>

      {/* 2. STATS STRIP (Light Band, plain numbers with vertical hairlines) */}
      <SectionWrapper variant="light" containerClassName="py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)]">
          <div className="pt-2 sm:pt-0">
            <p className="font-bold text-4xl text-[var(--ink)]">{mentorStats.studentsTaught}</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-600)] mt-1">Students Guided</p>
          </div>

          <div className="pt-4 sm:pt-0">
            <p className="font-bold text-4xl text-[var(--ink)]">{volunteerHours}</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-600)] mt-1">Volunteer Hours</p>
          </div>

          <div className="pt-4 sm:pt-0">
            <p className="font-bold text-4xl text-[var(--ink)]">
              {isNew ? 'New' : `${ratingAverage.toFixed(1)} ★`}
            </p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-600)] mt-1">Average Rating</p>
          </div>

          <div className="pt-4 sm:pt-0">
            <p className="font-bold text-4xl text-[var(--ink)]">{mentor.responseTime}</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-600)] mt-1">Response Speed</p>
          </div>
        </div>
      </SectionWrapper>

      {/* 3. ABOUT & EXPERTISE (Snow Band) */}
      <SectionWrapper variant="light-alt" containerClassName="py-12">
        <div className="max-w-3xl space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-600)] block mb-1">
              About the Mentor
            </span>
            <h2 className="font-bold text-2xl text-[var(--ink)]">
              Mentorship approach and background
            </h2>
            <p className="text-sm sm:text-base text-[var(--gray-600)] leading-relaxed mt-3">
              {mentor.bio}
            </p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-600)] block mb-2">
              Subjects of Expertise
            </span>
            <div className="flex flex-wrap gap-2">
              {(mentor.subjects || []).map((subj) => {
                const sName = getSubjectName(subj);
                return (
                  <span
                    key={sName || String(subj)}
                    className="px-4 py-2 rounded-full border border-[var(--line)] bg-white text-xs font-semibold text-[var(--ink)]"
                  >
                    {sName}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 4. WEEKLY AVAILABILITY (White Band) */}
      <SectionWrapper variant="light" containerClassName="py-12">
        <div className="max-w-3xl mb-6">
          <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-600)] block mb-1">
            Weekly Schedule
          </span>
          <h2 className="font-bold text-2xl text-[var(--ink)]">
            Available time slots
          </h2>
          <p className="text-xs text-[var(--gray-600)] mt-1">
            Click any free slot to open the session request dialog.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mentor.availability && mentor.availability.length > 0 ? (
            mentor.availability.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => handleSlotClick(slot)}
                className="p-4 rounded-[20px] border border-[var(--line)] bg-white hover:border-[var(--ink)] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block font-bold text-sm text-[var(--ink)]">{slot}</span>
                  <span className="text-xs text-[var(--green-600)] font-medium">Available (1 hr)</span>
                </div>
                <div className="size-8 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center">
                  <Clock className="size-4" weight="bold" />
                </div>
              </button>
            ))
          ) : (
            <div className="sm:col-span-3 p-8 text-center rounded-[28px] border border-[var(--line)] bg-[var(--snow)] text-xs text-[var(--gray-600)]">
              No weekly slots listed. You can still submit a session request with a custom time.
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* 5. RATINGS & REVIEWS (Snow Band) */}
      <SectionWrapper variant="light-alt" containerClassName="py-12">
        <div className="max-w-3xl mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-600)] block mb-1">
              Student Feedback
            </span>
            <h2 className="font-bold text-2xl text-[var(--ink)]">
              Ratings &amp; Reviews ({totalReviews})
            </h2>
          </div>

          {totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="review-sort" className="text-xs font-semibold text-[var(--gray-600)]">
                Sort:
              </label>
              <select
                id="review-sort"
                value={reviewSort}
                onChange={(e) => {
                  setReviewSort(e.target.value);
                  setReviewsVisibleCount(6);
                }}
                className="bg-white border border-[var(--line)] rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--ink)] outline-none"
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest</option>
                <option value="lowest">Lowest</option>
              </select>
            </div>
          )}
        </div>

        {totalReviews > 0 ? (
          <div className="space-y-6">
            {/* Rating breakdown summary & 5-1 distribution bars */}
            <div className="bg-white border border-[var(--line)] rounded-[28px] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-[var(--line)] pb-4 md:pb-0 md:pr-6">
                <p className="font-bold text-5xl text-[var(--ink)]">
                  {ratingAverage.toFixed(1)}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-1 text-[var(--green-600)] my-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="size-4"
                      weight={star <= Math.round(ratingAverage) ? 'fill' : 'regular'}
                    />
                  ))}
                </div>
                <p className="text-xs text-[var(--gray-600)]">
                  Based on {totalReviews} verified review{totalReviews === 1 ? '' : 's'}
                </p>
              </div>

              <div className="md:col-span-8 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] || 0;
                  const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-12 text-[var(--ink)] font-semibold flex items-center gap-1">
                        <span>{star}</span>
                        <Star className="size-3 text-[var(--ink)]" weight="fill" />
                      </span>
                      <div className="flex-1 h-2.5 bg-[var(--snow)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--ink)] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-[var(--gray-600)] font-mono text-[11px]">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews list */}
            <div className="divide-y divide-[var(--line)] bg-white border border-[var(--line)] rounded-[28px] p-6 sm:p-8">
              {displayedReviews.map((rev) => (
                <div key={rev.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--ink)]">{rev.studentName}</span>
                      <span className="text-[var(--gray-600)]">• Verified Junior</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--ink)]">★ {Number(rev.rating).toFixed(1)}</span>
                      <span className="text-[var(--gray-600)]">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--gray-600)] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Show more button */}
            {displayedReviews.length < totalReviews && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setReviewsVisibleCount((prev) => prev + 6)}
                  className="px-6 py-2.5 rounded-full bg-white border border-[var(--line)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--snow)] transition-colors cursor-pointer"
                >
                  Show more reviews ({totalReviews - displayedReviews.length} remaining)
                </button>
              </div>
            )}

            {/* Prototype disclaimer note */}
            <p className="text-center text-xs text-[var(--gray-600)] pt-2">
              Demo data for the course prototype.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-8 text-center rounded-[28px] border border-[var(--line)] bg-white text-xs text-[var(--gray-600)]">
              No reviews yet.
            </div>
            <p className="text-center text-xs text-[var(--gray-600)]">
              Demo data for the course prototype.
            </p>
          </div>
        )}
      </SectionWrapper>

      {/* 6. COMPLETED SESSION HISTORY (Dark Band, plain table) */}
      <SectionWrapper variant="dark" containerClassName="py-12">
        <div className="max-w-3xl mb-6">
          <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-400)] block mb-1">
            Verification Log
          </span>
          <h2 className="font-bold text-2xl text-white">
            Completed session history
          </h2>
          <p className="text-xs text-[var(--gray-400)]">
            Public record of completed hours without sensitive private student data.
          </p>
        </div>

        {completedSessions.length > 0 ? (
          <div className="overflow-x-auto border border-white/10 rounded-[28px] bg-[#141414]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="border-b border-white/10 text-[var(--gray-400)] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Subject</th>
                  <th className="py-3 px-5">Date Completed</th>
                  <th className="py-3 px-5">Duration</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/90">
                {completedSessions.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 px-5 font-semibold text-white">{s.subject}</td>
                    <td className="py-3 px-5 text-[var(--gray-400)]">
                      {new Date(s.confirmedTime || s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-5 text-[var(--green-400)]">{s.durationMinutes} Minutes</td>
                    <td className="py-3 px-5 text-right font-medium text-[var(--green-400)]">
                      Completed
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center rounded-[28px] border border-white/10 bg-[#141414] text-xs text-[var(--gray-400)]">
            No public session records logged yet.
          </div>
        )}
      </SectionWrapper>

      {/* Sticky Bottom Bar on Mobile */}
      <div className="fixed bottom-0 inset-x-0 p-3 bg-[var(--ink)] border-t border-white/10 sm:hidden z-40 flex items-center justify-between gap-3">
        <div>
          <p className="font-bold text-xs text-white">{mentor.name}</p>
          <p className="text-[10px] text-[var(--green-400)]">
            {isNew ? 'New Mentor' : `★ ${ratingAverage.toFixed(1)} (${totalReviews})`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedSlotForRequest(mentor.availability?.[0] || '');
            setRequestDialogOpen(true);
          }}
          className="px-5 py-2.5 rounded-full bg-[var(--green-400)] text-[var(--ink)] text-xs font-bold"
        >
          Request Session
        </button>
      </div>

      <RequestSessionDialog
        mentor={mentor}
        initialSlot={selectedSlotForRequest}
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
      />

      <ReportMentorDialog
        mentor={mentor}
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />

      <CertificateModal
        mentor={mentor}
        open={certModalOpen}
        onOpenChange={setCertModalOpen}
      />
    </div>
  );
}
