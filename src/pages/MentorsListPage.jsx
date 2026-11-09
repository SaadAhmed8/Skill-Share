// src/pages/MentorsListPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Info,
  ArrowRight,
  Star,
  Clock,
} from '@phosphor-icons/react';
import { SectionWrapper } from '../components/SectionWrapper';
import { GlowSearchBar } from '../components/GlowSearchBar';
import { GettingStartedChecklist } from '../components/GettingStartedChecklist';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import { useApp } from '../context/AppContext';
import { rankMentors } from '../lib/ranking';
import { featuredSubjects } from '../data/mockData';
import { getSubjectName } from '../lib/utils';

const DEPARTMENTS = [
  'All Departments',
  'Computer Science',
  'Software Engineering',
  'Electrical Engineering',
  'Electronics Engineering',
  'Telecommunication Engineering',
  'Civil Engineering',
  'Mechanical Engineering',
  'Textile Engineering',
  'Data Science',
];

const DAYS = ['Any Day', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MentorsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getApprovedMentors, getMentorStats } = useApp();

  const urlSubject = searchParams.get('subject') || '';
  const urlQuery = searchParams.get('q') || searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedSubject, setSelectedSubject] = useState(urlSubject);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedYear, setSelectedYear] = useState('all');
  const [minRating, setMinRating] = useState('all');
  const [selectedDay, setSelectedDay] = useState('Any Day');
  const [newMentorsOnly, setNewMentorsOnly] = useState(false);
  const [sortBy, setSortBy] = useState('best_match');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const s = searchParams.get('subject') || '';
    const q = searchParams.get('q') || searchParams.get('search') || '';
    setSelectedSubject(s);
    setSearchQuery(q);
  }, [searchParams]);

  const handleLiveSearch = (val) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleQuickSubjectClick = (subjName) => {
    const nextVal = selectedSubject === subjName ? '' : subjName;
    setSelectedSubject(nextVal);
    const newParams = new URLSearchParams(searchParams);
    if (nextVal) {
      newParams.set('subject', nextVal);
    } else {
      newParams.delete('subject');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSubject('');
    setSelectedDept('All Departments');
    setSelectedYear('all');
    setMinRating('all');
    setSelectedDay('Any Day');
    setNewMentorsOnly(false);
    setSortBy('best_match');
    setSearchParams({});
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedSubject) count++;
    if (selectedDept !== 'All Departments') count++;
    if (selectedYear !== 'all') count++;
    if (minRating !== 'all') count++;
    if (selectedDay !== 'Any Day') count++;
    if (newMentorsOnly) count++;
    return count;
  }, [
    searchQuery,
    selectedSubject,
    selectedDept,
    selectedYear,
    minRating,
    selectedDay,
    newMentorsOnly,
  ]);

  const approvedMentors = useMemo(() => {
    return getApprovedMentors();
  }, [getApprovedMentors]);

  const filteredMentors = useMemo(() => {
    let list = approvedMentors.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = m.name?.toLowerCase().includes(q);
        const deptMatch = m.department?.toLowerCase().includes(q);
        const subMatch = m.subjects?.some((s) => getSubjectName(s).toLowerCase().includes(q));
        const bioMatch = m.bio?.toLowerCase().includes(q);
        if (!nameMatch && !deptMatch && !subMatch && !bioMatch) return false;
      }

      if (selectedSubject) {
        const hasSub = m.subjects?.some(
          (s) => getSubjectName(s).toLowerCase() === selectedSubject.toLowerCase()
        );
        if (!hasSub) return false;
      }

      if (selectedDept !== 'All Departments') {
        if (m.department !== selectedDept) return false;
      }

      if (selectedYear !== 'all') {
        if (String(m.year) !== String(selectedYear)) return false;
      }

      if (minRating !== 'all') {
        const min = parseFloat(minRating);
        if ((m.rating || 0) < min) return false;
      }

      if (selectedDay !== 'Any Day') {
        const hasDay = m.availability?.some((a) => a.day === selectedDay);
        if (!hasDay) return false;
      }

      if (newMentorsOnly) {
        if (!m.isNew && (m.ratingCount || 0) > 0) return false;
      }

      return true;
    });

    if (sortBy === 'best_match') {
      return rankMentors(list);
    } else if (sortBy === 'highest_rated') {
      return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'most_hours') {
      return [...list].sort(
        (a, b) => (b.hoursTaught || 0) - (a.hoursTaught || 0)
      );
    } else if (sortBy === 'fastest_response') {
      return [...list].sort(
        (a, b) => (a.responseHours || 99) - (b.responseHours || 99)
      );
    }

    return list;
  }, [
    approvedMentors,
    searchQuery,
    selectedSubject,
    selectedDept,
    selectedYear,
    minRating,
    selectedDay,
    newMentorsOnly,
    sortBy,
  ]);

  const filterControls = (
    <div className="space-y-6 text-xs text-[var(--ink)]">
      {/* Department dropdown */}
      <div className="space-y-1.5">
        <label className="font-bold text-[var(--ink)]">Department</label>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full bg-white border border-[var(--line)] rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none focus:border-[var(--ink)]"
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Year radio pills */}
      <div className="space-y-1.5">
        <label className="font-bold text-[var(--ink)]">Mentor Year</label>
        <div className="grid grid-cols-4 gap-1.5">
          {['all', '3', '4', 'Masters'].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`py-2 rounded-full text-center border font-semibold transition-colors ${
                selectedYear === yr
                  ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                  : 'bg-white border-[var(--line)] text-[var(--gray-600)] hover:bg-[var(--snow)]'
              }`}
            >
              {yr === 'all' ? 'All' : `Yr ${yr}`}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-1.5">
        <label className="font-bold text-[var(--ink)]">Minimum Rating</label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { val: 'all', label: 'Any' },
            { val: '4.0', label: '4.0+ ★' },
            { val: '4.5', label: '4.5+ ★' },
          ].map((r) => (
            <button
              key={r.val}
              type="button"
              onClick={() => setMinRating(r.val)}
              className={`py-2 rounded-full text-center border font-semibold transition-colors ${
                minRating === r.val
                  ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                  : 'bg-white border-[var(--line)] text-[var(--gray-600)] hover:bg-[var(--snow)]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available Day */}
      <div className="space-y-1.5">
        <label className="font-bold text-[var(--ink)]">Available Day</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="w-full bg-white border border-[var(--line)] rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none focus:border-[var(--ink)]"
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* New Mentors checkbox */}
      <div className="pt-2">
        <label className="flex items-center gap-2.5 cursor-pointer font-medium text-[var(--ink)]">
          <input
            type="checkbox"
            checked={newMentorsOnly}
            onChange={(e) => setNewMentorsOnly(e.target.checked)}
            className="size-4 rounded accent-[var(--green-600)]"
          />
          <span>New mentors only (boosted)</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full bg-[var(--white)]">
      {/* SECTION A: SEARCH HEADER (Dark band) */}
      <SectionWrapper variant="dark" containerClassName="py-14 sm:py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-wider font-bold text-[var(--green-400)]">
            NED University Peer Mentors
          </span>

          <h1 className="font-bold text-4xl sm:text-6xl text-white tracking-[-0.03em] leading-tight">
            Find your mentor
          </h1>

          <p className="text-sm sm:text-base text-[var(--gray-400)] max-w-xl mx-auto leading-relaxed">
            Search courses or departments to schedule free 1-on-1 virtual mentoring sessions with high-achieving seniors.
          </p>

          <div className="pt-2 max-w-2xl mx-auto">
            <GlowSearchBar
              placeholder="Search by subject or keyword: Programming, Calculus, Physics..."
              initialQuery={searchQuery}
              onSearch={handleLiveSearch}
            />
          </div>

          {/* Quick Subject Chips (plain pills) */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[var(--gray-400)] mr-1">Popular:</span>
            {featuredSubjects.slice(0, 7).map((subj) => {
              const subjName = getSubjectName(subj);
              const subjId = typeof subj === 'string' ? subj : (subj.id || subj.name);
              const isSelected = selectedSubject.toLowerCase() === subjName.toLowerCase();
              return (
                <button
                  key={subjId}
                  type="button"
                  onClick={() => handleQuickSubjectClick(subjName)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    isSelected
                      ? 'bg-[var(--green-400)] text-[var(--ink)] border-[var(--green-400)]'
                      : 'bg-[#181818] text-white border-white/10 hover:border-white/30'
                  }`}
                >
                  {subjName}
                </button>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION B: GETTING STARTED CHECKLIST */}
      <SectionWrapper variant="light-alt" containerClassName="py-6">
        <GettingStartedChecklist />
      </SectionWrapper>

      {/* SECTION C: MAIN CONTENT (Filters + Mentor Rows) */}
      <SectionWrapper variant="light" containerClassName="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar: Filters */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-[var(--line)] rounded-[28px] p-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] mb-5">
              <span className="font-bold text-sm text-[var(--ink)]">Filters</span>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-[var(--green-600)] hover:underline font-semibold"
                >
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>

            {filterControls}
          </aside>

          {/* Right Content Area: Results info + Mentor Rows */}
          <div className="lg:col-span-9 space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
              <div className="text-xs font-semibold text-[var(--gray-600)]">
                Showing <span className="font-bold text-[var(--ink)]">{filteredMentors.length}</span> verified mentors
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Sheet Button */}
                <div className="lg:hidden">
                  <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                    <SheetTrigger asChild>
                      <button
                        type="button"
                        className="px-3.5 py-2 rounded-full border border-[var(--line)] bg-white text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5"
                      >
                        <SlidersHorizontal className="size-4" weight="bold" />
                        <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] bg-white p-6 overflow-y-auto">
                      <SheetHeader className="mb-6">
                        <SheetTitle className="text-base font-bold text-[var(--ink)]">Filters</SheetTitle>
                      </SheetHeader>
                      {filterControls}
                    </SheetContent>
                  </Sheet>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[var(--line)] rounded-full px-4 py-2 text-xs font-semibold text-[var(--ink)] outline-none"
                >
                  <option value="best_match">Best Match (Fair Rank)</option>
                  <option value="highest_rated">Highest Rated</option>
                  <option value="most_hours">Most Hours Taught</option>
                  <option value="fastest_response">Fastest Response</option>
                </select>
              </div>
            </div>

            {/* MENTOR LISTING: ROW/LIST LAYOUT */}
            {filteredMentors.length > 0 ? (
              <div className="bg-white border border-[var(--line)] rounded-[28px] overflow-hidden divide-y divide-[var(--line)]">
                {filteredMentors.map((m) => {
                  const initials = m.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
                  const stats = getMentorStats ? getMentorStats(m.id) : null;
                  const ratingCount = stats ? stats.reviewCount : m.ratingCount || 0;
                  const rating = stats && stats.reviewCount > 0 ? stats.rating : m.rating || 0;
                  const hoursTaught = stats ? stats.hoursTaught : m.hoursTaught || 0;
                  const isNew = m.isNew || !ratingCount;

                  return (
                    <div
                      key={m.id}
                      className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--snow)] transition-colors"
                    >
                      {/* Left: Avatar initials, Name, Department, Subjects as pills */}
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        <div className="size-12 rounded-full bg-[var(--green-900)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {initials}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-base text-[var(--ink)] truncate">
                              {m.name}
                            </h3>
                            <span className="text-xs text-[var(--gray-600)]">({m.department}, Year {m.year})</span>
                            {isNew && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[var(--mint)] text-[var(--green-900)] text-[10px] font-bold uppercase tracking-wider">
                                New
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(m.subjects || []).map((s) => {
                              const sName = getSubjectName(s);
                              return (
                                <span
                                  key={sName || String(s)}
                                  className="text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--line)] bg-[var(--snow)] text-[var(--gray-600)] font-medium"
                                >
                                  {sName}
                                </span>
                              );
                            })}
                          </div>

                          <p className="text-xs text-[var(--gray-600)] line-clamp-1 mt-2">
                            {m.bio}
                          </p>
                        </div>
                      </div>

                      {/* Right: Rating, Hours, Link "View profile" */}
                      <div className="flex items-center justify-between md:justify-end gap-5 text-xs text-[var(--ink)] shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[var(--line)]">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <div className="size-7 rounded-full bg-[var(--mint)] text-[var(--green-900)] flex items-center justify-center">
                            <Star className="size-3.5" weight="fill" />
                          </div>
                          <span>
                            {rating > 0 ? `${rating.toFixed(1)} (${ratingCount})` : 'New'}
                          </span>
                        </div>

                        <div className="hidden sm:flex items-center gap-1.5 text-[var(--gray-600)]">
                          <div className="size-7 rounded-full bg-[var(--snow)] text-[var(--ink)] flex items-center justify-center">
                            <Clock className="size-3.5" weight="bold" />
                          </div>
                          <span>{hoursTaught} hrs</span>
                        </div>

                        <Link
                          to={`/mentors/${m.id}`}
                          className="px-5 py-2.5 rounded-full bg-[var(--ink)] hover:bg-[var(--green-900)] text-white font-semibold transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>View profile</span>
                          <ArrowRight className="size-3.5" weight="bold" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="rounded-[28px] border border-[var(--line)] bg-white p-12 text-center space-y-4">
                <p className="text-sm text-[var(--gray-600)]">
                  No mentors match your selected filters.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 rounded-full bg-[var(--ink)] text-white text-xs font-semibold hover:bg-[var(--green-900)] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
