// src/components/NotificationBell.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Calendar, ChatCircle, Star, ArrowRight } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import { formatTimeAgo } from '../lib/utils';

export function NotificationBell() {
  const { currentUser, notifications, markNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const userNotifs = (notifications || []).filter((n) => n.userId === currentUser.id);
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  const handleOpen = () => {
    setOpen(!open);
    if (!open && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  const handleItemClick = (link) => {
    setOpen(false);
    if (link) navigate(link);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'session_accepted':
      case 'session_requested':
      case 'session_rescheduled':
        return <Calendar className="size-4 text-[#E0A030]" weight="regular" />;
      case 'new_message':
        return <ChatCircle className="size-4 text-[#E0A030]" weight="regular" />;
      case 'feedback_due':
      case 'feedback_received':
        return <Star className="size-4 text-[#E0A030]" weight="regular" />;
      default:
        return <Bell className="size-4 text-[#E0A030]" weight="regular" />;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="View notifications"
        className="relative p-2 rounded-[6px] text-[#F7F4EE] border border-[#1F3C6B] bg-[#0A1628] hover:bg-[#1F3C6B] transition-colors cursor-pointer flex items-center justify-center"
      >
        <Bell className="size-4" weight="regular" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#E0A030] text-[#0A1628] text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-88 rounded-[10px] bg-[#0F2240] border border-[#1F3C6B] p-3 shadow-lg text-xs z-50 text-[#F7F4EE]"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#1F3C6B] px-1">
            <div className="flex items-center gap-1.5 font-heading font-semibold text-sm text-[#F7F4EE]">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-[4px] bg-[#E0A030] text-[#0A1628] text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={markNotificationsRead}
              className="text-[11px] text-[#E0A030] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Check className="size-3" weight="bold" />
              <span>Mark read</span>
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#1F3C6B]/50 py-1">
            {userNotifs.length > 0 ? (
              userNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n.link)}
                  className={`p-2.5 rounded-[6px] transition-colors cursor-pointer text-left flex gap-2.5 ${
                    n.read ? 'hover:bg-[#1F3C6B]/40 opacity-70' : 'bg-[#1F3C6B]/30 hover:bg-[#1F3C6B]/60 font-medium'
                  }`}
                >
                  <div className="size-7 rounded-[4px] bg-[#0A1628] border border-[#1F3C6B] flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <p className="font-semibold text-[#F7F4EE] truncate text-[11px]">{n.title}</p>
                    <p className="text-[#9DB8D6] line-clamp-2 text-[10px] leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[#9DB8D6]/60 text-[9px] pt-0.5">{formatTimeAgo(n.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[#9DB8D6] space-y-1">
                <Bell className="size-6 text-[#9DB8D6]/40 mx-auto" weight="regular" />
                <p className="text-xs">No notifications yet</p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#1F3C6B] text-center">
            <button
              type="button"
              onClick={() => handleItemClick('/sessions')}
              className="text-[11px] text-[#E0A030] hover:underline flex items-center justify-center gap-1 w-full py-1 cursor-pointer font-semibold"
            >
              <span>Go to My Sessions</span>
              <ArrowRight className="size-3" weight="regular" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
