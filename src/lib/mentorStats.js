// src/lib/mentorStats.js

/**
 * Single source of truth for mentor rating, review count, volunteer hours,
 * students taught, and completed sessions.
 *
 * @param {Object} mentor - Mentor object
 * @param {Array} reviews - All reviews list (optional)
 * @param {Array} sessionRequests - All session requests list (optional)
 * @returns {{ rating: number|null, reviewCount: number, hoursTaught: number, studentsTaught: number, completedSessions: number }}
 */
export function getMentorStats(mentor, reviews = null, sessionRequests = null) {
  if (!mentor) {
    return {
      rating: null,
      reviewCount: 0,
      hoursTaught: 0,
      studentsTaught: 0,
      completedSessions: 0,
    };
  }

  const storedReviewCount = Number(mentor.reviewCount ?? mentor.ratingCount ?? 0);
  const storedRating = Number(mentor.rating ?? 0);
  const storedHours = Number(mentor.hoursTaught ?? mentor.hoursCompleted ?? 0);

  // Filter reviews for this mentor if reviews array is provided
  const mentorReviews = Array.isArray(reviews)
    ? reviews.filter((r) => r && r.mentorId === mentor.id)
    : [];

  // Filter completed sessions for this mentor if sessionRequests array is provided
  const mentorCompletedSessions = Array.isArray(sessionRequests)
    ? sessionRequests.filter(
        (s) => s && s.mentorId === mentor.id && s.status === 'completed'
      )
    : [];

  // 1. reviewCount: number of reviews linked to the mentor, or stored mentor.reviewCount if reviews list is not loaded yet (or empty when stored > 0)
  const reviewCount =
    mentorReviews.length > 0 ? mentorReviews.length : storedReviewCount;

  // 2. hoursTaught: larger of stored mentor.hoursTaught and hours computed from completed sessions
  const computedHours = mentorCompletedSessions.reduce(
    (acc, s) => acc + (Number(s.durationMinutes) || 60) / 60,
    0
  );
  const hoursTaught = Math.max(storedHours, Math.round(computedHours));

  // 3. rating: average of those reviews rounded to 1 decimal, or stored mentor.rating if no reviews array items but reviewCount > 0.
  // If mentor has no reviews (reviewCount === 0) and no hours (hoursTaught === 0), return rating null.
  // Never return a rating when reviewCount === 0.
  let rating = null;
  if (mentorReviews.length > 0) {
    const sum = mentorReviews.reduce(
      (acc, r) => acc + (Number(r.rating) || 0),
      0
    );
    rating = Number((sum / mentorReviews.length).toFixed(1));
  } else if (reviewCount > 0 && storedRating > 0) {
    rating = Number(storedRating.toFixed(1));
  }

  // 4. completedSessions & studentsTaught
  const completedSessions = Math.max(
    mentorCompletedSessions.length,
    Number(mentor.sessionsCount || 0),
    reviewCount
  );

  const uniqueStudents = new Set(
    mentorCompletedSessions.map((s) => s.studentId).filter(Boolean)
  );
  const studentsTaught =
    uniqueStudents.size > 0
      ? uniqueStudents.size
      : reviewCount > 0
      ? Math.max(1, Math.round(reviewCount * 0.8))
      : 0;

  return {
    rating,
    reviewCount,
    hoursTaught,
    studentsTaught,
    completedSessions,
  };
}

