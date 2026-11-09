// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Warning,
  Flag,
  DownloadSimple,
  Eye,
  Check,
  X,
  ChartBar,
  Star,
  ChatCircleText,
  Certificate,
} from '@phosphor-icons/react';
import { SectionWrapper } from './SectionWrapper';
import { RequestThread } from './RequestThread';
import { CertificateModal } from './CertificateModal';
import { useApp } from '../context/AppContext';
import { MIN_GPA } from '../lib/validators';
import { getSubjectName, CERTIFICATE_MIN_HOURS } from '../lib/utils';
import { getMentorStats } from '../lib/mentorStats';
import { toast } from 'sonner';

export function AdminDashboard() {
  const {
    users,
    mentors,
    reviews,
    getAllApprovedMentors,
    sessionRequests,
    reports,
    resolveReport,
    approveMentor,
    rejectMentor,
    suspendMentor,
    getFlaggedMessages,
    getSessionFlags,
    getDemandBySubject,
    platformFeedback,
    getPlatformFeedbackStats,
    stats,
  } = useApp();

  const [reportsTab, setReportsTab] = useState('reports');
  const [sessionLogFilter, setSessionLogFilter] = useState('all');
  const [inspectThreadSession, setInspectThreadSession] = useState(null);
  const [inspectThreadOpen, setInspectThreadOpen] = useState(false);
  const [certMentor, setCertMentor] = useState(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [rejectingMentorId, setRejectingMentorId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const pendingMentors = mentors.filter((m) => m.status === 'pending');
  const allApproved = getAllApprovedMentors();
  const flaggedMessages = getFlaggedMessages();
  const demandBySubject = getDemandBySubject();

  const handleApprove = (mentorId) => {
    approveMentor(mentorId);
    toast.success('Mentor application approved and profile published.');
  };

  const handleOpenReject = (mentorId) => {
    setRejectingMentorId(mentorId);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectReason.trim() || rejectReason.trim().length < 10) {
      toast.error('Rejection reason must be at least 10 characters.');
      return;
    }
    rejectMentor(rejectingMentorId, rejectReason.trim());
    setRejectDialogOpen(false);
    toast.info('Mentor application rejected with feedback.');
  };

  const handleResolveReport = (reportId) => {
    resolveReport(reportId, 'Reviewed and verified by academic administration');
    toast.success('Report marked as resolved.');
  };

  const handleInspectConversation = (threadId) => {
    const foundSession = sessionRequests.find((s) => s.id === threadId);
    if (foundSession) {
      setInspectThreadSession(foundSession);
      setInspectThreadOpen(true);
    } else {
      toast.error('Conversation record not found or was deleted.');
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Users', users.length],
      ['Approved Mentors', allApproved.length],
      ['Pending Applications', pendingMentors.length],
      ['Completed Sessions', sessionRequests.filter((s) => s.status === 'completed').length],
      [
        'Total Volunteer Hours',
        mentors.reduce(
          (acc, m) => acc + getMentorStats(m, reviews, sessionRequests).hoursTaught,
          0
        ),
      ],
      ['Open Incident Reports', reports.filter((r) => r.status === 'Open').length],
      [],
      ['Demanded Subject', 'Session Requests'],
      ...demandBySubject.map((d) => [d.subject, d.count]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ned_skill_share_impact_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Impact statistics exported as CSV.');
  };

  const filteredSessions = sessionRequests.filter((s) => {
    if (sessionLogFilter === 'all') return true;
    if (sessionLogFilter === 'flagged') {
      const flags = getSessionFlags(s.id);
      return flags.length > 0;
    }
    return s.status === sessionLogFilter;
  });

  return (
    <div className="flex flex-col w-full bg-[var(--white)]">
      {/* SECTION A: HEADER (Dark band) */}
      <SectionWrapper variant="dark" containerClassName="py-14 sm:py-18">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-400)] block">
              University Administration Portal
            </span>
            <h1 className="font-bold text-3xl sm:text-5xl text-white tracking-[-0.03em]">
              Admin Control Center
            </h1>
            <p className="text-xs sm:text-sm text-[var(--gray-400)] max-w-xl">
              Oversee senior mentor applications, audit conversation safety, inspect reported misconduct, and analyze campus academic demand.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="self-start md:self-auto px-6 py-3 rounded-full text-xs font-bold bg-[var(--green-400)] text-[var(--ink)] hover:bg-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <DownloadSimple weight="bold" className="size-4" />
            <span>Export Impact CSV</span>
          </button>
        </div>

        {/* SECTION B: PLATFORM STATS in solid tiles */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-8 mt-6 border-t border-white/10">
          <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 text-center">
            <p className="font-bold text-3xl text-white">
              {stats.totalUsers}
            </p>
            <p className="text-xs uppercase tracking-wider text-[var(--gray-400)] mt-1 font-semibold">Total Users</p>
          </div>
          <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 text-center">
            <p className="font-bold text-3xl text-[var(--green-400)]">
              {allApproved.length}
            </p>
            <p className="text-xs uppercase tracking-wider text-[var(--gray-400)] mt-1 font-semibold">Approved Mentors</p>
          </div>
          <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 text-center">
            <p className="font-bold text-3xl text-white">
              {pendingMentors.length}
            </p>
            <p className="text-xs uppercase tracking-wider text-[var(--gray-400)] mt-1 font-semibold">Pending Review</p>
          </div>
          <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 text-center">
            <p className="font-bold text-3xl text-[var(--green-400)]">
              {sessionRequests.filter((s) => s.status === 'completed').length}
            </p>
            <p className="text-xs uppercase tracking-wider text-[var(--gray-400)] mt-1 font-semibold">Completed</p>
          </div>
          <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 text-center">
            <p className="font-bold text-3xl text-white">
              {stats.totalVolunteerHours}h
            </p>
            <p className="text-xs uppercase tracking-wider text-[var(--gray-400)] mt-1 font-semibold">Volunteer Hours</p>
          </div>
          <div className="p-4 rounded-[20px] bg-white/5 border border-white/10 text-center">
            <p className={`font-bold text-3xl ${stats.openReports > 0 ? 'text-[var(--error)]' : 'text-white'}`}>
              {stats.openReports}
            </p>
            <p className="text-xs uppercase tracking-wider text-[var(--gray-400)] mt-1 font-semibold">Open Reports</p>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION C: PENDING MENTOR APPROVALS (Light band) */}
      <SectionWrapper variant="light" containerClassName="py-12">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-2xl text-[var(--ink)]">
                  Pending Mentor Approvals
                </h2>
                {pendingMentors.length > 0 && (
                  <span className="px-3 py-1 rounded-full bg-[var(--mint)] text-[var(--green-900)] text-xs font-bold">
                    {pendingMentors.length} Awaiting
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--gray-600)] mt-1">
                GPA 3.0 eligibility check is verified here. Directory ranking is calculated strictly from student feedback.
              </p>
            </div>
          </div>

          {pendingMentors.length > 0 ? (
            <div className="overflow-x-auto border border-[var(--line)] rounded-[28px] bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[var(--snow)] border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--gray-600)] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Applicant</th>
                    <th className="py-3.5 px-4">Department and Year</th>
                    <th className="py-3.5 px-4">GPA Eligibility</th>
                    <th className="py-3.5 px-4">Subjects</th>
                    <th className="py-3.5 px-4 text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] text-[var(--ink)]">
                  {pendingMentors.map((app) => (
                    <tr key={app.id} className="hover:bg-[var(--snow)] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {app.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--ink)]">{app.name}</p>
                            <p className="text-[11px] text-[var(--gray-600)]">{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[var(--ink)]">{app.department}</p>
                        <p className="text-[11px] text-[var(--gray-600)]">Year {app.year}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-[11px] ${app.gpa >= MIN_GPA
                            ? 'bg-[var(--mint)] text-[var(--green-900)]'
                            : 'bg-red-50 text-[var(--error)] border border-red-200'
                            }`}
                        >
                          CGPA: {app.gpa ? app.gpa.toFixed(2) : '3.40'}{' '}
                          {app.gpa >= MIN_GPA ? '✓' : '⚠️'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(app.subjects || []).map((s) => {
                            const sName = getSubjectName(s);
                            return (
                              <span
                                key={sName || String(s)}
                                className="px-2 py-0.5 rounded-full bg-[var(--snow)] text-[10px] text-[var(--gray-600)] font-semibold border border-[var(--line)]"
                              >
                                {sName}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(app.id)}
                            className="px-3.5 py-1.5 rounded-full bg-[var(--ink)] hover:bg-[var(--green-900)] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Check className="size-3.5" weight="bold" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReject(app.id)}
                            className="px-3 py-1.5 rounded-full border border-[var(--line)] hover:bg-red-50 text-[var(--error)] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <X className="size-3.5" weight="bold" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-[var(--gray-600)] rounded-[28px] border border-[var(--line)] bg-[var(--snow)]">
              No pending mentor applications in the queue.
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* SECTION D: SAFETY AND INCIDENT REPORTS (Snow band) */}
      <SectionWrapper variant="light-alt" containerClassName="py-12">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[var(--line)]">
            <div>
              <h2 className="font-bold text-2xl text-[var(--ink)]">
                Safety and Moderation Logs
              </h2>
              <p className="text-xs text-[var(--gray-600)] mt-1">
                Student reported issues and keyword triggers (e.g. WhatsApp, phone, paid assignments).
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-[var(--line)]">
              <button
                type="button"
                onClick={() => setReportsTab('reports')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${reportsTab === 'reports'
                  ? 'bg-[var(--ink)] text-white'
                  : 'text-[var(--gray-600)] hover:text-[var(--ink)]'
                  }`}
              >
                Direct Reports ({reports.length})
              </button>
              <button
                type="button"
                onClick={() => setReportsTab('flagged')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${reportsTab === 'flagged'
                  ? 'bg-[var(--ink)] text-white'
                  : 'text-[var(--gray-600)] hover:text-[var(--ink)]'
                  }`}
              >
                Keyword Triggers ({flaggedMessages.length})
              </button>
            </div>
          </div>

          {reportsTab === 'reports' ? (
            <div className="overflow-x-auto border border-[var(--line)] rounded-[28px] bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[var(--snow)] border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--gray-600)] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Reporter</th>
                    <th className="py-3.5 px-4">Reported User</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4">Details</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] text-[var(--ink)]">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-[var(--snow)] transition-colors">
                      <td className="py-3.5 px-4 font-bold">{rep.reporterName}</td>
                      <td className="py-3.5 px-4 text-[var(--gray-600)]">
                        {rep.reportedUserName || rep.reportedUserId}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[var(--error)]">{rep.reason}</td>
                      <td className="py-3.5 px-4 text-xs text-[var(--gray-600)] max-w-xs truncate">
                        {rep.details}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${rep.status === 'Open'
                            ? 'bg-red-50 text-[var(--error)]'
                            : 'bg-[var(--mint)] text-[var(--green-900)]'
                            }`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {rep.threadId && (
                            <button
                              type="button"
                              onClick={() => handleInspectConversation(rep.threadId)}
                              className="px-3 py-1.5 rounded-full border border-[var(--line)] hover:bg-[var(--snow)] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="size-3" weight="bold" />
                              <span>View Thread</span>
                            </button>
                          )}
                          {rep.status === 'Open' ? (
                            <button
                              type="button"
                              onClick={() => handleResolveReport(rep.id)}
                              className="px-3.5 py-1.5 rounded-full bg-[var(--green-900)] text-white text-xs font-semibold cursor-pointer"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-xs text-[var(--green-600)] font-bold">Resolved</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-3">
              {flaggedMessages.length > 0 ? (
                flaggedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-[20px] bg-white border border-[var(--line)] flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-[var(--ink)] flex items-center gap-2">
                        <span>Sender: {msg.senderName}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-50 text-[var(--error)] font-bold">
                          Off-Platform Sensitive Text
                        </span>
                      </p>
                      <p className="text-[var(--gray-600)] italic">"{msg.text}"</p>
                      <p className="text-[10px] text-[var(--gray-600)]">
                        Thread: {msg.subject} • {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInspectConversation(msg.sessionId)}
                      className="px-4 py-2 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] text-xs font-semibold shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="size-3 text-[var(--green-400)]" weight="bold" />
                      <span>Open Thread</span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-xs text-[var(--gray-600)] rounded-[28px] border border-[var(--line)] bg-white">
                  No sensitive keywords flagged in recent conversations.
                </p>
              )}
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* SECTION E: SESSION LOG & AUTO FLAGS (Dark band) */}
      <SectionWrapper variant="dark" containerClassName="py-12">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h2 className="font-bold text-2xl text-white">
                Platform Session Log
              </h2>
              <p className="text-xs text-[var(--gray-400)]">
                Audit trail with heuristic flags: Fast confirms, off-platform links, repeat cancellations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--gray-400)] mr-1">Filter status:</span>
              {['all', 'flagged', 'completed', 'requested', 'cancelled'].map((flt) => (
                <button
                  key={flt}
                  type="button"
                  onClick={() => setSessionLogFilter(flt)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer capitalize ${sessionLogFilter === flt
                    ? 'bg-[var(--green-400)] text-[var(--ink)]'
                    : 'border border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-[28px] bg-[#141414]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-[var(--gray-400)] font-bold">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Mentor</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Feedback</th>
                  <th className="py-3.5 px-4 text-right">Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/90">
                {filteredSessions.map((s) => {
                  const flags = getSessionFlags(s.id);
                  return (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-[var(--gray-400)]">
                        {new Date(s.confirmedTime || s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">{s.studentName}</td>
                      <td className="py-3 px-4 text-white/80">{s.mentorName}</td>
                      <td className="py-3 px-4 text-[var(--green-400)] font-semibold">{s.subject}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize">{s.status}</span>
                      </td>
                      <td className="py-3 px-4">{s.durationMinutes}m</td>
                      <td className="py-3 px-4">
                        {s.feedbackGiven ? (
                          <span className="text-[var(--green-400)] font-bold">Yes</span>
                        ) : (
                          <span className="opacity-40">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {flags.length > 0 ? (
                          <div className="flex flex-col items-end gap-1">
                            {flags.map((f, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold flex items-center gap-1"
                              >
                                <Flag className="size-2.5" weight="bold" />
                                <span>{f}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="opacity-30 text-[11px]">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION F: COMMUNITY IMPACT CHARTS (Light band, plain div bars in black & green on snow) */}
      <SectionWrapper variant="light" containerClassName="py-12">
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-2xl text-[var(--ink)]">
              Community Impact and Subject Demand
            </h2>
            <p className="text-xs text-[var(--gray-600)] mt-1">
              Curricular insights on academic struggle areas across NED junior cohorts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 bg-white border border-[var(--line)] rounded-[28px] p-6">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
                Most Demanded Subjects
              </h3>
              <div className="space-y-3">
                {demandBySubject.map((d) => {
                  const maxCount = Math.max(...demandBySubject.map((i) => i.count), 1);
                  const pct = (d.count / maxCount) * 100;
                  return (
                    <div key={d.subject} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-[var(--ink)]">
                        <span>{d.subject}</span>
                        <span className="text-[var(--gray-600)]">{d.count} requests</span>
                      </div>
                      <div className="h-3 w-full bg-[var(--snow)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--ink)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 bg-white border border-[var(--line)] rounded-[28px] p-6">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
                Top 3 Volunteer Mentors by Hours
              </h3>
              <div className="space-y-3">
                {[...allApproved]
                  .sort(
                    (a, b) =>
                      getMentorStats(b, reviews, sessionRequests).hoursTaught -
                      getMentorStats(a, reviews, sessionRequests).hoursTaught
                  )
                  .slice(0, 3)
                  .map((m, idx) => {
                    const mStats = getMentorStats(m, reviews, sessionRequests);
                    return (
                      <div
                        key={m.id}
                        className="p-4 rounded-[20px] bg-[var(--snow)] border border-[var(--line)] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="size-7 rounded-full bg-[var(--ink)] text-white font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div className="size-9 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center font-bold text-xs uppercase">
                            {m.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--ink)]">{m.name}</p>
                            <p className="text-[11px] text-[var(--gray-600)]">{m.department}</p>
                          </div>
                        </div>
                        <span className="font-bold text-sm text-[var(--green-600)]">
                          {mStats.hoursTaught} Hours
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Platform Feedback Panel */}
          <div className="space-y-4 bg-white border border-[var(--line)] rounded-[28px] p-6 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
                  Platform Feedback
                </h3>
                <p className="text-xs text-[var(--gray-600)] mt-0.5">
                  Community rating and latest submissions
                </p>
              </div>
              {(() => {
                const pfStats = getPlatformFeedbackStats ? getPlatformFeedbackStats() : { rating: 4.8, count: 13 };
                return (
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-bold text-[var(--ink)]">
                      <Star className="size-3.5 text-[var(--green-600)]" weight="fill" />
                      <span>{pfStats.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-[var(--gray-600)] font-medium">
                      {pfStats.count} reviews
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Latest 5 entries */}
            <div className="divide-y divide-[var(--line)] border-t border-[var(--line)] pt-2 space-y-3">
              {(platformFeedback || []).slice(0, 5).map((entry) => (
                <div key={entry.id} className="pt-3 first:pt-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[var(--ink)]">{entry.name}</span>
                      <span className="text-[11px] text-[var(--gray-600)]">({entry.role} • {entry.department})</span>
                    </div>
                    <span className="font-semibold text-[var(--green-600)] text-[11px]">
                      ★ {entry.rating}.0
                    </span>
                  </div>
                  <p className="text-xs text-[var(--gray-600)] line-clamp-2 leading-relaxed italic">
                    "{entry.comment}"
                  </p>
                  <p className="text-[10px] text-[var(--gray-400)]">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION G: MENTOR DIRECTORY ROSTER (Dark band) */}
      <SectionWrapper variant="dark" containerClassName="py-12">
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-2xl text-white">
              Mentor Directory Roster
            </h2>
            <p className="text-xs text-[var(--gray-400)] mt-1">
              Active approved seniors. Suspended mentors are immediately hidden from student search and booking.
            </p>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-[28px] bg-[#141414]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-[var(--gray-400)] font-bold">
                <tr>
                  <th className="py-3.5 px-4">Mentor</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Hours Taught</th>
                  <th className="py-3.5 px-4">Certificate</th>
                  <th className="py-3.5 px-4 text-right">Visibility / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white">
                {allApproved.map((m) => {
                  const mStats = getMentorStats(m, reviews, sessionRequests);
                  const mHours = mStats.hoursTaught;
                  const mRating = mStats.rating;
                  const mReviewCount = mStats.reviewCount;
                  const isEligible = mHours >= CERTIFICATE_MIN_HOURS;

                  return (
                    <tr key={m.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold">{m.name}</td>
                      <td className="py-3 px-4 text-[var(--gray-400)]">{m.department}</td>
                      <td className="py-3 px-4 text-[var(--green-400)] font-bold">
                        {mRating !== null && mReviewCount > 0
                          ? `${mRating.toFixed(1)} (${mReviewCount}) ★`
                          : 'New Mentor'}
                      </td>
                      <td className="py-3 px-4">{mHours} hrs</td>
                      <td className="py-3 px-4">
                        {isEligible ? (
                          <button
                            type="button"
                            onClick={() => {
                              setCertMentor(m);
                              setCertModalOpen(true);
                            }}
                            className="px-3 py-1 rounded-full bg-[var(--green-900)] text-[var(--green-400)] border border-[var(--green-600)] text-[11px] font-semibold flex items-center gap-1 hover:bg-black transition-colors cursor-pointer"
                          >
                            <Certificate className="size-3" weight="bold" />
                            <span>View ({mHours}h)</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[var(--gray-400)]">
                            {mHours}/{CERTIFICATE_MIN_HOURS}h
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const nextState = !m.suspended;
                            suspendMentor(m.id, nextState);
                            toast.info(
                              nextState
                                ? `Suspended ${m.name}. Profile hidden from public directory.`
                                : `Reinstated ${m.name}. Profile is now active.`
                            );
                          }}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${m.suspended
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-[var(--green-900)] text-white border border-[var(--green-600)]'
                            }`}
                        >
                          {m.suspended ? 'Suspended (Hidden)' : 'Active (Visible)'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* Inspect Thread Modal */}
      <RequestThread
        session={inspectThreadSession}
        isMentor={true}
        open={inspectThreadOpen}
        onOpenChange={setInspectThreadOpen}
      />

      {/* Reject Reason Dialog */}
      {rejectDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleConfirmReject}
            className="bg-white border border-[var(--line)] rounded-[28px] p-6 sm:p-8 max-w-md w-full space-y-4 shadow-none"
          >
            <h3 className="font-bold text-lg text-[var(--ink)] text-center">
              Reject Mentor Application
            </h3>
            <p className="text-xs text-[var(--gray-600)] text-center">
              Please provide constructive feedback so the applicant can revise their submission.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. GPA requirement not verified or please detail your weekly availability..."
              className="w-full bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] p-3 text-xs text-[var(--ink)] outline-none resize-none leading-relaxed"
            />
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectDialogOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--gray-600)] border border-[var(--line)] hover:bg-[var(--snow)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--error)] text-white hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Certificate Modal for eligible mentors */}
      <CertificateModal
        mentor={certMentor}
        open={certModalOpen}
        onOpenChange={setCertModalOpen}
      />
    </div>
  );
}
