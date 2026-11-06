// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialUsers,
  initialMentors,
  initialSessionRequests,
  initialReviews,
  initialReports,
  initialNotifications,
} from '../data/mockData';
import { validateUniversityEmail } from '../lib/validators';
import { generatePlatformMeetingLink } from '../lib/utils';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  CURRENT_USER: 'skillshare_current_user',
  USERS: 'skillshare_users',
  MENTORS: 'skillshare_mentors',
  SESSION_REQUESTS: 'skillshare_session_requests',
  REVIEWS: 'skillshare_reviews',
  REPORTS: 'skillshare_reports',
  NOTIFICATIONS: 'skillshare_notifications',
  MENTOR_FEEDBACK: 'skillshare_mentor_feedback',
};

export function AppProvider({ children }) {
  // Current user state (defaults to student-1 or stored)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse current user from storage', e);
      }
    }
    return initialUsers[1]; // Zainab Fatima (Student)
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [mentors, setMentors] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENTORS);
    return saved ? JSON.parse(saved) : initialMentors;
  });

  const [sessionRequests, setSessionRequests] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION_REQUESTS);
    return saved ? JSON.parse(saved) : initialSessionRequests;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : initialReports;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [mentorFeedbacks, setMentorFeedbacks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENTOR_FEEDBACK);
    return saved ? JSON.parse(saved) : [];
  });

  // Save changes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENTORS, JSON.stringify(mentors));
  }, [mentors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSION_REQUESTS, JSON.stringify(sessionRequests));
  }, [sessionRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENTOR_FEEDBACK, JSON.stringify(mentorFeedbacks));
  }, [mentorFeedbacks]);

  // Auth: Log in
  const logIn = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      throw new Error('No user found with this university email.');
    }
    setCurrentUser(found);
    return found;
  };

  // Auth: Sign up
  const signUp = ({ name, email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!validateUniversityEmail(cleanEmail)) {
      throw new Error('Must use a valid university email ending with .edu.pk');
    }
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this university email already exists.');
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: 'student',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const loginAs = (userId) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const logOut = logout;

  // Mentors query helpers: Excludes suspended mentors per Phase 5 Rule
  const getApprovedMentors = () => {
    return mentors.filter((m) => m.status === 'approved' && !m.suspended);
  };

  const getAllApprovedMentors = () => {
    return mentors.filter((m) => m.status === 'approved');
  };

  const getMentorById = (mentorId) => {
    return mentors.find((m) => m.id === mentorId) || null;
  };

  const getMentorReviews = (mentorId) => {
    return reviews.filter((r) => r.mentorId === mentorId);
  };

  const getMentorSessions = (mentorId) => {
    return sessionRequests.filter(
      (s) => s.mentorId === mentorId && s.status === 'completed'
    );
  };

  const getMentorStatusForUser = (userId) => {
    if (!userId) return null;
    const mentorRecord = mentors.find((m) => m.userId === userId || m.email === currentUser?.email);
    return mentorRecord ? mentorRecord.status : null;
  };

  const getMentorForUser = (userId) => {
    if (!userId) return null;
    return mentors.find((m) => m.userId === userId || m.email === currentUser?.email) || null;
  };

  // Mentor apply & approval
  const applyAsMentor = (applicationData) => {
    if (!currentUser) throw new Error('Must be logged in to apply as a mentor.');

    const existingIndex = mentors.findIndex(
      (m) => m.userId === currentUser.id || m.email === currentUser.email
    );

    const newMentorObj = {
      id: existingIndex >= 0 ? mentors[existingIndex].id : `m-${Date.now()}`,
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      rating: 0,
      ratingCount: 0,
      hoursTaught: 0,
      sessionsCount: 0,
      responseTime: "< 30 mins",
      badges: ["New Mentor"],
      isNew: true,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      avatar: currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      suspended: false,
      resources: [],
      ...applicationData,
    };

    if (existingIndex >= 0) {
      setMentors((prev) => {
        const copy = [...prev];
        copy[existingIndex] = newMentorObj;
        return copy;
      });
    } else {
      setMentors((prev) => [newMentorObj, ...prev]);
    }

    return newMentorObj;
  };

  const resetMentorApplication = (mentorId) => {
    setMentors((prev) => prev.filter((m) => m.id !== mentorId && m.userId !== currentUser?.id));
  };

  const approveMentor = (mentorId) => {
    let applicantUserId = null;
    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          applicantUserId = m.userId;
          return { ...m, status: 'approved' };
        }
        return m;
      })
    );

    setUsers((prev) =>
      prev.map((u) => {
        const isMatched = mentors.some((m) => m.id === mentorId && (m.userId === u.id || m.email === u.email));
        return isMatched ? { ...u, role: 'mentor' } : u;
      })
    );

    if (applicantUserId) {
      addNotification({
        userId: applicantUserId,
        title: 'Mentor Application Approved!',
        message: 'Congratulations! Your mentor profile has been approved and is now live.',
        type: 'mentor_approved',
        link: '/dashboard',
      });
    }
  };

  const rejectMentor = (mentorId, reason = '') => {
    let applicantUserId = null;
    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          applicantUserId = m.userId;
          return { ...m, status: 'rejected', rejectReason: reason };
        }
        return m;
      })
    );

    if (applicantUserId) {
      addNotification({
        userId: applicantUserId,
        title: 'Application Update',
        message: `Your mentor application was not approved: ${reason}`,
        type: 'mentor_rejected',
        link: '/auth?tab=mentor',
      });
    }
  };

  // Phase 5: Suspend/Unsuspend mentor toggle
  const suspendMentor = (mentorId, suspended) => {
    setMentors((prev) =>
      prev.map((m) => (m.id === mentorId ? { ...m, suspended } : m))
    );
  };

  // Phase 5: Update mentor weekly availability
  const updateAvailability = (mentorId, newAvailability) => {
    setMentors((prev) =>
      prev.map((m) => (m.id === mentorId ? { ...m, availability: newAvailability } : m))
    );
  };

  // Phase 5: Study Resources (Add & Delete)
  const addResource = (mentorId, { title, link, subject }) => {
    const newRes = {
      id: `res-${Date.now()}`,
      title,
      link,
      subject,
      createdAt: new Date().toISOString(),
    };

    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          return {
            ...m,
            resources: [...(m.resources || []), newRes],
          };
        }
        return m;
      })
    );
    return newRes;
  };

  const deleteResource = (mentorId, resourceId) => {
    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          return {
            ...m,
            resources: (m.resources || []).filter((r) => r.id !== resourceId),
          };
        }
        return m;
      })
    );
  };

  // Notifications Helper
  const addNotification = ({ userId, title, message, type = 'info', link = '/sessions' }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      message,
      type,
      link,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return newNotif;
  };

  const markNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  // User Sessions query
  const getUserSessions = (userId) => {
    if (!userId) return [];
    const userMentor = mentors.find((m) => m.userId === userId || m.email === currentUser?.email);
    const mentorId = userMentor?.id;

    return sessionRequests.filter(
      (s) => s.studentId === userId || (mentorId && s.mentorId === mentorId)
    );
  };

  // Session Management Actions
  const createSessionRequest = (requestData) => {
    if (!currentUser) throw new Error('Must be logged in to request a session.');

    const duplicate = sessionRequests.find(
      (req) =>
        req.studentId === currentUser.id &&
        req.mentorId === requestData.mentorId &&
        req.subject === requestData.subject &&
        req.status === 'requested'
    );

    if (duplicate) {
      throw new Error(
        `You already have an active request with this mentor for ${requestData.subject}. Check 'My Sessions' to view status.`
      );
    }

    const mentorObj = mentors.find((m) => m.id === requestData.mentorId);

    const initialMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: requestData.description,
      createdAt: new Date().toISOString(),
    };

    const newRequest = {
      id: `r-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name || 'Junior Student',
      studentEmail: currentUser.email,
      studentPhone: currentUser.phone || null,
      studentAvatar: currentUser.avatar,
      mentorId: requestData.mentorId,
      mentorName: mentorObj?.name || requestData.mentorName || 'Senior Mentor',
      mentorEmail: mentorObj?.email,
      mentorPhone: mentorObj?.phone || null,
      mentorAvatar: mentorObj?.avatar,
      subject: requestData.subject,
      preferredSlot: requestData.preferredSlot,
      description: requestData.description,
      status: 'requested',
      confirmedTime: null,
      durationMinutes: requestData.durationMinutes || 60,
      meetingLink: null,
      isGroupSession: !!requestData.isGroupSession,
      createdAt: new Date().toISOString(),
      feedbackGiven: false,
      messages: [initialMsg],
    };

    setSessionRequests((prev) => [newRequest, ...prev]);

    if (mentorObj?.userId) {
      addNotification({
        userId: mentorObj.userId,
        title: 'New Session Request',
        message: `${currentUser.name} requested a ${requestData.durationMinutes || 60}m session on ${requestData.subject}.`,
        type: 'session_requested',
        link: '/sessions',
      });
    }

    return newRequest;
  };

  const acceptRequest = (requestId, { confirmedTime, durationMinutes = 60, note = '' }) => {
    const meetingLink = generatePlatformMeetingLink();
    const systemMsg = {
      id: `sys-${Date.now()}`,
      isSystem: true,
      text: `Session confirmed for ${new Date(confirmedTime).toLocaleString()} (${durationMinutes} mins). Meeting link: ${meetingLink}`,
      createdAt: new Date().toISOString(),
    };

    let studentTargetId = null;

    setSessionRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          studentTargetId = req.studentId;
          const updatedMessages = [...(req.messages || []), systemMsg];
          if (note && note.trim()) {
            updatedMessages.push({
              id: `msg-note-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              text: note.trim(),
              createdAt: new Date().toISOString(),
            });
          }
          return {
            ...req,
            status: 'accepted',
            confirmedTime,
            durationMinutes: parseInt(durationMinutes, 10),
            meetingLink,
            messages: updatedMessages,
          };
        }
        return req;
      })
    );

    if (studentTargetId) {
      addNotification({
        userId: studentTargetId,
        title: 'Session Accepted!',
        message: `Your mentor accepted the session. Meeting link generated.`,
        type: 'session_accepted',
        link: '/sessions',
      });
    }
  };

  const declineRequest = (requestId, { reason }) => {
    const systemMsg = {
      id: `sys-${Date.now()}`,
      isSystem: true,
      text: `Request declined by mentor: ${reason}`,
      createdAt: new Date().toISOString(),
    };

    let studentTargetId = null;

    setSessionRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          studentTargetId = req.studentId;
          return {
            ...req,
            status: 'cancelled',
            cancelledBy: currentUser.name,
            cancelReason: reason,
            messages: [...(req.messages || []), systemMsg],
          };
        }
        return req;
      })
    );

    if (studentTargetId) {
      addNotification({
        userId: studentTargetId,
        title: 'Session Request Declined',
        message: `Your request was declined: ${reason}`,
        type: 'session_declined',
        link: '/sessions',
      });
    }
  };

  const rescheduleSession = (requestId, { newTime, reason }) => {
    const systemMsg = {
      id: `sys-${Date.now()}`,
      isSystem: true,
      text: `Session rescheduled by ${currentUser.name} to ${new Date(newTime).toLocaleString()}. Reason: ${reason}`,
      createdAt: new Date().toISOString(),
    };

    let notifyTargetId = null;

    setSessionRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          notifyTargetId = req.studentId === currentUser.id ? req.mentorId : req.studentId;
          return {
            ...req,
            confirmedTime: newTime,
            messages: [...(req.messages || []), systemMsg],
          };
        }
        return req;
      })
    );

    if (notifyTargetId) {
      addNotification({
        userId: notifyTargetId,
        title: 'Session Rescheduled',
        message: `${currentUser.name} rescheduled the session: ${reason}`,
        type: 'session_rescheduled',
        link: '/sessions',
      });
    }
  };

  const cancelSession = (requestId, { reason }) => {
    const systemMsg = {
      id: `sys-${Date.now()}`,
      isSystem: true,
      text: `Session cancelled by ${currentUser.name}: ${reason}`,
      createdAt: new Date().toISOString(),
    };

    let notifyTargetId = null;

    setSessionRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          notifyTargetId = req.studentId === currentUser.id ? req.mentorId : req.studentId;
          return {
            ...req,
            status: 'cancelled',
            cancelledBy: currentUser.name,
            cancelReason: reason,
            messages: [...(req.messages || []), systemMsg],
          };
        }
        return req;
      })
    );

    if (notifyTargetId) {
      addNotification({
        userId: notifyTargetId,
        title: 'Session Cancelled',
        message: `${currentUser.name} cancelled the session: ${reason}`,
        type: 'session_cancelled',
        link: '/sessions',
      });
    }
  };

  const completeSession = (requestId) => {
    const systemMsg = {
      id: `sys-${Date.now()}`,
      isSystem: true,
      text: `Session marked as completed. Both student and mentor are eligible to submit feedback.`,
      createdAt: new Date().toISOString(),
    };

    let mentorIdToUpdate = null;
    let durationToAdd = 60;
    let studentIdToNotify = null;

    setSessionRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          mentorIdToUpdate = req.mentorId;
          durationToAdd = req.durationMinutes || 60;
          studentIdToNotify = req.studentId;
          return {
            ...req,
            status: 'completed',
            completedAt: new Date().toISOString(),
            messages: [...(req.messages || []), systemMsg],
          };
        }
        return req;
      })
    );

    if (mentorIdToUpdate) {
      const addedHours = Math.ceil(durationToAdd / 60);
      setMentors((prev) =>
        prev.map((m) => {
          if (m.id === mentorIdToUpdate) {
            return {
              ...m,
              hoursTaught: (m.hoursTaught || 0) + addedHours,
              sessionsCount: (m.sessionsCount || 0) + 1,
            };
          }
          return m;
        })
      );
    }

    if (studentIdToNotify) {
      addNotification({
        userId: studentIdToNotify,
        title: 'Session Completed: Leave Feedback',
        message: 'Your session has finished. Please rate your mentor and share feedback!',
        type: 'feedback_due',
        link: '/sessions',
      });
    }
  };

  const sendMessage = (requestId, { text, flagged = false }) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      flagged,
      createdAt: new Date().toISOString(),
    };

    let targetUserId = null;

    setSessionRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          targetUserId = req.studentId === currentUser.id ? req.mentorId : req.studentId;
          return {
            ...req,
            messages: [...(req.messages || []), newMsg],
          };
        }
        return req;
      })
    );

    if (targetUserId) {
      addNotification({
        userId: targetUserId,
        title: `Message from ${currentUser.name.split(' ')[0]}`,
        message: text.slice(0, 80),
        type: 'new_message',
        link: '/sessions',
      });
    }

    return newMsg;
  };

  const submitStudentFeedback = ({
    sessionId,
    mentorId,
    teachingRating,
    clarityRating,
    punctualityRating,
    overallRating,
    comment,
    platformRating,
    platformSuggestion,
  }) => {
    const avgRating = Number(
      ((teachingRating + clarityRating + punctualityRating + overallRating) / 4).toFixed(1)
    );

    const newReview = {
      id: `v-${Date.now()}`,
      sessionId,
      mentorId,
      studentId: currentUser.id,
      studentName: currentUser.name.split(' ')[0],
      rating: avgRating,
      comment: comment.trim(),
      platformRating,
      platformSuggestion,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    setSessionRequests((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, feedbackGiven: true } : s))
    );

    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          const nextCount = (m.ratingCount || 0) + 1;
          const currentTotal = (m.rating || 0) * (m.ratingCount || 0);
          const newAvg = Number(((currentTotal + avgRating) / nextCount).toFixed(2));
          return {
            ...m,
            rating: newAvg,
            ratingCount: nextCount,
            isNew: false,
          };
        }
        return m;
      })
    );

    const mentorObj = mentors.find((m) => m.id === mentorId);
    if (mentorObj?.userId) {
      addNotification({
        userId: mentorObj.userId,
        title: 'New Student Review Received',
        message: `${currentUser.name.split(' ')[0]} gave you ${avgRating}★ for your recent session!`,
        type: 'feedback_received',
        link: `/mentors/${mentorId}`,
      });
    }

    return newReview;
  };

  const submitMentorFeedback = ({
    sessionId,
    studentExperienceRating,
    studentNote,
    platformRating,
    platformSuggestion,
  }) => {
    const feedback = {
      id: `mf-${Date.now()}`,
      sessionId,
      mentorId: currentUser.id,
      studentExperienceRating,
      studentNote,
      platformRating,
      platformSuggestion,
      createdAt: new Date().toISOString(),
    };
    setMentorFeedbacks((prev) => [...prev, feedback]);
    return feedback;
  };

  const reportMentor = (reportData) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser?.id || 'anonymous-student',
      reporterName: currentUser?.name || 'Student',
      status: 'Open',
      actionTaken: '',
      createdAt: new Date().toISOString(),
      ...reportData,
    };
    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  // Phase 5 Admin Resolve Report
  const resolveReport = (reportId, actionTaken = 'Resolved by admin') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: 'Resolved', actionTaken } : r
      )
    );
  };

  // Phase 5: Query Flagged Messages across all sessions
  const getFlaggedMessages = () => {
    const flagged = [];
    sessionRequests.forEach((sess) => {
      (sess.messages || []).forEach((msg) => {
        if (msg.flagged) {
          flagged.push({
            sessionId: sess.id,
            subject: sess.subject,
            studentName: sess.studentName,
            mentorName: sess.mentorName,
            ...msg,
          });
        }
      });
    });
    return flagged;
  };

  // Phase 5: Automatic Session Flags for Session Log auditing (Spec Section 6.3)
  const getSessionFlags = (sess) => {
    const flags = [];
    // 1. Completed session with no feedback after 3 days
    if (sess.status === 'completed' && !sess.feedbackGiven) {
      const completedTime = new Date(sess.completedAt || sess.confirmedTime || sess.createdAt).getTime();
      const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
      if (Date.now() - completedTime > threeDaysMs) {
        flags.push('No feedback after 3+ days');
      }
    }

    // 2. Mentor with 3+ requests but 0 completed sessions
    const mentorSessions = sessionRequests.filter((s) => s.mentorId === sess.mentorId);
    const mentorCompleted = mentorSessions.filter((s) => s.status === 'completed');
    if (mentorSessions.length >= 3 && mentorCompleted.length === 0) {
      flags.push('Mentor has 3+ requests & 0 completed');
    }

    // 3. Mentor with more than 2 cancellations
    const mentorCancelled = mentorSessions.filter(
      (s) => s.status === 'cancelled' && s.cancelledBy === sess.mentorName
    );
    if (mentorCancelled.length > 2) {
      flags.push('High mentor cancellations (>2)');
    }

    return flags;
  };

  // Phase 5: Community Demand by Subject Computation
  const getDemandBySubject = () => {
    const counts = {};
    sessionRequests.forEach((s) => {
      counts[s.subject] = (counts[s.subject] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([subject, count]) => ({ subject, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Dynamic Statistics
  const stats = {
    totalUsers: users.length,
    approvedMentors: mentors.filter((m) => m.status === 'approved' && !m.suspended).length,
    pendingMentors: mentors.filter((m) => m.status === 'pending').length,
    totalSessions: sessionRequests.filter((s) => s.status === 'completed').length,
    totalVolunteerHours: mentors.reduce((acc, m) => acc + (m.hoursTaught || 0), 0),
    openReports: reports.filter((r) => r.status === 'Open').length,
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        mentors,
        sessionRequests,
        reviews,
        reports,
        notifications,
        mentorFeedbacks,
        stats,
        loginAs,
        logIn,
        signUp,
        logout,
        logOut,
        getApprovedMentors,
        getAllApprovedMentors,
        getMentorById,
        getMentorReviews,
        getMentorSessions,
        getMentorStatusForUser,
        getMentorForUser,
        applyAsMentor,
        resetMentorApplication,
        approveMentor,
        rejectMentor,
        suspendMentor,
        updateAvailability,
        addResource,
        deleteResource,
        getUserSessions,
        createSessionRequest,
        acceptRequest,
        declineRequest,
        rescheduleSession,
        cancelSession,
        completeSession,
        sendMessage,
        submitStudentFeedback,
        submitMentorFeedback,
        reportMentor,
        resolveReport,
        getFlaggedMessages,
        getSessionFlags,
        getDemandBySubject,
        addNotification,
        markNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
