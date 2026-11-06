// src/pages/BecomeMentorPage.jsx
import React from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { MentorApplicationForm } from '../components/MentorApplicationForm';

export function BecomeMentorPage() {
  return (
    <div className="w-full">
      <SectionWrapper variant="light" className="py-8 sm:py-12">
        <MentorApplicationForm />
      </SectionWrapper>
    </div>
  );
}
