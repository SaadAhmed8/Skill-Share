// src/components/SessionCard.jsx
import React from 'react';
import {
  Calendar,
  Clock,
  ChatCircle,
  Copy,
  LockOpen,
} from '@phosphor-icons/react';
import { isStartingSoon } from '../lib/utils';
import { toast } from 'sonner';

export function SessionCard({
  session,
  isMentor = false,
  onOpenThread,
  onAccept,
  onDecline,
  onReschedule,
  onCancel,
  onComplete,
  onFeedback,
}) {
  const isRequested = session.status === 'requested';
  const isAccepted = session.status === 'accepted';
  const isCompleted = session.status === 'completed';
  const isCancelled = session.status === 'cancelled';

  const otherPersonName = isMentor ? session.studentName : session.mentorName;
  const otherPersonEmail = isMentor ? session.studentEmail : session.mentorEmail;
  const otherPersonPhone = isMentor ? session.studentPhone : session.mentorPhone;

  const initials = otherPersonName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const startsSoon = isAccepted && isStartingSoon(session.confirmedTime);

  const copyMeetingLink = (e) => {
    e.stopPropagation();
    if (session.meetingLink) {
      navigator.clipboard.writeText(session.meetingLink);
      toast.success('Meeting link copied to clipboard.');
    }
  };

  return (
    <div className="rounded-[10px] bg-white border border-[#11203A]/20 p-5 space-y-3.5 text-[#11203A]">
      {/* Top Row: Initials Avatar & Name + Status Badge & Starts Soon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-[#1F3C6B] text-[#F7F4EE] flex items-center justify-center font-bold text-xs shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-semibold text-base text-[#0F2240]">{otherPersonName}</h3>
              {session.isGroupSession && (
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#EDE8DD] border border-[#11203A]/10 text-[#0F2240]">
                  Group (3 peers)
                </span>
              )}
            </div>
            <p className="text-xs text-[#11203A]/70">
              Role: <span className="font-semibold text-[#11203A]">{isMentor ? 'Student' : 'Senior Mentor'}</span> • Subject: <strong className="text-[#0F2240]">{session.subject}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {startsSoon && (
            <span className="px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#E0A030] text-[#0A1628] uppercase tracking-wider">
              Starts soon
            </span>
          )}

          {isRequested && (
            <span className="px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#EDE8DD] text-[#0F2240] border border-[#11203A]/15">
              Pending Confirmation
            </span>
          )}
          {isAccepted && (
            <span className="px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#5E9680]/15 text-[#5E9680] border border-[#5E9680]/40">
              Confirmed
            </span>
          )}
          {isCompleted && (
            <span className="px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#EDE8DD] text-[#11203A]/80 border border-[#11203A]/15">
              Completed
            </span>
          )}
          {isCancelled && (
            <span className="px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#B9503A]/15 text-[#B9503A] border border-[#B9503A]/40">
              Cancelled
            </span>
          )}
        </div>
      </div>

      {/* Middle Details: Time / Slot, Duration, Description snippet */}
      <div className="p-3.5 rounded-[6px] bg-[#EDE8DD]/60 border border-[#11203A]/10 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[#11203A]/85">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="size-4 text-[#0F2240]" weight="regular" />
            <span>
              {isAccepted || isCompleted
                ? new Date(session.confirmedTime).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : `Proposed: ${session.preferredSlot}`}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#0F2240] font-semibold">
            <Clock className="size-3.5" weight="regular" />
            <span>{session.durationMinutes} Minutes (Online)</span>
          </div>
        </div>

        <p className="text-[#11203A]/80 line-clamp-2 leading-relaxed italic text-[11px]">
          "{session.description}"
        </p>

        {/* Cancelled reason banner */}
        {isCancelled && session.cancelReason && (
          <div className="p-2.5 rounded-[4px] bg-[#B9503A]/10 border border-[#B9503A]/20 text-[#B9503A] text-[11px] leading-relaxed">
            <strong>Cancelled by {session.cancelledBy || 'User'}:</strong> {session.cancelReason}
          </div>
        )}

        {/* Contact info unlock for confirmed sessions */}
        {(isAccepted || isCompleted) && (
          <div className="pt-2 border-t border-[#11203A]/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#11203A]/80">
            <div className="flex items-center gap-1 text-[#5E9680] font-medium">
              <LockOpen className="size-3.5" weight="regular" />
              <span>Contact: {otherPersonEmail} {otherPersonPhone ? `• ${otherPersonPhone}` : ''}</span>
            </div>

            {session.meetingLink && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyMeetingLink}
                  className="hover:text-[#0F2240] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy link"
                >
                  <Copy className="size-3.5" weight="regular" />
                  <span>Copy Link</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="pt-1 flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => onOpenThread(session)}
          className="px-3.5 py-1.5 rounded-[6px] border border-[#11203A]/20 bg-[#EDE8DD] hover:bg-white text-xs font-semibold text-[#0F2240] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ChatCircle className="size-4" weight="regular" />
          <span>Open Thread</span>
          {session.messages?.length > 1 && (
            <span className="size-4 rounded-full bg-[#0F2240] text-[#F7F4EE] text-[10px] flex items-center justify-center font-bold">
              {session.messages.length}
            </span>
          )}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* PENDING ACTIONS */}
          {isRequested && isMentor && (
            <>
              <button
                type="button"
                onClick={() => onDecline(session)}
                className="px-3.5 py-1.5 rounded-[6px] text-xs font-semibold text-[#B9503A] hover:bg-[#B9503A]/10 transition-colors cursor-pointer"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => onAccept(session)}
                className="px-4 py-1.5 rounded-[6px] bg-[#0F2240] text-[#F7F4EE] hover:bg-[#1F3C6B] text-xs font-semibold cursor-pointer transition-colors"
              >
                Accept &amp; Set Time
              </button>
            </>
          )}

          {isRequested && !isMentor && (
            <button
              type="button"
              onClick={() => onCancel(session)}
              className="px-3.5 py-1.5 rounded-[6px] text-xs font-semibold text-[#B9503A] hover:bg-[#B9503A]/10 transition-colors cursor-pointer"
            >
              Cancel Request
            </button>
          )}

          {/* CONFIRMED ACTIONS */}
          {isAccepted && (
            <>
              <button
                type="button"
                onClick={() => onReschedule(session)}
                className="px-3 py-1.5 rounded-[6px] border border-[#11203A]/20 bg-white hover:bg-[#EDE8DD] text-xs font-medium text-[#11203A] cursor-pointer"
              >
                Reschedule
              </button>

              <button
                type="button"
                onClick={() => onCancel(session)}
                className="px-3 py-1.5 rounded-[6px] text-xs font-medium text-[#B9503A] hover:bg-[#B9503A]/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {session.meetingLink && (
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 rounded-[6px] bg-[#0F2240] text-[#F7F4EE] hover:bg-[#1F3C6B] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Join Meeting
                </a>
              )}

              {isMentor && (
                <button
                  type="button"
                  onClick={() => onComplete(session)}
                  className="px-3.5 py-1.5 rounded-[6px] bg-[#5E9680] hover:bg-[#5E9680]/90 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Mark Completed
                </button>
              )}
            </>
          )}

          {/* COMPLETED ACTIONS */}
          {isCompleted && (
            <>
              {session.feedbackGiven ? (
                <span className="px-3 py-1 rounded-[4px] text-xs font-semibold bg-[#EDE8DD] text-[#5E9680] border border-[#5E9680]/30">
                  Feedback Logged
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onFeedback(session)}
                  className="px-4 py-1.5 rounded-[6px] bg-[#E0A030] text-[#0A1628] hover:bg-[#A86F10] hover:text-[#F7F4EE] text-xs font-semibold cursor-pointer transition-colors"
                >
                  {isMentor ? 'Give Feedback' : 'Leave Feedback'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
