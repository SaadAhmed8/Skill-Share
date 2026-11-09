// src/data/seedReviews.js
/**
 * Deterministic seeded generator for mentor reviews and completed session logs.
 * No Math.random. Produces identical, reproducible data on every load.
 */

// 40 realistic Pakistani student names (first name + last initial)
export const REVIEWER_NAMES = [
  "Hira K.", "Ahmed R.", "Zubair S.", "Fatima M.", "Bilal T.",
  "Sana A.", "Hamza N.", "Ayesha B.", "Mustafa Q.", "Mariam D.",
  "Usman Z.", "Khadija F.", "Ali W.", "Zainab H.", "Farhan J.",
  "Nimra L.", "Taha C.", "Anum G.", "Saad P.", "Yusra V.",
  "Omar K.", "Mahnoor S.", "Danish R.", "Laiba A.", "Waqas N.",
  "Iqra T.", "Hassan M.", "Syeda B.", "Nabeel Q.", "Rameen H.",
  "Shoaib D.", "Eman Z.", "Fahad W.", "Hafsa F.", "Rehan J.",
  "Kinza L.", "Talha G.", "Bushra P.", "Adeel V.", "Zoya C."
];

// Subject-specific concrete comment templates (at least 8 distinct per subject)
// Highlighting concrete concepts, punctuality, clarity, and patience.
// NO em dashes or en dashes. 60 to 220 characters.
export const SUBJECT_COMMENTS = {
  Programming: [
    "Ayesha explained recursion base cases with clean stack drawings. Very patient and started right on time.",
    "The walkthrough on pointers and memory addresses cleared up weeks of confusion before our lab quiz.",
    "Loved the live coding demonstration. Breaking down nested loops into small helpers made syntax intuitive.",
    "Very punctual and clear. We traced memory allocation step by step and fixed all my segmentation faults.",
    "She walked me through function prototypes and pass by reference with great examples. Highly recommended.",
    "Clear, structured explanations of conditional logic and debugging. The session ran seamlessly from minute one.",
    "Extremely helpful breakdown of array manipulation and pointer arithmetic. Very calm and encouraging.",
    "Helped me write clean and modular code without overcomplicating things. Great pacing and punctuality."
  ],
  "Data Structures": [
    "Binary search trees and AVL rotations finally make complete sense. Excellent whiteboard diagrams.",
    "The explanation of linked list reversal and edge cases was crystal clear. Punctual and very thorough.",
    "We walked through graph adjacency lists and BFS traversal. Her patient approach made the theory click.",
    "Detailed breakdown of queue operations and stack applications. Highly recommended for exam prep.",
    "Pointers and dynamic memory in custom data structures were demystified in just one sixty minute session.",
    "Very structured approach to hash tables, collision resolution, and load factors. Extremely polite and prompt.",
    "The live trace of priority queues and min heaps saved my midterm grade. Great clarity and focus.",
    "Super clear comparison between arrays and linked lists for space complexity. Very punctual mentor."
  ],
  Algorithms: [
    "Dynamic programming state transitions became so much clearer after tracing the grid together.",
    "Very punctual and patient. We analyzed merge sort and quick sort recursion trees with zero rush.",
    "Greedy approaches vs dynamic programming explained with relatable real world examples. Outstanding guidance.",
    "Asymptotic notations and master theorem proofs were broken down methodically. Super helpful session.",
    "Detailed walkthrough of Dijkstra shortest path algorithm and heap integration. Very clear explanations.",
    "Helped me identify overlapping subproblems in divide and conquer problems. Thorough and well organized.",
    "Great session on time complexity analysis and recurrence relations. Arrived right on schedule.",
    "The step by step trace of binary search variants was concise and deeply practical. Five stars."
  ],
  Calculus: [
    "Integration by parts and tabular methods were explained with incredible clarity. Punctual and kind.",
    "Hamza made multivariable gradients and directional derivatives intuitive with 3D sketches.",
    "Chain rule shortcuts and implicit differentiation clicked immediately. Very structured explanations.",
    "Extremely patient mentor who walked through limits, continuity, and L Hopital rule step by step.",
    "We tackled partial fractions and improper integrals. The explanations were crisp and never rushed.",
    "Taylor series approximations and radius of convergence made simple. Started right on the agreed minute.",
    "Clear diagrams for volume of solids of revolution using disk and shell methods. Excellent guidance.",
    "Super clear derivation of vector fields and line integrals. Very attentive to every single question."
  ],
  Physics: [
    "Maryam broke down electromagnetic induction and Lenz law with hands on circuit sketches. Brilliant.",
    "Gauss law spherical surfaces and electric flux calculations made simple and intuitive. Very punctual.",
    "Kirchhoff junction rules across complex multi loop circuits were explained with unmatched patience.",
    "Clear explanation of rotational dynamics and moment of inertia. Answered every follow up question calmly.",
    "Work energy theorem and conservative forces demystified with clear diagrams. Excellent mentor.",
    "The session on wave interference and double slit optics was engaging and crystal clear throughout.",
    "Magnetic field equations and Biot Savart law solved systematically. Punctual and thoroughly prepared.",
    "Very patient explanation of harmonic motion and damping equations. Great support for our quiz."
  ],
  English: [
    "Danial gave sharp and actionable feedback on technical report writing and executive summaries.",
    "Very punctual and supportive. We restructured my proposal thesis statement and improved paragraph flow.",
    "Clear guidance on passive vs active voice in engineering documentation. Great communication skills.",
    "Helped me refine formal presentation speaking notes and citations without altering my authentic voice.",
    "Detailed review of grammar mechanics, transition phrases, and abstract conciseness. Very patient.",
    "Great advice on research synthesis and IEEE referencing standards. The session was deeply productive.",
    "Constructive critique on sentence variety and vocabulary for academic essays. Started promptly.",
    "He provided clear rubrics and demonstrated how to eliminate redundant phrasing from technical drafts."
  ],
  "Digital Logic": [
    "Karnaugh map grouping and don't care conditions were explained clearly. Very punctual and attentive.",
    "Usman drew truth tables and gate implementations for full adders with great clarity and patience.",
    "Sequential circuit design with D and JK flip flops finally clicked. Methodical and well paced.",
    "State machine diagrams and transition tables were simplified step by step. Highly effective session.",
    "Boolean algebra simplification rules demonstrated with clear before and after circuit schematics.",
    "Multiplexer and decoder architectures explained with concrete logic diagrams. Very helpful mentor.",
    "Punctual and patient. We debugged timing diagrams and setup times for synchronous counters.",
    "Crisp explanation of two complement arithmetic and overflow detection circuits. Outstanding support."
  ],
  Networks: [
    "Subnetting and CIDR prefix calculations became second nature after his step by step practice sheet.",
    "Clear breakdown of TCP three way handshake, flow control, and sequence numbers. Very punctual.",
    "We traced packet headers across the OSI model layers. His explanations were precise and patient.",
    "DNS resolution and DHCP lease allocation explained systematically with live terminal outputs.",
    "Routing protocols like OSPF and distance vector routing demystified. Great structure and timing.",
    "Very knowledgeable mentor who clarified socket programming concepts and port multiplexing.",
    "The difference between TCP sliding window and stop and wait protocols was made remarkably simple.",
    "Thorough explanation of network layer NAT and private IP ranges. Exactly what I needed for lab."
  ],
  Database: [
    "SQL joins, subqueries, and group by aggregations were explained with great interactive examples.",
    "Khadija explained Boyce Codd and 3rd normal forms with clean dependency diagrams. Very patient.",
    "Entity relationship modeling and cardinality constraints made simple and intuitive. Punctual mentor.",
    "Transaction ACID properties and concurrency control explained with clear lock tables. Great help.",
    "We practiced schema normalization step by step. Her patient explanations helped me ace the quiz.",
    "Indexing strategies and B tree lookups broken down clearly without any rush. Highly recommended.",
    "Very structured guidance on foreign keys, cascading deletes, and table constraints.",
    "Clear walk through of relational algebra expressions and query optimization. Started right on time."
  ],
  OS: [
    "Process synchronization, semaphores, and mutex locks explained with crystal clear thread diagrams.",
    "Virtual memory paging and page replacement algorithms made simple. Punctual and super patient.",
    "Deadlock avoidance with Banker algorithm traced methodically step by step. Outstanding session.",
    "CPU scheduling algorithms like Round Robin and priority queues compared with clear Gantt charts.",
    "File system inodes and directory allocation tables explained cleanly. Great focus and patience.",
    "Fork system calls and child process creation demystified with small C code snippets.",
    "Inter process communication using shared memory and pipes made intuitive. Very reliable mentor.",
    "Memory fragmentation and buddy allocation explained with practical illustrations. Great teacher."
  ]
};

