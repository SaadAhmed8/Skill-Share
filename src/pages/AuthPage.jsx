// src/pages/AuthPage.jsx
import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { SectionWrapper } from '../components/SectionWrapper';
import { AuthCard } from '../components/AuthCard';
import { useApp } from '../context/AppContext';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const { currentUser } = useApp();

  // If user specifically opened ?tab=mentor, redirect cleanly to /become-a-mentor
  if (searchParams.get('tab') === 'mentor') {
    return <Navigate to="/become-a-mentor" replace />;
  }

  // If already logged in, redirect away
  if (currentUser) {
    if (currentUser.role === 'admin' || currentUser.role === 'mentor') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/mentors" replace />;
  }

  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';

  return (
    <div className="w-full">
      <SectionWrapper variant="light" containerClassName="py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Form Panel */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto">
            <AuthCard initialTab={initialTab} />
          </div>

          {/* Right Column: "Why Join" Plain Text List */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--green-600)] block mb-2">
                NED Campus Community
              </span>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight page-header-anim">
                Peer learning made simple and official.
              </h1>
              <p className="text-sm text-[var(--gray-600)] mt-2 leading-relaxed">
                Skill Share connects junior students with experienced seniors for free, 1-on-1 academic guidance right here on campus.
              </p>
            </div>

            <div className="divide-y divide-[var(--line)] border-y border-[var(--line)] py-2">
              <div className="py-3.5">
                <h3 className="font-bold text-sm text-[var(--ink)]">100% Free For All Students</h3>
                <p className="text-xs text-[var(--gray-600)] mt-1 leading-relaxed">
                  Every session is completely volunteer-based. Commercial tutoring fees and external monetization are strictly barred.
                </p>
              </div>

              <div className="py-3.5">
                <h3 className="font-bold text-sm text-[var(--ink)]">Verified NED Community</h3>
                <p className="text-xs text-[var(--gray-600)] mt-1 leading-relaxed">
                  Registration requires a valid @neduet.edu.pk email. You interact exclusively with genuine university peers and seniors.
                </p>
              </div>

              <div className="py-3.5">
                <h3 className="font-bold text-sm text-[var(--ink)]">Feedback-Driven Ranking</h3>
                <p className="text-xs text-[var(--gray-600)] mt-1 leading-relaxed">
                  Mentors earn priority ranking through verified student reviews and punctuality, not vanity metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
