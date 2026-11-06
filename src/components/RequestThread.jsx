// src/components/RequestThread.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
} from './ui/dialog';
import {
  PaperPlaneRight,
  ShieldCheck,
  Warning,
  Clock,
  VideoCamera,
  Lock,
  LockOpen,
  Flag,
} from '@phosphor-icons/react';
import { ReportMentorDialog } from './ReportMentorDialog';
import { useApp } from '../context/AppContext';
import { SENSITIVE_KEYWORDS } from '../lib/validators';

export function RequestThread({
  session,
  isMentor = false,
  open,
  onOpenChange,
  onAcceptClick,
}) {
  const { currentUser, sendMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      setTimeout(scrollToBottom, 100);
    }
  }, [open, session?.messages]);

  if (!session) return null;

  const otherPersonName = isMentor ? session.studentName : session.mentorName;
  const otherPersonEmail = isMentor ? session.studentEmail : session.mentorEmail;
  const otherPersonPhone = isMentor ? session.studentPhone : session.mentorPhone;

  const isConfirmed = session.status === 'accepted';
  const isCompleted = session.status === 'completed';
  const isCancelled = session.status === 'cancelled';
  const isRequested = session.status === 'requested';

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    const hasSensitive = SENSITIVE_KEYWORDS.some((kw) =>
      val.toLowerCase().includes(kw)
    );
    setShowWarning(hasSensitive);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    sendMessage(session.id, {
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText.trim(),
    });

    setInputText('');
    setShowWarning(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-[var(--line)] text-[var(--ink)] max-h-[90vh] flex flex-col p-0 rounded-[28px] overflow-hidden shadow-none">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[var(--line)] flex items-center justify-between bg-[var(--snow)]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {otherPersonName.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[var(--ink)]">{otherPersonName}</h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white border border-[var(--line)] text-[var(--gray-600)] font-bold uppercase">
                  {isMentor ? 'Student Learner' : 'Senior Mentor'}
                </span>
              </div>
              <p className="text-xs text-[var(--gray-600)]">
                Subject: <strong className="text-[var(--ink)]">{session.subject}</strong> ({session.durationMinutes} mins)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-6">
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="p-2 rounded-full text-[var(--gray-600)] hover:text-[var(--error)] border border-[var(--line)] hover:bg-white transition-colors cursor-pointer"
              title="Report conversation to admin"
            >
              <Flag className="size-4" weight="bold" />
            </button>
          </div>
        </div>

        {/* Pinned Original Request Banner */}
        <div className="p-3.5 bg-white border-b border-[var(--line)] text-xs text-[var(--ink)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="font-bold text-[var(--ink)] flex items-center gap-1.5">
              <Clock className="size-3.5 text-[var(--green-600)]" weight="bold" />
              <span>Requested Slot: {session.preferredSlot}</span>
            </p>
            <p className="text-[11px] text-[var(--gray-600)] italic line-clamp-2">
              "{session.description}"
            </p>
          </div>

          {isMentor && isRequested && onAcceptClick && (
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onAcceptClick(session);
              }}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--ink)] text-white hover:bg-[var(--green-900)] transition-colors shrink-0 cursor-pointer"
            >
              Accept and Set Time
            </button>
          )}
        </div>

        {/* Contact Unlock Status Strip */}
        <div className="px-4 py-2 bg-[var(--snow)] border-b border-[var(--line)] flex items-center justify-between text-[11px]">
          {isConfirmed || isCompleted ? (
            <div className="flex items-center gap-2 text-[var(--green-600)] font-semibold">
              <LockOpen className="size-3.5" weight="bold" />
              <span>
                Contact Unlocked: <strong className="text-[var(--ink)]">{otherPersonEmail}</strong>
                {otherPersonPhone && <span> • {otherPersonPhone}</span>}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[var(--gray-600)]">
              <Lock className="size-3.5 text-[var(--ink)]" weight="bold" />
              <span>Personal contact details stay hidden until the session is confirmed.</span>
            </div>
          )}

          {session.meetingLink && (
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--green-600)] font-bold hover:underline flex items-center gap-1"
            >
              <VideoCamera className="size-3.5" weight="bold" />
              <span>Open Meeting</span>
            </a>
          )}
        </div>

        {/* Scrollable Message History Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 max-h-[50vh]">
          {session.messages && session.messages.length > 0 ? (
            session.messages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="text-center my-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-[var(--snow)] border border-[var(--line)] text-[11px] text-[var(--gray-600)] leading-relaxed max-w-md">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-[20px] p-3 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[var(--ink)] text-white'
                        : 'bg-[var(--snow)] text-[var(--ink)] border border-[var(--line)]'
                    }`}
                  >
                    <p className="font-bold text-[10px] mb-1 opacity-70">
                      {isMe ? 'You' : msg.senderName}
                    </p>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.flagged && (
                      <div className="mt-1.5 pt-1.5 border-t border-[var(--line)] flex items-center gap-1 text-[10px] text-[var(--error)] font-bold">
                        <ShieldCheck className="size-3" weight="bold" />
                        <span>Off-platform communication flag</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[var(--gray-400)] mt-1 px-2">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-[var(--gray-400)] space-y-1">
              <Clock className="size-6 opacity-40 mx-auto" weight="bold" />
              <p className="text-xs">No chat messages yet.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sensitive Keyword Warning Banner */}
        {showWarning && (
          <div className="p-2.5 bg-red-50 border-t border-red-200 text-xs text-[var(--error)] flex items-center gap-2 px-4 font-semibold">
            <Warning className="size-4 shrink-0" weight="bold" />
            <span className="text-[11px] leading-snug">
              Keep communication on Skill Share. Contact details unlock automatically after confirmation.
            </span>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[var(--snow)] border-t border-[var(--line)]">
          {isCompleted || isCancelled ? (
            <div className="p-3 text-center rounded-[14px] bg-white border border-[var(--line)] text-xs text-[var(--gray-600)]">
              This session is {session.status}. The request thread is now archived for reference.
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <textarea
                rows={1}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message (Shift+Enter for newline)..."
                className="flex-1 bg-white border border-[var(--line)] focus:border-[var(--ink)] rounded-[14px] px-3.5 py-2 text-xs text-[var(--ink)] outline-none resize-none leading-normal placeholder:text-[var(--gray-400)]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 transition-colors"
                aria-label="Send message"
              >
                <PaperPlaneRight weight="fill" className="size-4" />
              </button>
            </form>
          )}
        </div>

        <ReportMentorDialog
          mentor={{ id: session.mentorId, name: session.mentorName }}
          open={reportOpen}
          onOpenChange={setReportOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
