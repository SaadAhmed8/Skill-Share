// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionWrapper } from '../components/SectionWrapper';
import { ArrowRight, House } from '@phosphor-icons/react';

export function NotFoundPage() {
  return (
    <SectionWrapper variant="light" containerClassName="py-24 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <p className="text-xs uppercase tracking-widest font-bold text-[#A86F10]">
          404 Error
        </p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-[#0F2240] tracking-tight">
          Page not found
        </h1>
        <p className="text-sm sm:text-base text-[#11203A]/75 leading-relaxed">
          The requested page could not be located on the Skill Share platform. Check the URL or return to home.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-[6px] bg-[#0F2240] text-[#F7F4EE] hover:bg-[#1F3C6B] text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <House className="size-4" weight="regular" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/mentors"
            className="px-5 py-2.5 rounded-[6px] border border-[#11203A]/20 bg-[#EDE8DD] hover:bg-[#11203A] hover:text-[#F7F4EE] text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Browse Mentors</span>
            <ArrowRight className="size-4" weight="regular" />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
