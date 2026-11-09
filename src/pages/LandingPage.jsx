// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CaretDown,
  MagnifyingGlass,
  Check,
  Star,
  Clock,
  ShieldCheck,
  CalendarCheck,
  GraduationCap,
  Users,
  Certificate,
  ChatCircleText,
  X,
} from '@phosphor-icons/react';
import { SectionWrapper } from '../components/SectionWrapper';
import { GlowSearchBar } from '../components/GlowSearchBar';
import { AuthCard } from '../components/AuthCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { useApp } from '../context/AppContext';
import { featuredSubjects } from '../data/mockData';
import { getSubjectName, getSubjectId } from '../lib/utils';
import { getMentorStats } from '../lib/mentorStats';
import { rankMentors } from '../lib/ranking';

// Visual Strip / Tiles
function TileStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Black Tile: Mentor mini card */}
      <div className="bg-[var(--ink)] text-white p-5 rounded-[28px] flex flex-col justify-between min-h-[170px]">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center font-bold text-xs shrink-0">
            MA
          </div>
          <div>
            <p className="font-semibold text-sm text-white">Muhammad Ali</p>
            <p className="text-xs text-[var(--gray-400)]">CS • Data Structures</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[var(--gray-600)]/40 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--green-400)] font-bold">
            <div className="size-6 rounded-full bg-black flex items-center justify-center">
              <Star className="size-3.5" weight="fill" />
            </div>
            <span>4.9 (18 reviews)</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--green-900)] text-white font-medium">Top Mentor</span>
        </div>
      </div>

      {/* 2. Mint Tile: Slot picker */}
      <div className="bg-[var(--mint)] text-[var(--ink)] p-5 rounded-[28px] flex flex-col justify-between min-h-[170px]">
        <div>
          <p className="text-xs font-bold text-[var(--green-900)] uppercase tracking-wider mb-2">Available Slots</p>
          <div className="flex flex-col gap-1.5">
            <div className="px-3 py-1.5 rounded-full bg-white border border-[var(--line)] text-xs font-semibold flex items-center justify-between shadow-none">
              <span>Mon 6:00 PM</span>
              <span className="size-2 rounded-full bg-[var(--green-600)]"></span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-[var(--green-900)] text-white text-xs font-semibold flex items-center justify-between shadow-none">
              <span>Wed 7:00 PM</span>
              <Check className="size-3.5 text-[var(--green-400)]" weight="bold" />
            </div>
          </div>
        </div>
        <p className="text-[11px] text-[var(--gray-600)] mt-2 font-medium">1-on-1 • 60 mins • Free</p>
      </div>

      {/* 3. White Tile with 1px border: Session confirmed notice */}
      <div className="bg-white border border-[var(--line)] p-5 rounded-[28px] flex flex-col justify-between min-h-[170px]">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center shrink-0">
            <CalendarCheck className="size-5" weight="bold" />
          </div>
          <div>
            <p className="font-semibold text-sm text-[var(--ink)]">Session Confirmed</p>
            <p className="text-xs text-[var(--gray-600)]">Linear Algebra with Sarah</p>
          </div>
        </div>
        <div className="p-2.5 rounded-[14px] bg-[var(--snow)] text-xs text-[var(--ink)] flex items-center justify-between">
          <span>Tomorrow at 5:00 PM</span>
          <span className="font-semibold text-[var(--green-600)]">Google Meet</span>
        </div>
      </div>

      {/* 4. Green-900 Tile: Rating & Guarantee */}
      <div className="bg-[var(--green-900)] text-white p-5 rounded-[28px] flex flex-col justify-between min-h-[170px]">
        <div>
          <div className="size-10 rounded-full bg-black text-[var(--green-400)] flex items-center justify-center shrink-0 mb-3">
            <ShieldCheck className="size-5" weight="bold" />
          </div>
          <p className="font-bold text-sm text-white leading-snug">Always know who can help you.</p>
          <p className="text-xs text-[var(--green-400)] mt-1">Verified NED Seniors only</p>
        </div>
        <div className="text-[11px] text-white/80 pt-2 border-t border-white/20">
          Zero cost • Community powered
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const {
    currentUser,
    mentors,
    reviews,
    sessionRequests,
    stats,
    platformFeedback,
    getPlatformFeedbackStats,
  } = useApp();
  const [openFaq, setOpenFaq] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const navigate = useNavigate();

  const feedbackStats = getPlatformFeedbackStats ? getPlatformFeedbackStats() : { rating: 4.8, count: 13 };
  const allFeedback = platformFeedback || [];
  const previewFeedback = allFeedback.slice(0, 4);

  // Distribution for dialog
  const feedbackDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  allFeedback.forEach((f) => {
    const star = Math.round(Number(f.rating) || 5);
    if (feedbackDistribution[star] !== undefined) feedbackDistribution[star]++;
  });

  // Top mentors for preview (top 4 approved and not suspended, ranked by feedback, preferring mentors with > 0 reviews)
  const approvedAndActive = mentors.filter((m) => m.status === 'approved' && !m.suspended);
  const withReviews = approvedAndActive.filter(
    (m) => getMentorStats(m, reviews, sessionRequests).reviewCount > 0
  );
  const withoutReviews = approvedAndActive.filter(
    (m) => getMentorStats(m, reviews, sessionRequests).reviewCount === 0
  );
  const rankedWithReviews = rankMentors(withReviews, 'best_match', reviews, sessionRequests);
  const rankedWithoutReviews = rankMentors(withoutReviews, 'best_match', reviews, sessionRequests);
  const topMentors = [...rankedWithReviews, ...rankedWithoutReviews].slice(0, 4);

  // FAQ items
  const faqs = [
    {
      q: 'What is Skill Share?',
      a: 'Skill Share is a peer mentoring platform at NED University of Engineering & Technology. It connects junior students with experienced seniors for free, 1-on-1 academic guidance.',
    },
    {
      q: 'Are mentoring sessions completely free?',
      a: 'Yes, Skill Share is 100% free. Mentors volunteer their time to give back to the NED community, and hours count toward community engagement certificates.',
    },
    {
      q: 'How do I sign up for an account?',
      a: 'Sign up requires a valid NED student email ending in @neduet.edu.pk. Select whether you are a junior seeking guidance or applying as a senior mentor.',
    },
    {
      q: 'How does mentor ranking work?',
      a: 'Mentor ranking is driven primarily by student feedback and session reliability, not just GPA. New mentors receive a fair boost to help them schedule their first sessions.',
    },
    {
      q: 'How long are the mentoring sessions?',
      a: 'Sessions are 1-on-1 and conducted online. The standard duration is 1 hour (minimum 60 minutes). Group sessions can also be arranged with up to 3 peers.',
    },
    {
      q: 'Who is eligible to apply as a mentor?',
      a: 'Senior NED students with a minimum CGPA of 3.0 can apply. You will select your strong subjects, upload an unofficial transcript verification, and accept the code of conduct.',
    },
  ];

  // -------------------------------------------------------------
  // 1. LOGGED-OUT ENTRY SCREEN
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="w-full bg-[var(--white)] min-h-[calc(100vh-80px)] flex flex-col justify-between py-8 sm:py-12 entry-screen-fade">
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Split Hero: Left headline, Right AuthCard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--gray-600)] mb-4">
                NED University of Engineering &amp; Technology
              </span>

              <h1 className="font-bold text-[clamp(40px,7vw,84px)] text-[var(--ink)] leading-[1.02] tracking-[-0.03em] mb-6">
                Learn from seniors who've been there.
              </h1>

              <p className="text-[var(--gray-600)] text-lg sm:text-xl leading-relaxed max-w-xl">
                Free 1-on-1 peer mentoring across engineering departments. Connect with high-achieving seniors for coursework, lab prep, and exam guidance.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
              <AuthCard initialTab="signin" />
            </div>
          </div>

          {/* Visual Strip Below */}
          <div className="mt-8">
            <p className="text-xs uppercase tracking-wider font-bold text-[var(--gray-600)] mb-4">
              Inside Skill Share
            </p>
            <TileStrip />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. LOGGED-IN HOME
  // -------------------------------------------------------------
  return (
    <div className="flex flex-col w-full bg-[var(--white)] home-screen-fade">
      {/* 1. TILE HERO (White band) */}
      <SectionWrapper variant="light" id="hero" containerClassName="pt-12 sm:pt-16 pb-14 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--gray-600)] mb-4">
            NED University of Engineering &amp; Technology
          </span>

          <h1 className="font-bold text-[clamp(44px,8vw,96px)] text-[var(--ink)] leading-[1.02] tracking-[-0.03em] mb-6 text-center">
            Learn from seniors who've been there.
          </h1>

          <p className="text-[var(--gray-600)] text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl text-center">
            Connect 1-on-1 with verified NED seniors for patient explanations in engineering fundamentals, programming, calculus, and circuit analysis.
          </p>

          <div className="w-full max-w-2xl mb-12">
            <GlowSearchBar placeholder="Search a subject: Programming, Calculus, Circuits..." />
          </div>

          <TileStrip />
        </div>
      </SectionWrapper>

      {/* 2. HOW IT WORKS (Black band, id how-it-works) */}
      <SectionWrapper variant="dark" id="how-it-works" containerClassName="py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-400)]">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-3">
            How it works
          </h2>
          <p className="text-[var(--gray-400)] text-base">
            No booking fees, no complex forms. Just direct peer support within NED.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: 1,
              title: 'Find a Mentor',
              desc: 'Browse verified NED seniors by department, subject expertise, and ratings.',
              icon: GraduationCap,
            },
            {
              num: 2,
              title: 'Pick a Time',
              desc: 'Select an available 1-hour slot that fits your lecture schedule.',
              icon: Clock,
            },
            {
              num: 3,
              title: 'Meet 1-on-1',
              desc: 'Connect online via Google Meet for patient, focused academic guidance.',
              icon: Users,
            },
            {
              num: 4,
              title: 'Rate & Certify',
              desc: 'Leave honest feedback. Mentors earn community service hours and certificates.',
              icon: Certificate,
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#141414] border border-[var(--gray-600)]/30 rounded-[28px] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="size-8 rounded-full bg-[var(--green-400)] text-[var(--ink)] font-bold text-sm flex items-center justify-center">
                      {step.num}
                    </span>
                    <div className="size-10 rounded-full bg-black text-[var(--green-400)] flex items-center justify-center">
                      <Icon className="size-5" weight="bold" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--gray-400)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* 3. SUBJECTS (White band, outlined pills) */}
      <SectionWrapper variant="light" id="subjects" containerClassName="py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-600)]">
            Explore Topics
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--ink)] mt-2 mb-3">
            Popular NED Subjects
          </h2>
          <p className="text-[var(--gray-600)] text-sm">
            Select a subject to discover active senior mentors ready to assist you.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
          {featuredSubjects.map((sub) => {
            const name = getSubjectName(sub);
            const id = getSubjectId(sub);
            return (
              <Link
                key={id || name}
                to={`/mentors?q=${encodeURIComponent(name)}`}
                className="px-5 py-2.5 rounded-full border border-[var(--line)] bg-white text-sm font-semibold text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--snow)] transition-colors"
              >
                {name}
              </Link>
            );
          })}
        </div>
      </SectionWrapper>

      {/* 4. TOP MENTORS (Snow band, 4 rows) */}
      <SectionWrapper variant="light-alt" id="top-mentors" containerClassName="py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-600)]">
              Senior Leaders
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--ink)] mt-1">
              Top Rated Mentors
            </h2>
          </div>
          <Link
            to="/mentors"
            className="px-5 py-2 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] text-sm font-semibold transition-colors flex items-center gap-2 w-fit"
          >
            <span>View all mentors</span>
            <ArrowRight className="size-4" weight="bold" />
          </Link>
        </div>

        <div className="bg-white border border-[var(--line)] rounded-[28px] overflow-hidden">
          <div className="divide-y divide-[var(--line)]">
            {topMentors.map((m) => {
              const initials = m.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);
              const mStats = getMentorStats(m, reviews, sessionRequests);
              const hasReviews = mStats.reviewCount > 0 && mStats.rating !== null;
              return (
                <div
                  key={m.id}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--snow)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[var(--ink)]">{m.name}</h4>
                      <p className="text-xs text-[var(--gray-600)]">{m.department}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {m.subjects.slice(0, 3).map((s) => {
                          const sName = getSubjectName(s);
                          return (
                            <span
                              key={sName}
                              className="text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--line)] bg-[var(--snow)] text-[var(--gray-600)] font-medium"
                            >
                              {sName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--line)]">
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-[var(--ink)]">
                        <div className="size-7 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center">
                          <Star className="size-3.5" weight="fill" />
                        </div>
                        {hasReviews ? (
                          <span>
                            {mStats.rating.toFixed(1)} ({mStats.reviewCount})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--mint)] text-[var(--green-900)] text-[10px] font-bold uppercase tracking-wider">
                            New Mentor
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--gray-600)]">
                        <div className="size-7 rounded-full bg-[var(--snow)] text-[var(--ink)] flex items-center justify-center">
                          <Clock className="size-3.5" weight="bold" />
                        </div>
                        <span>{mStats.hoursTaught} hrs</span>
                      </div>
                    </div>

                    <Link
                      to={`/mentors/${m.id}`}
                      className="px-5 py-2.5 rounded-full bg-[var(--ink)] text-white hover:bg-[var(--green-900)] text-xs font-semibold transition-colors"
                    >
                      View profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* 5. IMPACT NUMBERS (Green-900 band, white text) */}
      <SectionWrapper variant="green" id="impact" containerClassName="py-20 text-white">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-400)]">
            Verified Community Stats
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
            Real impact at NED University
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Active Mentors', val: mentors.length || 24 },
            { label: 'Sessions Completed', val: stats?.completedSessions || 142 },
            { label: 'Mentoring Hours', val: stats?.totalHours || 280 },
            { label: 'Satisfaction Rate', val: '98%' },
          ].map((item, idx) => (
            <div key={idx} className="bg-black/20 border border-white/10 rounded-[28px] p-6">
              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--green-400)] mb-1">
                {item.val}
              </div>
              <div className="text-xs sm:text-sm text-white/80 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 6. SAFETY AND FAIRNESS (White, 4 items with round icons in mixed tile sizes) */}
      <SectionWrapper variant="light" id="safety" containerClassName="py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-600)]">
            Built on Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] mt-2">
            Safety, verification, and fairness
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Tile 1: 7 cols */}
          <div className="md:col-span-7 bg-[var(--snow)] border border-[var(--line)] rounded-[28px] p-8 flex flex-col justify-between">
            <div className="size-10 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center mb-6">
              <ShieldCheck className="size-5" weight="bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)] mb-2">NED Email Verification</h3>
              <p className="text-sm text-[var(--gray-600)] leading-relaxed">
                Every student and mentor authenticates strictly with their official @neduet.edu.pk credentials. Unofficial or guest accounts are rejected.
              </p>
            </div>
          </div>

          {/* Tile 2: 5 cols */}
          <div className="md:col-span-5 bg-[var(--mint)] rounded-[28px] p-8 flex flex-col justify-between">
            <div className="size-10 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center mb-6">
              <Certificate className="size-5" weight="bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)] mb-2">Transcript Audited</h3>
              <p className="text-sm text-[var(--gray-600)] leading-relaxed">
                Mentors submit unofficial transcripts to verify a 3.0+ CGPA and strong subject grades before approval.
              </p>
            </div>
          </div>

          {/* Tile 3: 5 cols */}
          <div className="md:col-span-5 bg-white border border-[var(--line)] rounded-[28px] p-8 flex flex-col justify-between">
            <div className="size-10 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center mb-6">
              <Users className="size-5" weight="bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)] mb-2">Fair Boost Algorithm</h3>
              <p className="text-sm text-[var(--gray-600)] leading-relaxed">
                New mentors receive an equal rotation boost so juniors discover diverse seniors across all batches.
              </p>
            </div>
          </div>

          {/* Tile 4: 7 cols */}
          <div className="md:col-span-7 bg-[var(--ink)] text-white rounded-[28px] p-8 flex flex-col justify-between">
            <div className="size-10 rounded-full bg-black text-[var(--green-400)] flex items-center justify-center mb-6">
              <Check className="size-5" weight="bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Clear Code of Conduct</h3>
              <p className="text-sm text-[var(--gray-400)] leading-relaxed">
                Zero tolerance for harassment or assignment completion. Sessions focus on understanding and peer problem solving.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 6.5. PLATFORM FEEDBACK (Light-alt band, What students and mentors say) */}
      <SectionWrapper variant="light-alt" id="platform-feedback" containerClassName="py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-600)] block mb-1">
              Community Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
              What students and mentors say
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end text-sm font-bold text-[var(--ink)]">
                <Star className="size-4 text-[var(--green-600)]" weight="fill" />
                <span>{feedbackStats.rating.toFixed(1)} / 5.0</span>
              </div>
              <p className="text-xs text-[var(--gray-600)]">
                Based on {feedbackStats.count} community reviews
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackDialogOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[var(--ink)] hover:bg-[var(--green-900)] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              See all feedback
            </button>
          </div>
        </div>

        {/* Mixed-size tile layout for 4 testimonials: (7 cols + 5 cols) on top, (5 cols + 7 cols) below */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {previewFeedback[0] && (
            <div className="md:col-span-7 bg-white border border-[var(--line)] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed italic">
                "{previewFeedback[0].comment}"
              </p>
              <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[var(--ink)]">{previewFeedback[0].name}</p>
                  <p className="text-[var(--gray-600)]">
                    {previewFeedback[0].role} • {previewFeedback[0].department} (Year {previewFeedback[0].year})
                  </p>
                </div>
                <span className="font-bold text-[var(--green-600)]">★ {previewFeedback[0].rating}.0</span>
              </div>
            </div>
          )}

          {previewFeedback[1] && (
            <div className="md:col-span-5 bg-[var(--mint)] border border-transparent rounded-[28px] p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed italic">
                "{previewFeedback[1].comment}"
              </p>
              <div className="pt-4 border-t border-[var(--green-900)]/20 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[var(--ink)]">{previewFeedback[1].name}</p>
                  <p className="text-[var(--gray-600)]">
                    {previewFeedback[1].role} • {previewFeedback[1].department}
                  </p>
                </div>
                <span className="font-bold text-[var(--green-900)]">★ {previewFeedback[1].rating}.0</span>
              </div>
            </div>
          )}

          {previewFeedback[2] && (
            <div className="md:col-span-5 bg-[var(--snow)] border border-[var(--line)] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed italic">
                "{previewFeedback[2].comment}"
              </p>
              <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[var(--ink)]">{previewFeedback[2].name}</p>
                  <p className="text-[var(--gray-600)]">
                    {previewFeedback[2].role} • {previewFeedback[2].department}
                  </p>
                </div>
                <span className="font-bold text-[var(--green-600)]">★ {previewFeedback[2].rating}.0</span>
              </div>
            </div>
          )}

          {previewFeedback[3] && (
            <div className="md:col-span-7 bg-[var(--ink)] text-white rounded-[28px] p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <p className="text-sm sm:text-base text-white/95 leading-relaxed italic">
                "{previewFeedback[3].comment}"
              </p>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
                <div>
                  <p className="font-bold text-white">{previewFeedback[3].name}</p>
                  <p className="text-[var(--gray-400)]">
                    {previewFeedback[3].role} • {previewFeedback[3].department} (Year {previewFeedback[3].year})
                  </p>
                </div>
                <span className="font-bold text-[var(--green-400)]">★ {previewFeedback[3].rating}.0</span>
              </div>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* 7. FAQ (Snow band, accordion) */}
      <SectionWrapper variant="light-alt" id="faq" containerClassName="py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-600)]">
            Common Questions
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--ink)] mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-[var(--line)] bg-white border border-[var(--line)] rounded-[28px] p-6 sm:p-8">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left font-bold text-base text-[var(--ink)] hover:text-[var(--green-600)] transition-colors py-2"
                >
                  <span>{faq.q}</span>
                  <div className="size-7 rounded-full bg-[var(--snow)] text-[var(--ink)] flex items-center justify-center shrink-0 ml-4">
                    <CaretDown
                      className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      weight="bold"
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="pt-2 pb-3 text-sm text-[var(--gray-600)] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* 8. FINAL CTA (Black band) */}
      <SectionWrapper variant="dark" id="cta" containerClassName="py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Ready to learn or share your knowledge?
          </h2>
          <p className="text-[var(--gray-400)] text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Join the peer learning community at NED University. 100% free, always student-led.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/mentors"
              className="px-8 py-3.5 rounded-full bg-[var(--green-400)] text-[var(--ink)] hover:bg-white text-sm font-bold transition-colors"
            >
              Browse Mentors
            </Link>
            {currentUser?.role !== 'mentor' && (
              <Link
                to="/become-a-mentor"
                className="px-8 py-3.5 rounded-full border border-white/20 text-white hover:bg-white hover:text-[var(--ink)] text-sm font-semibold transition-colors"
              >
                Apply as a Mentor
              </Link>
            )}
          </div>
        </div>
      </SectionWrapper>

      {/* Platform Feedback Modal (Full list + Rating breakdown) */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white border border-[var(--line)] rounded-[28px] p-6 sm:p-8">
          <DialogHeader className="pb-4 border-b border-[var(--line)]">
            <DialogTitle className="font-bold text-2xl text-[var(--ink)]">
              Community Feedback &amp; Reviews
            </DialogTitle>
            <p className="text-xs text-[var(--gray-600)] mt-1">
              What verified students and mentors at NED share about their experience.
            </p>
          </DialogHeader>

          {/* Breakdown summary */}
          <div className="bg-[var(--snow)] rounded-[20px] p-5 my-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-4 text-center sm:text-left sm:border-r border-[var(--line)] sm:pr-4">
              <p className="font-bold text-4xl text-[var(--ink)]">
                {feedbackStats.rating.toFixed(1)}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[var(--green-600)] my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="size-3.5"
                    weight={star <= Math.round(feedbackStats.rating) ? 'fill' : 'regular'}
                  />
                ))}
              </div>
              <p className="text-[11px] text-[var(--gray-600)]">
                {feedbackStats.count} total reviews
              </p>
            </div>

            <div className="sm:col-span-8 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = feedbackDistribution[star] || 0;
                const pct = feedbackStats.count > 0 ? (count / feedbackStats.count) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-10 text-[var(--ink)] font-semibold flex items-center gap-0.5">
                      <span>{star}</span>
                      <Star className="size-2.5 text-[var(--ink)]" weight="fill" />
                    </span>
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--ink)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-[var(--gray-600)] font-mono text-[10px]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full List */}
          <div className="divide-y divide-[var(--line)]">
            {allFeedback.map((f) => (
              <div key={f.id} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--ink)]">{f.name}</span>
                    <span className="text-[var(--gray-600)]">• {f.role} ({f.department})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-bold text-[var(--green-600)]">★ {f.rating}.0</span>
                    <span className="text-[var(--gray-400)]">
                      {new Date(f.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[var(--gray-600)] leading-relaxed italic">
                  "{f.comment}"
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
