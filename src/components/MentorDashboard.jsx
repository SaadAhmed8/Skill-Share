// src/components/MentorDashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Trash,
  ArrowRight,
  Clock,
  Star,
  Users,
  Certificate,
} from '@phosphor-icons/react';
import { SectionWrapper } from './SectionWrapper';
import { SessionCard } from './SessionCard';
import { RequestThread } from './RequestThread';
import {
  AcceptSessionModal,
  RescheduleSessionModal,
  CancelSessionModal,
} from './SessionActionModals';
import { CertificateModal } from './CertificateModal';
import { useApp } from '../context/AppContext';
import { getSubjectName } from '../lib/utils';
import { toast } from 'sonner';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = ['Morning', 'Afternoon', 'Evening'];

export function MentorDashboard() {
  const {
    currentUser,
    mentors,
    getUserSessions,
    updateAvailability,
    addResource,
    deleteResource,
    acceptRequest,
    declineRequest,
    rescheduleSession,
    cancelSession,
  } = useApp();

  const mentor = mentors.find((m) => m.userId === currentUser?.id || m.email === currentUser?.email);

  const mySessions = getUserSessions(currentUser?.id);
  const pendingRequests = mySessions.filter((s) => s.status === 'requested');
  const upcomingSessions = mySessions.filter((s) => s.status === 'accepted');
  const completedSessions = mySessions.filter((s) => s.status === 'completed');

  const [threadSession, setThreadSession] = useState(null);
  const [threadOpen, setThreadOpen] = useState(false);

  const [acceptSessionObj, setAcceptSessionObj] = useState(null);
  const [acceptOpen, setAcceptOpen] = useState(false);

  const [rescheduleSessionObj, setRescheduleSessionObj] = useState(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const [cancelSessionObj, setCancelSessionObj] = useState(null);
  const [cancelIsDecline, setCancelIsDecline] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const [certModalOpen, setCertModalOpen] = useState(false);

  const [gridState, setGridState] = useState(() => {
    const initial = {};
    (mentor?.availability || []).forEach((slotStr) => {
      const day = DAYS.find((d) => slotStr.startsWith(d));
      if (day) {
        if (slotStr.toLowerCase().includes('morning') || slotStr.includes('10:00 AM') || slotStr.includes('11:00 AM')) {
          initial[`${day}-Morning`] = true;
        } else if (slotStr.toLowerCase().includes('afternoon') || slotStr.includes('2:00') || slotStr.includes('3:00') || slotStr.includes('4:00')) {
          initial[`${day}-Afternoon`] = true;
        } else {
          initial[`${day}-Evening`] = true;
        }
      }
    });
    return initial;
  });

  const toggleSlot = (day, slot) => {
    const key = `${day}-${slot}`;
    setGridState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAvailability = () => {
    const newSlots = Object.entries(gridState)
      .filter(([_, active]) => active)
      .map(([key]) => {
        const [day, time] = key.split('-');
        if (time === 'Morning') return `${day} 10:00 AM - 12:00 PM`;
        if (time === 'Afternoon') return `${day} 2:00 - 4:00 PM`;
        return `${day} 6:00 - 8:00 PM`;
      });

    if (newSlots.length === 0) {
      toast.warning('Please select at least one weekly slot.');
      return;
    }

    updateAvailability(mentor.id, newSlots);
    toast.success('Weekly availability updated live.');
  };

  const [resTitle, setResTitle] = useState('');
  const [resLink, setResLink] = useState('');
  const [resSubject, setResSubject] = useState(getSubjectName(mentor?.subjects?.[0]) || 'Programming');

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!resTitle.trim() || !resLink.trim()) {
      toast.error('Please enter both title and link');
      return;
    }

    addResource(mentor.id, {
      title: resTitle.trim(),
      link: resLink.trim(),
      subject: resSubject,
    });
    setResTitle('');
    setResLink('');
    toast.success('Study resource added.');
  };

  const initials = mentor?.name ? mentor.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'ME';
  const hours = mentor?.hoursTaught || 0;
  const rating = mentor?.rating || 0;
  const ratingCount = mentor?.ratingCount || 0;

  const badges = [
    {
      id: 'first_session',
      title: 'First Step',
      desc: 'Completed first 1-on-1 session',
      unlocked: completedSessions.length >= 1,
      progress: completedSessions.length >= 1 ? 100 : (completedSessions.length / 1) * 100,
    },
    {
      id: '10_hours',
      title: '10 Hours Certified',
      desc: 'Eligible for official certificate',
      unlocked: hours >= 10,
      progress: Math.min(100, (hours / 10) * 100),
    },
    {
      id: '50_hours',
      title: '50 Hours Legend',
      desc: 'Outstanding civics service',
      unlocked: hours >= 50,
      progress: Math.min(100, (hours / 50) * 100),
    },
    {
      id: 'top_rated',
      title: 'Top Rated Mentor',
      desc: '4.8+ rating with 5+ reviews',
      unlocked: rating >= 4.8 && ratingCount >= 5,
      progress: ratingCount >= 5 ? 100 : (ratingCount / 5) * 100,
    },
  ];

  if (!mentor) {
    return (
      <SectionWrapper variant="light" containerClassName="py-16 text-center">
        <p className="text-sm text-[var(--ink)]">Mentor profile not found.</p>
      </SectionWrapper>
    );
  }

  return (
    <div className="flex flex-col w-full bg-[var(--white)]">
      {/* SECTION A: HEADER PANEL (Dark band) */}
      <SectionWrapper variant="dark" containerClassName="py-14 sm:py-18">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center font-bold text-xl shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                  Verified Senior Mentor
                </span>
                <span className="text-xs text-[var(--gray-400)]">Year {mentor.year}</span>
              </div>
              <h1 className="font-bold text-2xl sm:text-4xl text-white tracking-[-0.03em]">
                Welcome back, {mentor.name}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--gray-400)]">
                Department of {mentor.department} • Volunteer Peer Mentor
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to={`/mentors/${mentor.id}`}
              className="px-5 py-2.5 rounded-full border border-white/20 bg-transparent hover:bg-white hover:text-[var(--ink)] text-xs font-semibold text-white transition-colors"
            >
              Public Profile
            </Link>
            <Link
              to="/sessions"
              className="px-6 py-2.5 rounded-full bg-[var(--green-400)] text-[var(--ink)] hover:bg-white text-xs font-bold transition-colors"
            >
              All Sessions
            </Link>
          </div>
        </div>

        {/* 4 Stats in solid tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-6 border-t border-white/10 text-center">
          <div className="p-5 rounded-[28px] bg-white/5 border border-white/10">
            <p className="font-bold text-3xl text-white">
              {pendingRequests.length}
            </p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-400)] mt-1">Pending Requests</p>
          </div>

          <div className="p-5 rounded-[28px] bg-white/5 border border-white/10">
            <p className="font-bold text-3xl text-[var(--green-400)]">
              {upcomingSessions.length}
            </p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-400)] mt-1">Upcoming Sessions</p>
          </div>

          <div className="p-5 rounded-[28px] bg-white/5 border border-white/10">
            <p className="font-bold text-3xl text-white">{hours} hrs</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-400)] mt-1">Volunteer Hours</p>
          </div>

          <div className="p-5 rounded-[28px] bg-white/5 border border-white/10">
            <p className="font-bold text-3xl text-[var(--green-400)]">
              {rating > 0 ? rating.toFixed(1) : 'New'}
            </p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-400)] mt-1">
              Rating ({ratingCount})
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION C: PENDING REQUESTS (Light band) */}
      <SectionWrapper variant="light" containerClassName="py-12">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] mb-6">
          <div>
            <h2 className="font-bold text-xl text-[var(--ink)]">Pending Requests</h2>
            <p className="text-xs text-[var(--gray-600)]">Respond to junior students awaiting confirmation</p>
          </div>
          <Link
            to="/sessions"
            className="text-xs font-semibold text-[var(--green-600)] hover:underline flex items-center gap-1"
          >
            <span>View all in Sessions</span>
            <ArrowRight className="size-3" weight="bold" />
          </Link>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.slice(0, 3).map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isMentor={true}
                onOpenThread={() => {
                  setThreadSession(session);
                  setThreadOpen(true);
                }}
                onAccept={() => {
                  setAcceptSessionObj(session);
                  setAcceptOpen(true);
                }}
                onDecline={() => {
                  setCancelSessionObj(session);
                  setCancelIsDecline(true);
                  setCancelOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-[var(--gray-600)] rounded-[28px] border border-[var(--line)] bg-[var(--snow)]">
            No pending requests at this time.
          </div>
        )}
      </SectionWrapper>

      {/* SECTION D: UPCOMING SESSIONS (Snow band) */}
      <SectionWrapper variant="light-alt" containerClassName="py-12">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] mb-6">
          <div>
            <h2 className="font-bold text-xl text-[var(--ink)]">Upcoming Sessions</h2>
            <p className="text-xs text-[var(--gray-600)]">Scheduled 1-on-1 online consultations</p>
          </div>
          <Link
            to="/sessions"
            className="text-xs font-semibold text-[var(--green-600)] hover:underline flex items-center gap-1"
          >
            <span>View calendar</span>
            <ArrowRight className="size-3" weight="bold" />
          </Link>
        </div>

        {upcomingSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-[28px] border border-[var(--line)] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-sm text-[var(--ink)]">{session.studentName}</h3>
                  <p className="text-xs text-[var(--gray-600)]">
                    Subject: <strong>{session.subject}</strong> ({session.durationMinutes} mins)
                  </p>
                  <p className="text-[11px] text-[var(--gray-600)] mt-0.5">
                    {new Date(session.confirmedTime).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setThreadSession(session);
                      setThreadOpen(true);
                    }}
                    className="px-4 py-2 rounded-full border border-[var(--line)] bg-white hover:bg-[var(--snow)] text-xs font-semibold text-[var(--ink)]"
                  >
                    Open Thread
                  </button>
                  {session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] text-xs font-semibold"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-[var(--gray-600)] rounded-[28px] border border-[var(--line)] bg-white">
            No upcoming confirmed sessions right now.
          </div>
        )}
      </SectionWrapper>

      {/* SECTION E: AVAILABILITY MATRIX (Light band) */}
      <SectionWrapper variant="light" containerClassName="py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-bold text-xl text-[var(--ink)]">
              Weekly Availability Matrix
            </h2>
            <p className="text-xs text-[var(--gray-600)]">
              Toggle slots you can host online sessions. Updates your public profile.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveAvailability}
            className="px-6 py-2.5 rounded-full bg-[var(--ink)] hover:bg-[var(--green-900)] text-white text-xs font-semibold cursor-pointer"
          >
            Save Availability
          </button>
        </div>

        <div className="overflow-x-auto border border-[var(--line)] rounded-[28px] bg-white">
          <table className="w-full text-xs text-center border-collapse">
            <thead className="bg-[var(--snow)] border-b border-[var(--line)]">
              <tr>
                <th className="p-3 text-left text-[11px] uppercase tracking-wider text-[var(--gray-600)] font-bold">Day</th>
                {SLOTS.map((slot) => (
                  <th key={slot} className="p-3 text-[11px] uppercase tracking-wider text-[var(--gray-600)] font-bold">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {DAYS.map((day) => (
                <tr key={day}>
                  <td className="p-3 text-left font-bold text-[var(--ink)]">{day}</td>
                  {SLOTS.map((slot) => {
                    const key = `${day}-${slot}`;
                    const isChecked = !!gridState[key];
                    return (
                      <td key={slot} className="p-2">
                        <button
                          type="button"
                          onClick={() => toggleSlot(day, slot)}
                          className={`w-full py-2 px-3 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                            isChecked
                              ? 'bg-[var(--green-900)] text-white border-[var(--green-900)]'
                              : 'bg-white border-[var(--line)] text-[var(--gray-600)] hover:bg-[var(--snow)]'
                          }`}
                        >
                          {isChecked ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionWrapper>

      {/* SECTION F: BADGES AND CERTIFICATES (Dark band) */}
      <SectionWrapper variant="dark" containerClassName="py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10 mb-6">
          <div>
            <h2 className="font-bold text-xl text-white">
              Volunteer Badges &amp; Certificates
            </h2>
            <p className="text-xs text-[var(--gray-400)]">
              Milestones for Civics and Community Engagement recognition
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCertModalOpen(true)}
            disabled={hours < 10}
            className={`px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer ${
              hours >= 10
                ? 'bg-[var(--green-400)] text-[var(--ink)] hover:bg-white'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            Download Certificate {hours < 10 ? '(Requires 10 hrs)' : ''}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-[28px] border ${
                b.unlocked
                  ? 'bg-[#181818] border-[var(--green-400)]/40 text-white'
                  : 'bg-[#121212] border-white/10 text-white/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-xs text-white">{b.title}</h3>
                {b.unlocked ? (
                  <span className="text-[10px] font-bold text-[var(--green-400)]">Unlocked</span>
                ) : (
                  <span className="text-[10px] text-[var(--gray-400)]">Locked</span>
                )}
              </div>
              <p className="text-xs text-[var(--gray-400)] mb-3">{b.desc}</p>

              {/* Progress bar in black and green on snow track */}
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--green-400)]"
                  style={{ width: `${b.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* SECTION G: STUDY RESOURCES (Light band) */}
      <SectionWrapper variant="light" containerClassName="py-12">
        <div className="mb-6">
          <h2 className="font-bold text-xl text-[var(--ink)]">Study Resources</h2>
          <p className="text-xs text-[var(--gray-600)]">
            Share notes, guides, and reference material on your profile.
          </p>
        </div>

        <form
          onSubmit={handleAddResource}
          className="p-6 rounded-[28px] bg-white border border-[var(--line)] grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-6"
        >
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-[var(--ink)]">Resource Title</label>
            <input
              type="text"
              placeholder="e.g. Recursion Call Stack Template"
              value={resTitle}
              onChange={(e) => setResTitle(e.target.value)}
              className="w-full bg-white border border-[var(--line)] rounded-[14px] px-3.5 py-2 text-xs text-[var(--ink)] outline-none focus:border-[var(--ink)]"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-[var(--ink)]">Resource URL / Link</label>
            <input
              type="url"
              placeholder="https://..."
              value={resLink}
              onChange={(e) => setResLink(e.target.value)}
              className="w-full bg-white border border-[var(--line)] rounded-[14px] px-3.5 py-2 text-xs text-[var(--ink)] outline-none focus:border-[var(--ink)]"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={resSubject}
              onChange={(e) => setResSubject(e.target.value)}
              className="flex-1 bg-white border border-[var(--line)] rounded-[14px] px-3.5 py-2 text-xs text-[var(--ink)] outline-none cursor-pointer focus:border-[var(--ink)]"
            >
              {(mentor.subjects || ['Programming']).map((s) => {
                const sName = getSubjectName(s);
                return (
                  <option key={sName} value={sName}>
                    {sName}
                  </option>
                );
              })}
            </select>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[var(--ink)] hover:bg-[var(--green-900)] text-white text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus className="size-3.5" weight="bold" />
              <span>Add</span>
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {(mentor.resources || []).length > 0 ? (
            mentor.resources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-[20px] bg-white border border-[var(--line)] flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate">
                  <p className="font-bold text-[var(--ink)] truncate">{res.title}</p>
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[var(--green-600)] hover:underline truncate block"
                  >
                    {res.link}
                  </a>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-[var(--snow)] text-[10px] text-[var(--gray-600)] font-semibold">
                    {res.subject}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteResource(mentor.id, res.id)}
                    className="p-1.5 text-[var(--gray-600)] hover:text-[var(--error)] transition-colors cursor-pointer"
                    title="Delete resource"
                  >
                    <Trash className="size-4" weight="bold" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[var(--gray-600)] text-center py-4">No study resources added yet.</p>
          )}
        </div>
      </SectionWrapper>

      {/* Modals */}
      <RequestThread
        session={threadSession}
        isMentor={true}
        open={threadOpen}
        onOpenChange={setThreadOpen}
        onAcceptClick={() => {
          setAcceptSessionObj(threadSession);
          setAcceptOpen(true);
        }}
      />

      <AcceptSessionModal
        session={acceptSessionObj}
        open={acceptOpen}
        onOpenChange={setAcceptOpen}
        onConfirm={acceptRequest}
      />

      <RescheduleSessionModal
        session={rescheduleSessionObj}
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onReschedule={rescheduleSession}
      />

      <CancelSessionModal
        session={cancelSessionObj}
        isDecline={cancelIsDecline}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onCancel={cancelIsDecline ? declineRequest : cancelSession}
      />

      <CertificateModal
        mentor={mentor}
        open={certModalOpen}
        onOpenChange={setCertModalOpen}
      />
    </div>
  );
}
