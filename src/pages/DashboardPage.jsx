// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MentorDashboard } from '../components/MentorDashboard';
import { AdminDashboard } from '../components/AdminDashboard';
import { SectionWrapper } from '../components/SectionWrapper';
import { ArrowRight } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function DashboardPage() {
  const { currentUser, mentors } = useApp();
  const navigate = useNavigate();

  const mentorRecord = currentUser
    ? mentors.find(
        (m) => m.userId === currentUser.id || m.email === currentUser.email
      )
    : null;

  const isApprovedMentor =
    currentUser?.role === 'mentor' || mentorRecord?.status === 'approved';
  const isPendingOrRejected =
    mentorRecord && (mentorRecord.status === 'pending' || mentorRecord.status === 'rejected');

  useEffect(() => {
    if (
      currentUser &&
      currentUser.role !== 'admin' &&
      !isApprovedMentor &&
      !isPendingOrRejected
    ) {
      toast.info('Dashboard is for mentors and admins');
      navigate('/mentors', { replace: true });
    }
  }, [currentUser, isApprovedMentor, isPendingOrRejected, navigate]);

  // Case 1: Logged out
  if (!currentUser) {
    return (
      <SectionWrapper variant="light" containerClassName="py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-600)]">
            Restricted Access
          </span>
          <h1 className="font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-[-0.03em]">
            Sign In to Access Dashboard
          </h1>
          <p className="text-sm text-[var(--gray-600)] leading-relaxed">
            The dashboard is tailored for approved senior mentors and NED administrators. Please sign in with your verified credentials.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth"
              className="px-6 py-2.5 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] text-xs font-semibold"
            >
              Log In Now
            </Link>
            <Link
              to="/become-a-mentor"
              className="px-6 py-2.5 rounded-full border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--snow)] text-xs font-semibold"
            >
              Apply as a Mentor
            </Link>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Case 2: Admin
  if (currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  // Case 3: Approved mentor
  if (isApprovedMentor && !isPendingOrRejected) {
    return <MentorDashboard />;
  }

  // Case 4: Pending or rejected applicant
  if (isPendingOrRejected) {
    const appIsPending = mentorRecord.status === 'pending';
    const rejectionReason = mentorRecord?.rejectReason;

    return (
      <SectionWrapper variant="light" containerClassName="py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              appIsPending
                ? 'bg-[var(--mint)] text-[var(--green-900)]'
                : 'bg-red-50 text-[var(--error)] border border-red-200'
            }`}
          >
            Application Status: {mentorRecord.status}
          </span>

          <h1 className="font-bold text-2xl sm:text-3xl text-[var(--ink)] tracking-[-0.03em]">
            {appIsPending
              ? 'Your Application Is Under Review'
              : 'Application Not Approved'}
          </h1>

          <p className="text-sm text-[var(--gray-600)] leading-relaxed">
            {appIsPending
              ? 'Department administrators review each senior mentor application to verify academic standing and subject expertise. This usually takes 24 to 48 business hours.'
              : 'Thank you for your interest in peer mentoring. Your application could not be approved at this time.'}
          </p>

          {!appIsPending && rejectionReason && (
            <div className="border border-[var(--error)]/30 bg-[var(--snow)] rounded-[14px] p-4 text-left text-xs">
              <span className="font-bold text-[var(--error)] uppercase tracking-wider block mb-1">
                Admin Feedback:
              </span>
              <p className="text-[var(--ink)] italic">"{rejectionReason}"</p>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/become-a-mentor"
              className="px-6 py-2.5 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] text-xs font-semibold flex items-center gap-1.5"
            >
              <span>View Application Details</span>
              <ArrowRight className="size-3.5" weight="bold" />
            </Link>
            <Link
              to="/mentors"
              className="px-6 py-2.5 rounded-full border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--snow)] text-xs font-semibold"
            >
              Browse Mentors
            </Link>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return null;
}
