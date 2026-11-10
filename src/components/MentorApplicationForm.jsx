// src/components/MentorApplicationForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Trash,
} from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import { MIN_GPA, guessAcademicFromEmail } from '../lib/validators';
import { CodeOfConductModal } from './CodeOfConductModal';
import { toast } from 'sonner';

const DRAFT_STORAGE_KEY = 'skillshare_mentor_application_draft';

const SUBJECT_OPTIONS = [
  'Programming',
  'Data Structures',
  'Algorithms',
  'Calculus',
  'Linear Algebra',
  'Physics',
  'Electromagnetism',
  'English',
  'Digital Logic',
  'Computer Networks',
  'Database Systems',
  'Operating Systems',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = ['Morning', 'Afternoon', 'Evening'];

export function MentorApplicationForm() {
  const {
    currentUser,
    applyAsMentor,
    getMentorStatusForUser,
    getMentorForUser,
    resetMentorApplication,
  } = useApp();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    department: 'Computer Science',
    year: 3,
    gpa: '3.6',
    subjects: ['Programming'],
    bio: '',
    availabilityGrid: {
      'Mon-Evening': true,
      'Wed-Evening': true,
      'Sat-Afternoon': true,
    },
    agreeHours: false,
    agreeCode: false,
  });

  const [errors, setErrors] = useState({});
  const [academicSuggestion, setAcademicSuggestion] = useState(null);

  // Load draft or user auto-fill
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: currentUser.name || prev.fullName,
        email: currentUser.email || prev.email,
      }));

      const suggestion = guessAcademicFromEmail(currentUser.email);
      if (suggestion) {
        setAcademicSuggestion(suggestion);
      }
    }

    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          fullName: currentUser?.name || parsed.fullName || '',
          email: currentUser?.email || parsed.email || '',
        }));
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, [currentUser]);

  // Auto-save draft on every change
  useEffect(() => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
    setDraftSaved(true);
    const timer = setTimeout(() => setDraftSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [formData]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setFormData({
      fullName: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: '',
      department: 'Computer Science',
      year: 3,
      gpa: '3.6',
      subjects: ['Programming'],
      bio: '',
      availabilityGrid: {
        'Mon-Evening': true,
        'Wed-Evening': true,
      },
      agreeHours: false,
      agreeCode: false,
    });
    setErrors({});
    toast.info('Application draft cleared.');
  };

  const handleApplySuggestion = () => {
    if (academicSuggestion) {
      setFormData((prev) => ({
        ...prev,
        department: academicSuggestion.department,
        year: academicSuggestion.year,
      }));
      setAcademicSuggestion(null);
      toast.success('Applied department and year suggestions!');
    }
  };

  const parsedGPA = parseFloat(formData.gpa);
  const isGpaEligible = !isNaN(parsedGPA) && parsedGPA >= MIN_GPA && parsedGPA <= 4.0;

  const generateBioTemplate = () => {
    const subjectsStr = formData.subjects.join(', ') || 'engineering courses';
    const template = `Year ${formData.year} ${formData.department} senior excited to help juniors master ${subjectsStr}. I focus on breaking down difficult concepts visually and building clear understanding through step-by-step examples.`;
    setFormData((prev) => ({ ...prev, bio: template.slice(0, 300) }));
    toast.success('Generated bio template.');
  };

  const toggleSubject = (subjectId) => {
    setFormData((prev) => {
      const exists = prev.subjects.includes(subjectId);
      if (exists) {
        if (prev.subjects.length <= 1) {
          toast.warning('Please select at least 1 subject.');
          return prev;
        }
        return { ...prev, subjects: prev.subjects.filter((s) => s !== subjectId) };
      } else {
        if (prev.subjects.length >= 5) {
          toast.warning('You can choose up to 5 subjects.');
          return prev;
        }
        return { ...prev, subjects: [...prev.subjects, subjectId] };
      }
    });
  };

  const toggleSlot = (day, slot) => {
    const key = `${day}-${slot}`;
    setFormData((prev) => ({
      ...prev,
      availabilityGrid: {
        ...prev.availabilityGrid,
        [key]: !prev.availabilityGrid[key],
      },
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
      if (!formData.email.trim()) newErrors.email = 'University email is required.';
    } else if (step === 2) {
      if (!formData.department) newErrors.department = 'Department is required.';
      if (!formData.year) newErrors.year = 'Year of study is required.';
      if (!isGpaEligible) {
        newErrors.gpa = `GPA must be between ${MIN_GPA} and 4.0 for eligibility.`;
      }
    } else if (step === 3) {
      if (formData.subjects.length === 0) {
        newErrors.subjects = 'Select between 1 and 5 subjects.';
      }
      if (!formData.bio.trim() || formData.bio.trim().length < 20) {
        newErrors.bio = 'Please write a brief bio of at least 20 characters.';
      }
      const selectedSlots = Object.values(formData.availabilityGrid).filter(Boolean).length;
      if (selectedSlots === 0) {
        newErrors.availability = 'Please select at least 1 weekly time slot.';
      }
    } else if (step === 4) {
      if (!formData.agreeHours) {
        newErrors.agreeHours = 'You must agree to minimum 1-hour online sessions.';
      }
      if (!formData.agreeCode) {
        newErrors.agreeCode = 'You must agree to the Code of Conduct.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      toast.error('Please fix the highlighted fields to proceed.');
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(4)) {
      toast.error('Please accept all requirements before submitting.');
      return;
    }

    const availabilityArray = Object.entries(formData.availabilityGrid)
      .filter(([_, active]) => active)
      .map(([key]) => {
        const [day, time] = key.split('-');
        return `${day} (${time})`;
      });

    applyAsMentor({
      department: formData.department,
      year: parseInt(formData.year, 10),
      gpa: parseFloat(formData.gpa),
      subjects: formData.subjects,
      bio: formData.bio,
      availability: availabilityArray,
      phone: formData.phone || null,
    });

    localStorage.removeItem(DRAFT_STORAGE_KEY);
    toast.success('Application submitted for review!');
  };

  const currentStatus = getMentorStatusForUser(currentUser?.id);
  const mentorRecord = getMentorForUser(currentUser?.id);

  if (!currentUser) {
    return (
      <div className="text-center py-10 px-4 max-w-lg mx-auto space-y-4">
        <h2 className="font-heading font-semibold text-2xl text-[var(--ink)] page-header-anim">
          Sign in to apply as a mentor
        </h2>
        <p className="text-sm text-[var(--gray-600)] leading-relaxed">
          Mentor applications require a verified student account. Sign in with your NED university email or create an account to begin.
        </p>
        <button
          type="button"
          onClick={() => {
            const tabsTrigger = document.querySelector('[value="login"]');
            if (tabsTrigger) tabsTrigger.click();
            else navigate('/auth');
          }}
          className="px-6 py-2.5 rounded-full bg-[var(--ink)] text-[var(--white)] hover:bg-[var(--green-900)] text-xs font-semibold cursor-pointer"
        >
          Log in or sign up first
        </button>
      </div>
    );
  }

  // STATUS SCREEN: Pending
  if (currentStatus === 'pending') {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--green-600)] block">
          Status: Pending Review
        </span>

        <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[var(--ink)] page-header-anim">
          Your mentor application is under review
        </h2>

        <p className="text-sm text-[var(--gray-600)] max-w-lg mx-auto leading-relaxed">
          Thank you for volunteering, <strong className="text-[var(--ink)]">{currentUser.name}</strong>. University administrators review applications to verify GPA eligibility and departmental alignment.
        </p>

        {/* Numbered Stepper Tracker */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-[20px] border border-[var(--line)] bg-[var(--snow)] max-w-lg mx-auto text-xs my-4 stagger-grid">
          <div className="flex flex-col items-center">
            <span className="size-8 rounded-full bg-[var(--green-600)] text-[var(--white)] font-bold text-xs flex items-center justify-center mb-1">
              <Check className="size-4" weight="bold" />
            </span>
            <span className="font-semibold text-[var(--ink)]">Submitted</span>
            <span className="text-[10px] text-[var(--green-600)] font-medium">Complete</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="size-8 rounded-full bg-[var(--ink)] text-[var(--white)] font-bold text-xs flex items-center justify-center mb-1">
              2
            </span>
            <span className="font-semibold text-[var(--ink)]">Admin Review</span>
            <span className="text-[10px] text-[var(--gray-600)]">In progress</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="size-8 rounded-full bg-[var(--line)] text-[var(--gray-600)] font-bold text-xs flex items-center justify-center mb-1">
              3
            </span>
            <span className="font-semibold text-[var(--gray-600)]">Profile Live</span>
            <span className="text-[10px] text-[var(--gray-400)]">Upcoming</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-full border border-[var(--ink)] bg-[var(--white)] hover:bg-[var(--snow)] text-xs font-semibold text-[var(--ink)] cursor-pointer"
          >
            Go to Home
          </button>
          <button
            type="button"
            onClick={() => {
              toast.info('Tip: Switch to the Admin demo account to approve this profile.');
            }}
            className="px-6 py-2.5 rounded-full bg-[var(--ink)] hover:bg-[var(--green-900)] text-[var(--white)] text-xs font-semibold cursor-pointer"
          >
            How does review work?
          </button>
        </div>
      </div>
    );
  }

  // STATUS SCREEN: Approved
  if (currentStatus === 'approved') {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--green-600)] block">
          Approved &amp; Active Mentor
        </span>

        <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[var(--ink)] page-header-anim">
          You are an official Skill Share mentor
        </h2>

        <p className="text-sm text-[var(--gray-600)] max-w-lg mx-auto leading-relaxed">
          Your profile is active in the NED mentor directory. Juniors can now request 1-on-1 virtual sessions with you.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 rounded-full bg-[var(--ink)] hover:bg-[var(--green-900)] text-[var(--white)] text-xs font-semibold"
          >
            Go to Mentor Dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate('/mentors')}
            className="px-5 py-2.5 rounded-full border border-[var(--line)] bg-[var(--snow)] hover:bg-[var(--line)] text-xs font-semibold text-[var(--ink)]"
          >
            View in Directory
          </button>
        </div>
      </div>
    );
  }

  // STATUS SCREEN: Rejected
  if (currentStatus === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--error)] block">
          Application Not Approved
        </span>

        <h2 className="font-heading font-semibold text-2xl text-[var(--ink)] page-header-anim">
          Application needs revision
        </h2>

        <div className="p-4 rounded-[14px] border border-[var(--line)] bg-[var(--snow)] max-w-md mx-auto text-left text-xs">
          <p className="text-[var(--gray-600)] uppercase font-bold text-[10px] mb-1">Admin Feedback:</p>
          <p className="text-[var(--ink)] leading-relaxed">
            {mentorRecord?.rejectReason || 'Please verify minimum GPA eligibility (3.0) and specify weekly availability.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetMentorApplication(mentorRecord?.id);
            toast.info('Application form reopened for editing.');
          }}
          className="px-6 py-2.5 rounded-full bg-[var(--ink)] hover:bg-[var(--green-900)] text-[var(--white)] text-xs font-semibold"
        >
          Re-apply with Updates
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top Header with Draft Status & Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--line)]">
        <div>
          <h2 className="font-heading font-semibold text-xl sm:text-2xl text-[var(--ink)] tracking-tight page-header-anim">
            Mentor Application
          </h2>
          <p className="text-xs text-[var(--gray-600)]">
            Join the senior volunteer cohort. Minimum 3.0 CGPA required.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {draftSaved && (
            <span className="flex items-center gap-1 text-[11px] text-[#A86F10] font-medium">
              <Check className="size-3" weight="bold" />
              <span>Draft saved</span>
            </span>
          )}
          <button
            type="button"
            onClick={clearDraft}
            className="flex items-center gap-1 text-[11px] text-[#11203A]/60 hover:text-[#11203A] transition-colors cursor-pointer"
          >
            <Trash className="size-3" weight="regular" />
            <span>Clear draft</span>
          </button>
        </div>
      </div>

      {/* Numbered Stepper (1 to 4 circles, green when done per spec) */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { step: 1, label: 'Personal' },
          { step: 2, label: 'Academic' },
          { step: 3, label: 'Expertise' },
          { step: 4, label: 'Review' },
        ].map((item) => {
          const isDone = currentStep > item.step;
          const isCurrent = currentStep === item.step;

          return (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                if (item.step < currentStep) setCurrentStep(item.step);
              }}
              disabled={item.step > currentStep}
              className={`flex items-center gap-2.5 p-2 rounded-full border text-left transition-colors ${isCurrent
                  ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--white)]'
                  : isDone
                    ? 'border-[var(--green-600)] bg-[var(--mint)] text-[var(--green-900)] cursor-pointer'
                    : 'border-[var(--line)] bg-[var(--snow)] text-[var(--gray-400)] cursor-not-allowed'
                }`}
            >
              <span className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${isCurrent
                  ? 'bg-[var(--white)] text-[var(--ink)]'
                  : isDone
                    ? 'bg-[var(--green-600)] text-[var(--white)]'
                    : 'bg-[var(--line)] text-[var(--gray-600)]'
                }`}>
                {isDone ? <Check className="size-3.5" weight="bold" /> : item.step}
              </span>
              <span className="text-xs font-semibold hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* FORM STEPS */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: PERSONAL */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#11203A]">
                Full Name <span className="text-[#B9503A]">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                readOnly
                className="w-full bg-[#EDE8DD] border border-[#11203A]/15 rounded-[6px] px-3.5 py-2 text-xs text-[#11203A]/80 cursor-not-allowed outline-none"
              />
              <p className="text-[11px] text-[#11203A]/60">Auto-filled from your authenticated account</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#11203A]">
                NED University Email <span className="text-[#B9503A]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full bg-[#EDE8DD] border border-[#11203A]/15 rounded-[6px] px-3.5 py-2 text-xs text-[#11203A]/80 cursor-not-allowed outline-none"
              />
              <p className="text-[11px] text-[#11203A]/60">
                Verified institutional domain (@neduet.edu.pk)
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#11203A]">
                Phone Number <span className="text-[#11203A]/50 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="+92 300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-[#11203A]/20 focus:border-[#3A6598] rounded-[6px] px-3.5 py-2 text-xs text-[#11203A] outline-none"
              />
              <p className="text-[11px] text-[#A86F10]">
                Hidden from students until a session is officially scheduled.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: ACADEMIC */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {academicSuggestion && (
              <div className="p-3 rounded-[6px] bg-[#EDE8DD] border border-[#A86F10]/30 flex items-center justify-between gap-3 text-xs">
                <span className="text-[#11203A] font-medium">{academicSuggestion.label}</span>
                <button
                  type="button"
                  onClick={handleApplySuggestion}
                  className="px-3 py-1 rounded-[4px] bg-[#0F2240] text-[#F7F4EE] text-xs font-semibold hover:bg-[#1F3C6B] transition-colors shrink-0"
                >
                  Use Suggestion
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#11203A]">
                  Department <span className="text-[#B9503A]">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-white border border-[#11203A]/20 focus:border-[#3A6598] rounded-[6px] px-3 py-2 text-xs text-[#11203A] outline-none cursor-pointer"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Electronics Engineering">Electronics Engineering</option>
                  <option value="Telecommunication Engineering">Telecommunication Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Textile Engineering">Textile Engineering</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#11203A]">
                  Year of Study <span className="text-[#B9503A]">*</span>
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) })}
                  className="w-full bg-white border border-[#11203A]/20 focus:border-[#3A6598] rounded-[6px] px-3 py-2 text-xs text-[#11203A] outline-none cursor-pointer"
                >
                  <option value={2}>Year 2 (Sophomore)</option>
                  <option value={3}>Year 3 (Junior Senior)</option>
                  <option value={4}>Year 4 (Final Year Senior)</option>
                </select>
              </div>
            </div>

            {/* GPA with Eligibility check */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#11203A]">
                Cumulative CGPA <span className="text-[#B9503A]">*</span>
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  placeholder="3.50"
                  className="flex-1 bg-white border border-[#11203A]/20 focus:border-[#3A6598] rounded-[6px] px-3.5 py-2 text-xs text-[#11203A] outline-none"
                />

                <div
                  className={`px-3 py-2 rounded-[6px] text-xs font-bold border ${isGpaEligible
                      ? 'bg-[#5E9680]/15 border-[#5E9680] text-[#5E9680]'
                      : 'bg-[#B9503A]/15 border-[#B9503A] text-[#B9503A]'
                    }`}
                >
                  {isGpaEligible ? 'Eligible (≥ 3.0)' : 'Minimum 3.0 required'}
                </div>
              </div>
              <p className="text-[11px] text-[#11203A]/60">
                GPA is an eligibility threshold only. Directory rank is determined by student reviews.
              </p>
              {errors.gpa && <p className="text-xs text-[#B9503A]">{errors.gpa}</p>}
            </div>
          </div>
        )}

        {/* STEP 3: EXPERTISE */}
        {currentStep === 3 && (
          <div className="space-y-5">
            {/* Subject Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#11203A]">
                  Select Subjects (1 to 5) <span className="text-[#B9503A]">*</span>
                </label>
                <span className="text-[11px] text-[#11203A]/60">{formData.subjects.length} of 5 selected</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {SUBJECT_OPTIONS.map((subj) => {
                  const isSelected = formData.subjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`px-3 py-1.5 rounded-[6px] text-xs font-medium border transition-colors cursor-pointer ${isSelected
                          ? 'bg-[#0F2240] text-[#F7F4EE] border-[#0F2240] font-semibold'
                          : 'bg-white border-[#11203A]/20 text-[#11203A] hover:bg-[#EDE8DD]'
                        }`}
                    >
                      {subj}
                    </button>
                  );
                })}
              </div>
              {errors.subjects && <p className="text-xs text-[#B9503A]">{errors.subjects}</p>}
            </div>

            {/* Bio with Template Generator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#11203A]">
                  Mentor Bio <span className="text-[#B9503A]">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateBioTemplate}
                  className="text-[11px] text-[#A86F10] hover:underline font-semibold"
                >
                  Suggest bio
                </button>
              </div>

              <textarea
                rows={3}
                maxLength={300}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your teaching style, study techniques, or why you want to guide juniors..."
                className="w-full bg-white border border-[#11203A]/20 focus:border-[#3A6598] rounded-[6px] p-3 text-xs text-[#11203A] outline-none resize-none leading-relaxed"
              />
              <div className="flex justify-between text-[11px] text-[#11203A]/60">
                <span>Minimum 20 characters</span>
                <span>{formData.bio.length} / 300</span>
              </div>
              {errors.bio && <p className="text-xs text-[#B9503A]">{errors.bio}</p>}
            </div>

            {/* Weekly Availability Grid */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#11203A]">
                Weekly Availability Slots <span className="text-[#B9503A]">*</span>
              </label>

              <div className="overflow-x-auto pb-1 border border-[#11203A]/15 rounded-[6px]">
                <table className="w-full text-xs text-center border-collapse">
                  <thead className="bg-[#EDE8DD] border-b border-[#11203A]/15">
                    <tr>
                      <th className="p-2 text-left text-[11px] uppercase tracking-wider text-[#11203A]/70 font-semibold">Day</th>
                      {SLOTS.map((slot) => (
                        <th key={slot} className="p-2 text-[11px] uppercase tracking-wider text-[#11203A]/70 font-semibold">
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#11203A]/10 bg-white">
                    {DAYS.map((day) => (
                      <tr key={day}>
                        <td className="p-2 text-left font-semibold text-[#11203A]">{day}</td>
                        {SLOTS.map((slot) => {
                          const key = `${day}-${slot}`;
                          const isChecked = !!formData.availabilityGrid[key];
                          return (
                            <td key={slot} className="p-1">
                              <button
                                type="button"
                                onClick={() => toggleSlot(day, slot)}
                                className={`w-full py-1 px-2 rounded-[4px] text-[11px] font-semibold border transition-colors ${isChecked
                                    ? 'bg-[#0F2240] text-[#F7F4EE] border-[#0F2240]'
                                    : 'bg-[#EDE8DD]/50 border-transparent text-[#11203A]/50 hover:bg-[#EDE8DD]'
                                  }`}
                              >
                                {isChecked ? 'Free' : '-'}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {errors.availability && <p className="text-xs text-[#B9503A]">{errors.availability}</p>}
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="rounded-[6px] border border-[#11203A]/15 bg-white p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#11203A]/10">
                <div>
                  <p className="font-semibold text-[#11203A] text-sm">{formData.fullName}</p>
                  <p className="text-[#11203A]/70">{formData.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#A86F10] hover:underline font-semibold"
                >
                  Edit Personal
                </button>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#11203A]/10">
                <div>
                  <p className="text-[#11203A] font-medium">
                    {formData.department} • Year {formData.year}
                  </p>
                  <p className="text-[#5E9680] font-semibold">GPA: {formData.gpa} (Eligible)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#A86F10] hover:underline font-semibold"
                >
                  Edit Academic
                </button>
              </div>

              <div className="pb-2 border-b border-[#11203A]/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[#11203A] font-medium">Subjects &amp; Bio</p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs text-[#A86F10] hover:underline font-semibold"
                  >
                    Edit Expertise
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.subjects.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-[4px] bg-[#EDE8DD] text-[#11203A] text-[11px] font-semibold border border-[#11203A]/10"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-[#11203A]/80 italic text-[11px] leading-relaxed">"{formData.bio}"</p>
              </div>

              <div>
                <p className="text-[#11203A] font-medium mb-1">Availability</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(formData.availabilityGrid)
                    .filter(([_, active]) => active)
                    .map(([key]) => (
                      <span
                        key={key}
                        className="px-2 py-0.5 rounded-[4px] bg-[#EDE8DD] text-[#11203A] text-[10px]"
                      >
                        {key.replace('-', ' ')}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeHours}
                  onChange={(e) => setFormData({ ...formData, agreeHours: e.target.checked })}
                  className="mt-0.5 size-4 rounded border-[#11203A]/30 accent-[#0F2240]"
                />
                <span className="text-xs text-[#11203A]/85 leading-relaxed">
                  I agree to hold sessions of at least 1 hour, online, through verified Skill Share platform links. <span className="text-[#B9503A]">*</span>
                </span>
              </label>
              {errors.agreeHours && <p className="text-xs text-[#B9503A]">{errors.agreeHours}</p>}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeCode}
                  onChange={(e) => setFormData({ ...formData, agreeCode: e.target.checked })}
                  className="mt-0.5 size-4 rounded border-[#11203A]/30 accent-[#0F2240]"
                />
                <span className="text-xs text-[#11203A]/85 leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCodeModal(true);
                    }}
                    className="text-[#0F2240] underline font-semibold"
                  >
                    Code of Conduct
                  </button>{' '}
                  and volunteer-only guidelines. <span className="text-[#B9503A]">*</span>
                </span>
              </label>
              {errors.agreeCode && <p className="text-xs text-[#B9503A]">{errors.agreeCode}</p>}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#11203A]/15">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] border border-[#11203A]/20 bg-white hover:bg-[#EDE8DD] text-xs font-semibold text-[#11203A] cursor-pointer"
            >
              <ArrowLeft className="size-3.5" weight="regular" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === 2 && !isGpaEligible}
              className="flex items-center gap-1.5 px-5 py-2 rounded-[6px] bg-[#0F2240] text-[#F7F4EE] hover:bg-[#1F3C6B] text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue</span>
              <ArrowRight className="size-3.5" weight="regular" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 rounded-[6px] bg-[#E0A030] text-[#0A1628] hover:bg-[#A86F10] hover:text-[#F7F4EE] text-xs font-bold cursor-pointer transition-colors"
            >
              Submit Application
            </button>
          )}
        </div>
      </form>

      {/* Code of Conduct Modal */}
      <CodeOfConductModal open={showCodeModal} onOpenChange={setShowCodeModal} />
    </div>
  );
}
