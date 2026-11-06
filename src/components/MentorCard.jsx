// src/components/MentorCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { cn, getSubjectName } from '../lib/utils';

export function MentorCard({
  mentor,
  highlightSubject = '',
  className = '',
}) {
  const isNew = mentor.isNew || !mentor.ratingCount;
  const initials = mentor.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  // Deterministic avatar colors
  const avatarColors = ['bg-[#1F3C6B]', 'bg-[#3A6598]', 'bg-[#5E9680]', 'bg-[#A86F10]'];
  const colorIndex = (mentor.name.charCodeAt(0) + mentor.name.length) % avatarColors.length;
  const avatarBg = avatarColors[colorIndex];

  return (
    <div
      className={cn(
        'rounded-[10px] bg-white border border-[#11203A]/20 p-5 flex flex-col justify-between transition-colors hover:border-[#11203A]/50 text-[#11203A]',
        className
      )}
    >
      <div>
        {/* Header: Initials Avatar, Name, Department */}
        <div className="flex items-start gap-3.5 mb-3">
          <div
            className={cn(
              'size-12 rounded-full text-[#F7F4EE] flex items-center justify-center font-bold text-sm shrink-0',
              avatarBg
            )}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading font-semibold text-base text-[#0F2240] truncate">
                {mentor.name}
              </h3>
              {isNew ? (
                <span className="px-2 py-0.5 rounded-[4px] bg-[#E0A030] text-[#0A1628] text-[10px] font-bold uppercase tracking-wider">
                  New
                </span>
              ) : (
                <span className="text-xs text-[#A86F10] font-bold">
                  ★ {mentor.rating.toFixed(1)}
                  <span className="text-[#11203A]/50 font-normal"> ({mentor.ratingCount})</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#11203A]/70 truncate">
              {mentor.department} • Year {mentor.year}
            </p>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-[#11203A]/80 line-clamp-2 leading-relaxed mb-3">
          {mentor.bio}
        </p>

        {/* Subjects list */}
        <div className="text-xs text-[#11203A]/70 mb-4">
          <span className="font-medium text-[#11203A]">Subjects: </span>
          <span>{(mentor.subjects || []).map(getSubjectName).join(', ')}</span>
        </div>
      </div>

      {/* Footer Info: Volunteer Hours + Profile Link */}
      <div className="pt-3 border-t border-[#11203A]/10 flex items-center justify-between text-xs">
        <span className="text-[#11203A]/70">
          <strong className="text-[#0F2240]">{mentor.hoursTaught || 0}</strong> hours taught
        </span>

        <Link
          to={`/mentors/${mentor.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F2240] hover:text-[#3A6598] hover:underline"
        >
          <span>View profile</span>
          <ArrowRight className="size-3.5" weight="bold" />
        </Link>
      </div>
    </div>
  );
}
