// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export function Footer() {
  const { getPlatformFeedbackStats } = useApp();
  const pfStats = getPlatformFeedbackStats ? getPlatformFeedbackStats() : { rating: 4.8, count: 13 };

  return (
    <footer className="w-full bg-[var(--ink)] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 text-sm text-[var(--gray-400)]">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block group text-left">
              <Logo
                className="[&_span]:text-white [&_circle]:fill-white [&_text]:fill-[var(--ink)] [&_span:last-child]:text-[var(--green-400)]"
              />
            </Link>
            <p className="max-w-md text-[var(--gray-400)] leading-relaxed text-xs sm:text-sm">
              A free peer mentoring platform connecting juniors with senior students at NED University of Engineering &amp; Technology for one-on-one subject guidance.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-[var(--green-400)] font-semibold">
                Civics and Community Engagement Course Project
              </span>
              <span className="text-white/30">•</span>
              <span className="text-xs text-white/80 font-medium">
                Platform rating {pfStats.rating.toFixed(1)} from {pfStats.count} reviews
              </span>
            </div>
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
                <span className="text-[var(--green-400)] font-mono">CT-25089</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-white/10">
                <span>Hasan Shahir</span>
                <span className="text-[var(--green-400)] font-mono">CT-25095</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-white/10">
                <span>Syeda Faiza Aslam</span>
                <span className="text-[var(--green-400)] font-mono">CT-25064</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span>Mahreen</span>
                <span className="text-[var(--green-400)] font-mono">CT-25069</span>
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
