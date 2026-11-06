// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full bg-[var(--ink)] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 text-sm text-[var(--gray-400)]">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-white text-[var(--ink)] flex items-center justify-center font-bold text-sm">
                S
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white">
                  Skill Share
                </span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[var(--green-400)] font-bold">
                  NED
                </span>
              </div>
            </Link>
            <p className="max-w-md text-[var(--gray-400)] leading-relaxed text-xs sm:text-sm">
              A free peer mentoring platform connecting juniors with senior students at NED University of Engineering &amp; Technology for one-on-one subject guidance.
            </p>
            <p className="text-xs text-[var(--green-400)] font-semibold">
              Civics and Community Engagement Course Project
            </p>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-white">Navigation</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/mentors" className="hover:text-[var(--green-400)] transition-colors">
                  Mentors
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-[var(--green-400)] transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/become-a-mentor" className="hover:text-[var(--green-400)] transition-colors">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link to="/sessions" className="hover:text-[var(--green-400)] transition-colors">
                  My Sessions
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Group Credits */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-white">Group Members</h3>
            <ul className="space-y-1.5 text-xs text-[var(--gray-400)]">
              <li className="flex justify-between items-center py-1 border-b border-white/10">
                <span>Saad Ahmed</span>
                <span className="text-[var(--green-400)] font-mono">CT-22089</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-white/10">
                <span>Hasan Shahir</span>
                <span className="text-[var(--green-400)] font-mono">CT-22095</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-white/10">
                <span>Syeda Faiza Aslam</span>
                <span className="text-[var(--green-400)] font-mono">CT-22064</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span>Mahreen</span>
                <span className="text-[var(--green-400)] font-mono">CT-22069</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--gray-400)]">
          <p>© 2026 Skill Share. Free and open to all NED University students.</p>
          <p className="text-white font-medium">NED University of Engineering &amp; Technology</p>
        </div>
      </div>
    </footer>
  );
}
