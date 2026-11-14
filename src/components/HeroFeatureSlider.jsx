// src/components/HeroFeatureSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  CaretLeft,
  CaretRight,
  Star,
  Check,
  CalendarCheck,
  ShieldCheck,
  GraduationCap,
  Sparkle,
  Clock,
  ArrowRight,
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 'mentor-match',
    badge: 'Smart Mentor Matching',
    title: 'Top Verified NED Seniors',
    subtitle: '1-on-1 Academic Mentors',
    description:
      'Connect with top-performing seniors in Computer Science, SE, Electrical, and Mechanical departments. Filter by verified GPA and subject expertise.',
    theme: 'dark', // 'dark' | 'mint' | 'light' | 'green'
    ctaText: 'Browse 24+ Mentors',
    ctaLink: '/mentors',
    visual: (
      <div className="w-full max-w-sm rounded-[24px] bg-[#161616] border border-white/10 p-5 shadow-sm text-left">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center font-bold text-sm">
              AK
            </div>
            <div>
              <p className="font-bold text-sm text-white">Ayesha Khan</p>
              <p className="text-xs text-[var(--gray-400)]">Software Eng • Year 4</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--green-900)] text-white font-bold uppercase tracking-wider">
            Verified
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Data Structures', 'OOP', 'Algorithms'].map((s) => (
            <span
              key={s}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 font-medium"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-[var(--green-400)] font-bold">
            <Star className="size-3.5" weight="fill" />
            <span>4.9 (31 reviews)</span>
          </div>
          <span className="text-[var(--gray-400)] font-medium">54 volunteer hrs</span>
        </div>
      </div>
    ),
  },
  {
    id: 'slot-booking',
    badge: 'Seamless Scheduling',
    title: 'Pick Time Slots That Fit Your Timetable',
    subtitle: 'Zero Hassle Booking',
    description:
      'Reserve 1-hour slots around university classes and labs. Confirm instant Google Meet links directly in your student session workspace.',
    theme: 'mint',
    ctaText: 'View My Schedule',
    ctaLink: '/sessions',
    visual: (
      <div className="w-full max-w-sm rounded-[24px] bg-white border border-[var(--line)] p-5 shadow-sm text-left">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-[var(--green-900)] uppercase tracking-wider">
            Upcoming Weekly Slots
          </p>
          <span className="size-2 rounded-full bg-[var(--green-600)] animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="px-3.5 py-2 rounded-[14px] bg-[var(--snow)] border border-[var(--line)] text-xs font-semibold flex items-center justify-between text-[var(--ink)]">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-[var(--gray-600)]" weight="bold" />
              <span>Monday • 5:00 PM</span>
            </div>
            <span className="text-[11px] font-bold text-[var(--green-600)]">Available</span>
          </div>
          <div className="px-3.5 py-2 rounded-[14px] bg-[var(--green-900)] text-white text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="size-3.5 text-[var(--green-400)]" weight="bold" />
              <span>Wednesday • 6:30 PM</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--green-400)] text-[var(--ink)] font-bold">
              Selected
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-[14px] bg-[var(--snow)] border border-[var(--line)] text-xs font-semibold flex items-center justify-between text-[var(--ink)]">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-[var(--gray-600)]" weight="bold" />
              <span>Friday • 4:00 PM</span>
            </div>
            <span className="text-[11px] font-bold text-[var(--green-600)]">Available</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'community-proof',
    badge: 'NED Official Standards',
    title: '100% Free & University Verified',
    subtitle: 'Built on Academic Integrity',
    description:
      'Every session is free and strictly volunteer-powered. Mentors earn officially verifiable community service hours and department certificates.',
    theme: 'green',
    ctaText: 'How It Works',
    ctaLink: '/#how-it-works',
    visual: (
      <div className="w-full max-w-sm rounded-[24px] bg-[#0A3D22] border border-white/15 p-5 shadow-sm text-left text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-full bg-black text-[var(--green-400)] flex items-center justify-center shrink-0">
            <ShieldCheck className="size-5" weight="bold" />
          </div>
          <div>
            <p className="font-bold text-sm text-white">NED Academic Seal</p>
            <p className="text-xs text-[var(--green-400)]">Official @neduet.edu.pk auth</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 my-3 text-center">
          <div className="p-2.5 rounded-[14px] bg-black/25 border border-white/10">
            <p className="text-xl font-bold text-[var(--green-400)]">30+ hrs</p>
            <p className="text-[10px] text-white/80">Certificate Tier</p>
          </div>
          <div className="p-2.5 rounded-[14px] bg-black/25 border border-white/10">
            <p className="text-xl font-bold text-[var(--green-400)]">0 PKR</p>
            <p className="text-[10px] text-white/80">Always Free</p>
          </div>
        </div>
        <p className="text-[11px] text-white/80 border-t border-white/10 pt-2 flex items-center gap-1.5">
          <Check className="size-3.5 text-[var(--green-400)]" weight="bold" />
          <span>Faculty advisor endorsed certification</span>
        </p>
      </div>
    ),
  },
];

