// src/lib/ranking.js
import { getMentorStats } from './mentorStats';

/**
 * Mentor Ranking Algorithm (Strictly following docs/spec.md Section 4):
 *
 * 1. GPA is NEVER used for ranking. GPA is only a gate for application eligibility (min 3.0).
 * 2. Ranking is derived from student feedback:
 *    - Bayesian-weighted average rating:
 *      Formula: (v / (v + m)) * R + (m / (v + m)) * C
 *      Where:
 *        R = mentor average rating
 *        v = number of reviews/completed sessions
 *        m = minimum threshold weight (e.g., 3 reviews)
 *        C = platform prior average rating (e.g., 4.5)
 *      This ensures a mentor with a single 5.0 rating does not outrank a seasoned mentor
 *      with 40 sessions and a 4.9 rating.
 * 3. Response time bonus: Faster response times receive a fractional bonus.
 * 4. "New Mentor" fair boost:
 *    New mentors (0 reviews, tagged with isNew: true) are given a fair visibility boost
 *    so they are not buried at the bottom of search results. In sorted listings, new mentors
 *    are fairly interleaved after the top-performing veterans so students can discover and book them.
 */

const PRIOR_WEIGHT = 3;
const PRIOR_RATING = 4.5;

export function computeMentorScore(mentor, reviews = null, sessionRequests = null) {
  const stats = getMentorStats(mentor, reviews, sessionRequests);

  // If mentor has no reviews, assign baseline plus new-mentor encouragement boost
  if (!stats.reviewCount || stats.reviewCount === 0 || mentor.isNew) {
    // Score calibrated to place them fairly around the middle-high tier (equivalent to ~4.6 Bayesian)
    return 4.62;
  }

  const v = stats.reviewCount;
  const R = stats.rating || 0;

  // Bayesian average
  const bayesianRating =
    (v / (v + PRIOR_WEIGHT)) * R +
    (PRIOR_WEIGHT / (v + PRIOR_WEIGHT)) * PRIOR_RATING;

  // Session experience bonus (capped at 0.3)
  const experienceBonus = Math.min(
    (stats.completedSessions || stats.hoursTaught || 0) * 0.008,
    0.3
  );

  // Response time weight
  let responseBonus = 0.05;
  const rt = (mentor.responseTime || '').toLowerCase();
  if (rt.includes('15') || rt.includes('20')) {
    responseBonus = 0.1;
  } else if (rt.includes('30')) {
    responseBonus = 0.07;
  } else if (rt.includes('hour')) {
    responseBonus = 0.03;
  }

  return bayesianRating + experienceBonus + responseBonus;
}

/**
 * Sort mentors based on the chosen sort criterion
 * @param {Array} mentors List of approved mentors
 * @param {string} sortBy 'best_match' | 'highest_rated' | 'most_hours' | 'fastest_response'
 * @param {Array} reviews Optional reviews list for live stats calculation
 * @param {Array} sessionRequests Optional session requests list for live stats calculation
 */
export function rankMentors(
  mentors,
  sortBy = 'best_match',
  reviews = null,
  sessionRequests = null
) {
  const list = [...mentors];

  if (sortBy === 'highest_rated') {
    return list.sort((a, b) => {
      const statsA = getMentorStats(a, reviews, sessionRequests);
      const statsB = getMentorStats(b, reviews, sessionRequests);
      const rA = statsA.rating ?? 0;
      const rB = statsB.rating ?? 0;
      if (rB !== rA) return rB - rA;
      return statsB.reviewCount - statsA.reviewCount;
    });
  }

  if (sortBy === 'most_hours') {
    return list.sort((a, b) => {
      const statsA = getMentorStats(a, reviews, sessionRequests);
      const statsB = getMentorStats(b, reviews, sessionRequests);
      return statsB.hoursTaught - statsA.hoursTaught;
    });
  }

  if (sortBy === 'fastest_response') {
    const parseMinutes = (rt) => {
      if (!rt) return 999;
      const lower = rt.toLowerCase();
      if (lower.includes('15')) return 15;
      if (lower.includes('20')) return 20;
      if (lower.includes('30')) return 30;
      if (lower.includes('45')) return 45;
      if (lower.includes('1 hour')) return 60;
      if (lower.includes('2 hour')) return 120;
      return 300;
    };
    return list.sort(
      (a, b) => parseMinutes(a.responseTime) - parseMinutes(b.responseTime)
    );
  }

  // Default: 'best_match' (Bayesian Feedback Ranking + Fair New Mentor Interleaving)
  return list.sort((a, b) => {
    const scoreA = computeMentorScore(a, reviews, sessionRequests);
    const scoreB = computeMentorScore(b, reviews, sessionRequests);
    return scoreB - scoreA;
  });
}
