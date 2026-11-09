// src/components/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  CalendarCheck,
  ChatCircle,
  Star,
  Clock,
  Sparkle,
} from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import { formatTimeAgo } from '../lib/utils';

export function NotificationBell() {
  const { currentUser, notifications, markNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const navigate = useNavigate();

  const bellButtonRef = useRef(null);
  const panelRef = useRef(null);

  const userNotifs = (notifications || []).filter((n) => n.userId === currentUser?.id);
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  // Handle closing on Escape key or outside click, and restore focus to bell
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        bellButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        bellButtonRef.current &&
        !bellButtonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (!currentUser) return null;

  const handleToggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleMarkAllRead = () => {
    markNotificationsRead();
  };

  const handleItemClick = (notif) => {
    // If notif is unread, mark all or this one read
    if (!notif.read) {
      markNotificationsRead();
    }
    setOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const displayedNotifs =
    activeTab === 'unread'
      ? userNotifs.filter((n) => !n.read)
      : userNotifs;

  // Notification Icon based on spec:
  // - mint circle with green-900 icon for normal
  // - black circle with green-400 icon for session confirmed or reminders
  // - snow circle with ink icon for messages
  const renderIconCircle = (type) => {
    switch (type) {
      case 'session_accepted':
      case 'reminder':
      case 'session_confirmed':
        return (
          <div className="size-9 rounded-full bg-[var(--ink)] text-[var(--green-400)] flex items-center justify-center shrink-0">
            <CalendarCheck className="size-4.5" weight="bold" />
          </div>
        );
      case 'new_message':
        return (
          <div className="size-9 rounded-full bg-[var(--snow)] text-[var(--ink)] border border-[var(--line)] flex items-center justify-center shrink-0">
            <ChatCircle className="size-4.5" weight="bold" />
          </div>
        );
      case 'feedback_due':
      case 'feedback_received':
        return (
          <div className="size-9 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center shrink-0">
            <Star className="size-4.5" weight="bold" />
          </div>
        );
      case 'session_requested':
        return (
          <div className="size-9 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center shrink-0">
            <Clock className="size-4.5" weight="bold" />
          </div>
        );
      case 'mentor_approved':
        return (
          <div className="size-9 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center shrink-0">
            <Sparkle className="size-4.5" weight="bold" />
          </div>
        );
      default:
        return (
          <div className="size-9 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center shrink-0">
            <Bell className="size-4.5" weight="bold" />
          </div>
        );
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Bell Trigger:
          - 40px round button, white background, 1px --line border, black bell icon (Phosphor weight "bold").
          - Hover: background changes to --snow only.
          - Focus ring 2px green-600.
          - Aria label: "Notifications, N unread".
          - On a dark navbar context, .band-dark overrides ensure white bell on round --gray-600 border.
      */}
      <button
        ref={bellButtonRef}
        type="button"
        onClick={handleToggleOpen}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
        aria-haspopup="true"
        className="size-10 rounded-full bg-[var(--white)] border border-[var(--line)] hover:bg-[var(--snow)] text-[var(--ink)] flex items-center justify-center cursor-pointer transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green-600)] in-[.band-dark]:bg-black in-[.band-dark]:border-[var(--gray-600)] in-[.band-dark]:text-white in-[.band-dark]:hover:bg-white/10"
      >
        <Bell className="size-5" weight="bold" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-5 rounded-full bg-[var(--green-400)] text-[var(--ink)] font-bold text-[10px] flex items-center justify-center leading-none border border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel:
          - White background, 1px --line border, radius 20px, width 380px (full width minus 16px margin on mobile: w-[calc(100vw-32px)] sm:w-[380px]),
          - max height 70vh with vertical scroll, opens under the bell aligned right.
          - Fade in over 150ms only (dropdown-fade-in respects prefers-reduced-motion).
      */}
      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Notifications list"
          className="dropdown-fade-in absolute right-0 mt-2 w-[calc(100vw-32px)] sm:w-[380px] max-h-[70vh] bg-[var(--white)] border border-[var(--line)] rounded-[20px] shadow-sm flex flex-col z-50 overflow-hidden text-left"
        >
          {/* Header Row: "Notifications" in bold ink text on left, "Mark all as read" text button in green-600 on right (underline on hover). Thin --line rule under */}
          <div className="p-4 pb-3 border-b border-[var(--line)] flex items-center justify-between">
            <h3 className="font-bold text-base text-[var(--ink)]">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-[var(--green-600)] hover:underline cursor-pointer transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Tabs under the header: "All" and "Unread" small pill tabs (black fill with white text when active, white with 1px border when inactive) */}
          <div className="px-4 py-2.5 border-b border-[var(--line)] flex items-center gap-2 bg-white">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[var(--ink)] text-[var(--white)]'
                  : 'bg-[var(--white)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--snow)]'
              }`}
            >
              All ({userNotifs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-[var(--ink)] text-[var(--white)]'
                  : 'bg-[var(--white)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--snow)]'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List (scrollable) */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--line)]">
            {displayedNotifs.length > 0 ? (
              displayedNotifs.map((notif) => {
                const isUnread = !notif.read;
                return (
                  <div
                    key={notif.id}
                    role="menuitem"
                    tabIndex={0}
                    onClick={() => handleItemClick(notif)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleItemClick(notif);
                      }
                    }}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer text-left focus:outline-none focus:bg-[var(--snow)] ${
                      isUnread
                        ? 'bg-[var(--mint)] hover:bg-[var(--snow)]'
                        : 'bg-[var(--white)] hover:bg-[var(--snow)]'
                    }`}
                  >
                    {/* 36px icon circle */}
                    {renderIconCircle(notif.type)}

                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-[15px] text-[var(--ink)] truncate">
                          {notif.title}
                        </p>
                        {isUnread && (
                          <span
                            aria-label="Unread"
                            className="size-2 rounded-full bg-[var(--green-600)] shrink-0"
                          />
                        )}
                      </div>
                      <p className="text-[14px] text-[var(--gray-600)] truncate mt-0.5 leading-snug">
                        {notif.message}
                      </p>
                      <p className="text-[12px] text-[var(--gray-600)] mt-1">
                        {formatTimeAgo(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty state: one plain sentence "You are all caught up." in --gray-600 and nothing else, no illustration */
              <div className="py-10 px-4 text-center">
                <p className="text-sm text-[var(--gray-600)]">
                  You are all caught up.
                </p>
              </div>
            )}
          </div>

          {/* Footer: full width text link "View my sessions" in green-600 under a --line rule */}
          <div className="p-3 border-t border-[var(--line)] text-center bg-white">
            <Link
              to="/sessions"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[var(--green-600)] hover:underline inline-block w-full py-1 cursor-pointer transition-colors"
            >
              View my sessions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
