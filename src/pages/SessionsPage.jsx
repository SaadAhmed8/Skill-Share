// src/pages/SessionsPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Check,
  ArrowRight,
} from '@phosphor-icons/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { SectionWrapper } from '../components/SectionWrapper';
import { SessionCard } from '../components/SessionCard';
import { RequestThread } from '../components/RequestThread';
import { GettingStartedChecklist } from '../components/GettingStartedChecklist';
import {
  AcceptSessionModal,
  RescheduleSessionModal,
  CancelSessionModal,
} from '../components/SessionActionModals';
import { FeedbackDialog } from '../components/FeedbackDialog';
import { useApp } from '../context/AppContext';

export function SessionsPage() {
  const {
    currentUser,
    getUserSessions,
    acceptRequest,
    declineRequest,
    rescheduleSession,
    cancelSession,
    completeSession,
  } = useApp();

  const [activeTab, setActiveTab] = useState('pending');

  const [threadSession, setThreadSession] = useState(null);
  const [threadOpen, setThreadOpen] = useState(false);

  const [acceptSession, setAcceptSession] = useState(null);
  const [acceptOpen, setAcceptOpen] = useState(false);

  const [rescheduleSessionObj, setRescheduleSessionObj] = useState(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const [cancelSessionObj, setCancelSessionObj] = useState(null);
  const [cancelIsDecline, setCancelIsDecline] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const [feedbackSessionObj, setFeedbackSessionObj] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  if (!currentUser) {
    return (
      <SectionWrapper variant="light" containerClassName="py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="font-bold text-2xl text-[var(--ink)]">
            Sign in to view sessions
          </h1>
          <p className="text-xs sm:text-sm text-[var(--gray-600)] leading-relaxed">
            Please log in with your NED university email to manage upcoming mentoring sessions and request threads.
          </p>
          <div className="pt-2">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] text-xs font-semibold"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="size-3.5" weight="bold" />
            </Link>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <SectionWrapper variant="light" containerClassName="py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="font-bold text-2xl text-[var(--ink)]">
            Administrator Account
          </h1>
          <p className="text-xs sm:text-sm text-[var(--gray-600)] leading-relaxed">
            Administrators manage mentor approvals, campus impact statistics, and reported conversations via the Admin Dashboard.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] text-xs font-semibold"
            >
              <span>Open Admin Dashboard</span>
              <ArrowRight className="size-3.5" weight="bold" />
            </Link>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  const isMentorRole = currentUser.role === 'mentor';
  const sessions = getUserSessions(currentUser.id);

  const pendingSessions = sessions.filter((s) => s.status === 'requested');
  const confirmedSessions = sessions.filter((s) => s.status === 'accepted');
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const cancelledSessions = sessions.filter((s) => s.status === 'cancelled');

  const handleOpenThread = (session) => {
    setThreadSession(session);
    setThreadOpen(true);
  };

  const handleAcceptClick = (session) => {
    setAcceptSession(session);
    setAcceptOpen(true);
  };

  const handleDeclineClick = (session) => {
    setCancelSessionObj(session);
    setCancelIsDecline(true);
    setCancelOpen(true);
  };

  const handleRescheduleClick = (session) => {
    setRescheduleSessionObj(session);
    setRescheduleOpen(true);
  };

  const handleCancelClick = (session) => {
    setCancelSessionObj(session);
    setCancelIsDecline(false);
    setCancelOpen(true);
  };

  const handleCompleteClick = (session) => {
    completeSession(session.id);
  };

  const handleFeedbackClick = (session) => {
    setFeedbackSessionObj(session);
    setFeedbackOpen(true);
  };

  return (
    <div className="flex flex-col w-full bg-[var(--white)]">
      {/* SECTION A: HEADER PANEL (Dark band) */}
      <SectionWrapper variant="dark" containerClassName="py-14 sm:py-18">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-400)] block mb-1">
              {isMentorRole ? 'Mentor Session Workspace' : 'Student Consultations'}
            </span>
            <h1 className="font-bold text-3xl sm:text-5xl text-white tracking-[-0.03em] page-header-anim">
              My Sessions
            </h1>
            <p className="text-xs sm:text-sm text-[var(--gray-400)] mt-1 max-w-xl">
              Manage requested appointments, join verified meeting links, and leave constructive post-session reviews.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/mentors"
              className="px-6 py-3 rounded-full bg-[var(--green-400)] text-[var(--ink)] hover:bg-white text-xs font-bold transition-colors flex items-center gap-2"
            >
              <span>Find New Mentors</span>
              <ArrowRight className="size-3.5" weight="bold" />
            </Link>
          </div>
        </div>

        {/* 3 Stats in tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 stagger-grid">
          <div className="p-5 rounded-[28px] bg-white/5 border border-white/10 text-center">
            <p className="font-bold text-4xl text-white">
              {pendingSessions.length}
            </p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-400)] mt-1">
              Pending Requests
            </p>
          </div>

          <div className="p-5 rounded-[28px] bg-white/5 border border-white/10 text-center">
            <p className="font-bold text-4xl text-[var(--green-400)]">
              {confirmedSessions.length}
            </p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-400)] mt-1">
              Upcoming Confirmed
            </p>
          </div>

          <div className="p-5 rounded-[28px] bg-white/5 border border-white/10 text-center">
            <p className="font-bold text-4xl text-white">
              {completedSessions.length}
            </p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--gray-400)] mt-1">
              Completed Sessions
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION B: SESSIONS LIST WITH PILL TABS (Light band) */}
      <SectionWrapper variant="light" containerClassName="py-10 sm:py-14">
        <GettingStartedChecklist page="sessions" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Pill style Tabs Header */}
          <div className="flex justify-start mb-6 overflow-x-auto pb-1">
            <TabsList className="bg-[var(--snow)] p-1.5 rounded-full flex gap-2 border border-[var(--line)]">
              {[
                { val: 'pending', label: 'Pending', count: pendingSessions.length },
                { val: 'confirmed', label: 'Confirmed', count: confirmedSessions.length },
                { val: 'completed', label: 'Completed', count: completedSessions.length },
                { val: 'cancelled', label: 'Cancelled', count: cancelledSessions.length },
              ].map((t) => (
                <TabsTrigger
                  key={t.val}
                  value={t.val}
                  className="px-5 py-2 rounded-full text-xs font-bold transition-colors data-[state=active]:bg-[var(--ink)] data-[state=active]:text-white text-[var(--gray-600)] flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                    {t.count}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Pending Tab */}
          <TabsContent value="pending" className="mt-0">
            {pendingSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onOpenThread={handleOpenThread}
                    onAccept={handleAcceptClick}
                    onDecline={handleDeclineClick}
                    onReschedule={handleRescheduleClick}
                    onCancel={handleCancelClick}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-[28px] border border-[var(--line)] bg-[var(--snow)] text-xs text-[var(--gray-600)]">
                No pending session requests at the moment.
              </div>
            )}
          </TabsContent>

          {/* Confirmed Tab */}
          <TabsContent value="confirmed" className="mt-0">
            {confirmedSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {confirmedSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onOpenThread={handleOpenThread}
                    onReschedule={handleRescheduleClick}
                    onCancel={handleCancelClick}
                    onComplete={handleCompleteClick}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-[28px] border border-[var(--line)] bg-[var(--snow)] text-xs text-[var(--gray-600)]">
                No upcoming confirmed sessions.
              </div>
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="mt-0">
            {completedSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    isMentor={isMentorRole}
                    onOpenThread={handleOpenThread}
                    onFeedback={handleFeedbackClick}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-[28px] border border-[var(--line)] bg-[var(--snow)] text-xs text-[var(--gray-600)]">
                No completed sessions logged yet.
              </div>
            )}
          </TabsContent>

          {/* Cancelled Tab */}
          <TabsContent value="cancelled" className="mt-0">
            {cancelledSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cancelledSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onOpenThread={handleOpenThread}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-[28px] border border-[var(--line)] bg-[var(--snow)] text-xs text-[var(--gray-600)]">
                No cancelled session requests.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SectionWrapper>

      {/* MODALS */}
      <RequestThread
        session={threadSession}
        open={threadOpen}
        onOpenChange={setThreadOpen}
      />

      <AcceptSessionModal
        session={acceptSession}
        open={acceptOpen}
        onOpenChange={setAcceptOpen}
        onConfirm={(sessionId, meetLink, time) => {
          acceptRequest(sessionId, meetLink, time);
          setAcceptOpen(false);
        }}
      />

      <RescheduleSessionModal
        session={rescheduleSessionObj}
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onConfirm={(sessionId, newTime, reason) => {
          rescheduleSession(sessionId, newTime, reason);
          setRescheduleOpen(false);
        }}
      />

      <CancelSessionModal
        session={cancelSessionObj}
        isDecline={cancelIsDecline}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={(sessionId, reason) => {
          if (cancelIsDecline) {
            declineRequest(sessionId, reason);
          } else {
            cancelSession(sessionId, reason);
          }
          setCancelOpen(false);
        }}
      />

      <FeedbackDialog
        session={feedbackSessionObj}
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
      />
    </div>
  );
}
