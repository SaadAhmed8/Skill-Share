// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CaretDown,
  SignOut,
  SquaresFour,
  CalendarCheck,
  List,
  X,
} from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import { NotificationBell } from './NotificationBell';
import { Logo } from './Logo';
import { cn } from '../lib/utils';

export function Navbar() {
  const { currentUser, logout, loginAs, users, getMentorStatusForUser } = useApp();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // If user is approved mentor, hide "Become a Mentor"
  const isApprovedMentor = currentUser?.role === 'mentor';
  const mentorStatus = currentUser ? getMentorStatusForUser(currentUser.id) : null;

  // Logged-in links: Home, Mentors, How it works, Become a Mentor (if not approved mentor), My Sessions
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Mentors', href: '/mentors' },
    { name: 'How it works', href: '/#how-it-works' },
    ...(!isApprovedMentor ? [{ name: 'Become a Mentor', href: '/become-a-mentor' }] : []),
    { name: 'My Sessions', href: '/sessions' },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/' && !location.hash;
    if (href === '/#how-it-works') return location.hash === '#how-it-works';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--white)] border-b border-[var(--line)] text-[var(--ink)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand: round black circle with white 'S' + wordmark 'Skill Share' + small 'NED' */}
        <Link to="/" className="group text-left">
          <Logo />
        </Link>

        {/* When Logged Out: NO page links. Only Log in link and Sign up outlined pill on right */}
        {!currentUser ? (
          <div className="flex items-center gap-4">
            <Link
              to="/auth?tab=login"
              className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--green-600)] transition-colors px-2 py-1"
            >
              Log in
            </Link>
            <Link
              to="/auth?tab=signup"
              className="px-5 py-2 rounded-full border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--white)] text-sm font-semibold transition-colors"
            >
              Sign up
            </Link>
          </div>
        ) : (
          /* When Logged In: Desktop Nav Links */
          <>
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full transition-colors font-medium',
                    isActive(link.href)
                      ? 'text-[var(--white)] bg-[var(--ink)]'
                      : 'text-[var(--gray-600)] hover:text-[var(--ink)] hover:bg-[var(--snow)]'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <NotificationBell />

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--white)] hover:bg-[var(--snow)] text-xs sm:text-sm font-medium text-[var(--ink)] cursor-pointer transition-colors"
                >
                  <div className="size-7 rounded-full bg-[var(--ink)] flex items-center justify-center text-xs font-bold text-[var(--white)]">
                    {currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="flex flex-col items-start text-left leading-tight">
                    <span className="font-semibold text-[var(--ink)] max-w-[110px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-[var(--green-600)] uppercase font-bold tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <CaretDown className="size-3 text-[var(--gray-600)]" weight="bold" />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-[20px] bg-[var(--white)] border border-[var(--line)] p-2 shadow-xl text-xs z-50 text-[var(--ink)]"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[var(--line)] mb-1">
                      <p className="font-semibold text-[var(--ink)] text-sm truncate">{currentUser.name}</p>
                      <p className="text-[var(--gray-600)] truncate text-[11px]">{currentUser.email}</p>
                      {/* One plain text line with status */}
                      {mentorStatus && (
                        <p className="mt-1 text-[11px] text-[var(--green-600)] font-medium">
                          Mentor application: {mentorStatus.charAt(0).toUpperCase() + mentorStatus.slice(1)}
                        </p>
                      )}
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-full text-[var(--ink)] hover:bg-[var(--snow)] transition-colors"
                    >
                      <div className="size-6 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center">
                        <SquaresFour className="size-3.5" weight="bold" />
                      </div>
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/sessions"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-full text-[var(--ink)] hover:bg-[var(--snow)] transition-colors"
                    >
                      <div className="size-6 rounded-full bg-[var(--snow)] text-[var(--ink)] flex items-center justify-center">
                        <CalendarCheck className="size-3.5" weight="bold" />
                      </div>
                      <span>My Sessions</span>
                    </Link>

                    <div className="border-t border-[var(--line)] my-1 pt-1">
                      <div className="px-3 py-1 text-[10px] text-[var(--gray-600)] uppercase font-bold">
                        Switch Demo Role
                      </div>
                      {users.slice(0, 3).map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            loginAs(u.id);
                            setProfileOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-1.5 rounded-full text-left transition-colors cursor-pointer',
                            currentUser.id === u.id
                              ? 'bg-[var(--ink)] text-[var(--white)] font-semibold'
                              : 'text-[var(--gray-600)] hover:bg-[var(--snow)] hover:text-[var(--ink)]'
                          )}
                        >
                          <span className="truncate">{u.name}</span>
                          <span className="text-[10px] uppercase opacity-75">{u.role}</span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-[var(--line)] mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-[var(--error)] hover:bg-[var(--snow)] transition-colors cursor-pointer"
                      >
                        <SignOut className="size-4" weight="bold" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center gap-2">
              <NotificationBell />
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center size-11 rounded-full border border-[var(--line)] text-[var(--ink)] bg-[var(--white)] cursor-pointer"
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X className="size-6" weight="bold" /> : <List className="size-6" weight="bold" />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Drawer (When Logged In) */}
      {menuOpen && currentUser && (
        <div className="md:hidden border-t border-[var(--line)] bg-[var(--white)] px-4 py-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-full text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-[var(--white)] bg-[var(--ink)]'
                    : 'text-[var(--gray-600)] hover:text-[var(--ink)] hover:bg-[var(--snow)]'
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-[var(--line)] pt-3 mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-3 px-3 py-2 bg-[var(--snow)] rounded-[14px]">
                <div className="size-8 rounded-full bg-[var(--ink)] flex items-center justify-center font-bold text-sm text-[var(--white)]">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-[var(--ink)] text-sm">{currentUser.name}</p>
                  <p className="text-xs text-[var(--green-600)] uppercase font-bold">{currentUser.role}</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--ink)] text-[var(--white)] text-sm font-medium"
              >
                <SquaresFour className="size-4" weight="bold" />
                <span>Go to Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-full text-[var(--error)] text-sm font-medium"
              >
                <SignOut className="size-4" weight="bold" />
                <span>Log out</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