export function HeroFeatureSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next'); // 'next' | 'prev'
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-advance slides every 5.5 seconds unless paused by mouse hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSlideDirection('next');
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = (index) => {
    setSlideDirection(index > currentSlide ? 'next' : 'prev');
    setCurrentSlide(index);
  };

  const handlePrev = () => {
    setSlideDirection('prev');
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSlideDirection('next');
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  // Touch swipe support on mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  const active = SLIDES[currentSlide];

  // Theme card colors
  const themeClasses = {
    dark: 'bg-[var(--ink)] text-white border-[var(--gray-600)]/30',
    mint: 'bg-[var(--mint)] text-[var(--ink)] border-[var(--green-900)]/15',
    green: 'bg-[var(--green-900)] text-white border-white/15',
  }[active.theme];

  const badgeBg = {
    dark: 'bg-white/10 text-[var(--green-400)]',
    mint: 'bg-[var(--green-900)] text-white',
    green: 'bg-black text-[var(--green-400)]',
  }[active.theme];

  const buttonClass = {
    dark: 'bg-[var(--green-400)] text-[var(--ink)] hover:bg-white',
    mint: 'bg-[var(--ink)] text-white hover:bg-[var(--green-900)]',
    green: 'bg-[var(--green-400)] text-[var(--ink)] hover:bg-white',
  }[active.theme];

  return (
    <div
      className="w-full my-6 text-left"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container with rounded border & smooth slide container */}
      <div
        className={`relative overflow-hidden rounded-[28px] border p-6 sm:p-8 transition-colors duration-300 ${themeClasses}`}
      >
        {/* Animated Slide Content */}
        <div
          key={`${active.id}-${currentSlide}`}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${slideDirection === 'next' ? 'slide-transition-next' : 'slide-transition-prev'
            }`}
        >
          {/* Left Info Column */}
          <div className="lg:col-span-7 flex flex-col items-start justify-between space-y-4">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${badgeBg}`}
              >
                {active.badge}
              </span>
              <span className="text-xs opacity-75 font-mono">
                0{currentSlide + 1} / 0{SLIDES.length}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              {active.title}
            </h3>

            <p className="text-sm sm:text-base opacity-85 leading-relaxed max-w-xl">
              {active.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={active.ctaLink}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-2 ${buttonClass}`}
              >
                <span>{active.ctaText}</span>
                <ArrowRight className="size-3.5" weight="bold" />
              </Link>
            </div>
          </div>

          {/* Right Visual Card Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            {active.visual}
          </div>
        </div>

        {/* Bottom Navigation Strip: Indicator Pills & Arrows */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-current/15">
          {/* Slide Indicator Pills */}
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, idx) => {
              const isCurrent = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${isCurrent
                      ? 'w-8 bg-[var(--green-400)]'
                      : 'w-2 bg-current opacity-30 hover:opacity-60'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Next / Prev Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="size-9 rounded-full border border-current/25 bg-current/5 hover:bg-current/15 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <CaretLeft className="size-4" weight="bold" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="size-9 rounded-full border border-current/25 bg-current/5 hover:bg-current/15 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <CaretRight className="size-4" weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