// Map mentor subjects to a canonical subject group for review comment generation
function getCommentCategory(subjects) {
  const list = subjects || [];
  for (const s of list) {
    if (s.includes("Data Structure")) return "Data Structures";
    if (s.includes("Algorithm")) return "Algorithms";
    if (s.includes("Calculus") || s.includes("Algebra")) return "Calculus";
    if (s.includes("Physics") || s.includes("Electromagnetism")) return "Physics";
    if (s.includes("English") || s.includes("Writing") || s.includes("Communication")) return "English";
    if (s.includes("Digital Logic") || s.includes("Circuit")) return "Digital Logic";
    if (s.includes("Network")) return "Networks";
    if (s.includes("Database")) return "Database";
    if (s.includes("Operating")) return "OS";
    if (s.includes("Programming") || s.includes("Python")) return "Programming";
  }
  return "Programming";
}

// Deterministic linear congruential generator (LCG)
function createRng(seed = 123456789) {
  let state = seed;
  return function next() {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * Seed all reviews and matching completed sessions for approved mentors.
 * Guaranteed to match mentor reviewCount and stored rating within 0.05.
 */
export function generateSeedData(mentors) {
  const reviews = [];
  const completedSessions = [];

  // Anchor date: Nov 4, 2026. Last 8 months spread back to ~March 2026.
  const anchorTime = new Date("2026-11-04T12:00:00.000Z").getTime();
  const eightMonthsMs = 240 * 24 * 60 * 60 * 1000;

  mentors.forEach((mentor, mentorIndex) => {
    const count = mentor.reviewCount ?? mentor.ratingCount ?? 0;
    // Only approved mentors with reviewCount > 0 get reviews
    if (mentor.status !== "approved" || mentor.isNew || count <= 0) {
      return;
    }

    const targetRating = mentor.rating || 4.9;
    const rng = createRng(mentorIndex * 777 + count * 13);

    // Compute distribution of 5, 4, and 3 stars
    // Average must match mentor.rating within 0.05
    let bestDist = { n5: count, n4: 0, n3: 0, diff: 999 };
    for (let n3 = 0; n3 <= 2; n3++) {
      for (let n4 = 0; n4 <= count - n3; n4++) {
        const n5 = count - n3 - n4;
        const avg = (n5 * 5 + n4 * 4 + n3 * 3) / count;
        const diff = Math.abs(avg - targetRating);
        if (diff < bestDist.diff) {
          bestDist = { n5, n4, n3, diff };
        }
      }
    }

    // Build ratings array
    const ratings = [];
    for (let i = 0; i < bestDist.n5; i++) ratings.push(5);
    for (let i = 0; i < bestDist.n4; i++) ratings.push(4);
    for (let i = 0; i < bestDist.n3; i++) ratings.push(3);

    // Deterministic shuffle of ratings
    for (let i = ratings.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = ratings[i];
      ratings[i] = ratings[j];
      ratings[j] = tmp;
    }

    const primaryCat = getCommentCategory(mentor.subjects);
    const primaryTemplates = SUBJECT_COMMENTS[primaryCat] || SUBJECT_COMMENTS.Programming;
    // Fallback/secondary category if mentor has multiple subjects
    const secondaryCat = mentor.subjects && mentor.subjects[1] ? getCommentCategory([mentor.subjects[1]]) : "Programming";
    const secondaryTemplates = SUBJECT_COMMENTS[secondaryCat] || SUBJECT_COMMENTS.Programming;
    const pool = [...primaryTemplates, ...secondaryTemplates];

    const mentorReviews = [];
    const usedTexts = new Set();

    for (let i = 0; i < count; i++) {
      const reviewId = `rev-${mentor.id}-${i + 1}`;
      const sessionId = `s-done-${mentor.id}-${i + 1}`;
      const studentName = REVIEWER_NAMES[(mentorIndex * 5 + i * 3) % REVIEWER_NAMES.length];
      const studentId = `student-${(i % 12) + 1}`;

      // Pick unique comment text
      let baseText = pool[i % pool.length];
      let commentText = baseText;
      let variant = 1;
      while (usedTexts.has(commentText)) {
        if (variant === 1) {
          commentText = `${baseText} Highly recommended.`;
        } else if (variant === 2) {
          commentText = `${baseText} Would definitely book again.`;
        } else {
          commentText = `${baseText} Appreciate the clear guidance.`;
        }
        variant++;
      }
      usedTexts.add(commentText);

      // Distribute date over last 8 months deterministically
      const stepFraction = (i + 0.5) / count;
      const reviewTime = anchorTime - Math.floor(stepFraction * eightMonthsMs) + Math.floor(rng() * 86400000);
      const createdAt = new Date(reviewTime).toISOString();

      const rating = ratings[i];

      const reviewObj = {
        id: reviewId,
        sessionId,
        mentorId: mentor.id,
        studentId,
        studentName,
        rating,
        comment: commentText,
        createdAt,
      };

      mentorReviews.push(reviewObj);

      // Create matching completed session log
      const subject = mentor.subjects && mentor.subjects.length > 0
        ? mentor.subjects[i % mentor.subjects.length]
        : "General Mentoring";

      completedSessions.push({
        id: sessionId,
        studentId,
        studentName,
        studentEmail: `${studentName.toLowerCase().replace(/[^a-z]/g, '')}@neduet.edu.pk`,
        mentorId: mentor.id,
        mentorName: mentor.name,
        mentorEmail: mentor.email,
        subject,
        preferredSlot: mentor.availability?.[0] || "Mon 6:00 - 8:00 PM",
        description: `Completed peer tutoring in ${subject}.`,
        status: "completed",
        confirmedTime: createdAt,
        completedAt: createdAt,
        durationMinutes: 60,
        meetingLink: `https://meet.google.com/skl-${mentor.id}-${i + 1}`,
        createdAt,
        feedbackGiven: true,
        messages: [],
      });
    }

    reviews.push(...mentorReviews);
  });

  return { reviews, completedSessions };
}

