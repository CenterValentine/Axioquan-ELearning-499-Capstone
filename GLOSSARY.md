# AxioQuan E-Learning Platform - Domain Glossary

## Authentication & Authorization

**Account**  
An OAuth provider account linked to a user, storing authentication tokens and provider-specific data for social login integration.

**Role**  
A permission set defining user capabilities (student, instructor, admin) with hierarchical levels and granular permissions stored as JSON.

**RoleRequest**  
A user's request to upgrade their role (e.g., student to instructor), including justification, qualifications, and admin review status.

**Session**  
An active user authentication session stored in database and cookies, containing user ID, roles, expiration time, and device information.

**UserRole**  
A many-to-many relationship between users and roles, with one role marked as primary and optional expiration dates for temporary assignments.

**VerificationToken**  
A time-limited token used for email verification and password reset operations, marked as used after consumption.

---

## User Management

**User**  
The core user entity containing authentication credentials, profile information, account status, and basic metadata like timezone and locale.

**UserProfile**  
Extended user profile data including social links, skills, portfolio URLs, learning goals, and professional information beyond basic user data.

---

## Course Structure

**Course**  
A complete learning program created by an instructor, containing modules, pricing, metadata, statistics, and publication status.

**Module**  
A logical grouping of lessons within a course, organized by order index with learning objectives and estimated duration.

**Lesson**  
An individual learning unit within a module, supporting multiple types (video, text, quiz, assignment) with content, media URLs, and completion criteria.

**Category**  
A hierarchical classification system for organizing courses, with parent-child relationships and descriptive metadata.

**Tag**  
A flexible labeling system for courses, allowing multiple tags per course for enhanced searchability and filtering.

**CourseTag**  
The many-to-many relationship between courses and tags, tracking usage counts and featured status.

---

## Learning & Progress

**Enrollment**  
The relationship between a user and a course, tracking enrollment status, progress percentage, completed lessons, and time spent.

**Progress**  
Learning progress data aggregated at the enrollment level, including completion percentage, completed lesson IDs, and total time invested.

**ProgressRecord**  
Individual lesson completion records that aggregate into overall course progress, tracking completion status and time spent per lesson.

---

## Assessments

**Assessment**  
A type of lesson that evaluates student knowledge through questions, supporting multiple question types (multiple-choice, true/false, essay, code).

**Quiz**  
An interactive assessment lesson type with questions, correct answers, scoring, passing thresholds, and time limits.

**Question**  
An individual assessment item within a quiz, with type-specific data (options, correct answer, points, explanation).

**Answer**  
A student's response to a quiz question, stored with the question ID and evaluated against correct answers for scoring.

---

## Social Features

**Review**  
A user's rating and written feedback for a course, including star rating (1-5), comment text, and timestamps.

**ReviewReply**  
A nested comment thread on reviews, allowing users and instructors to respond to reviews with parent-child relationships.

**ReviewReaction**  
User interactions on reviews (like/dislike), tracked per user to prevent duplicate reactions and aggregated for display.

---

## Communication

**Notification**  
A system-generated message alerting users to events (role updates, course milestones, new messages), delivered via Server-Sent Events.

**Message**  
Direct communication between users (planned feature), supporting one-on-one conversations and group messaging.

---

## Media & Content

**LessonTranscript**  
Text transcription of video/audio lessons, supporting multiple languages with auto-generation flags and confidence scores.

**Certificate**  
A digital certificate awarded upon course completion, generated when a student reaches 100% progress and certificate_available is true.

---

## System Concepts

**Server-Sent Events (SSE)**  
A real-time communication protocol for pushing notifications from server to client, maintaining persistent connections for live updates.

**Session Cookie**  
An HTTP-only cookie storing encrypted session data (user ID, roles, expiration) for authentication state management.

**Primary Role**  
The main role that determines a user's dashboard view and default permissions, with users able to have multiple roles but only one primary.

**Access Type**  
A course setting defining enrollment requirements (open, paid, approval-required) controlling how students can join courses.

**Difficulty Level**  
A course classification (beginner, intermediate, advanced, all-levels) helping students find appropriately challenging content.

**Content Type**  
A course categorization (video-based, text-based, mixed) indicating the primary delivery method for course materials.

**Enrollment Status**  
The state of a user's enrollment (active, completed, cancelled, expired) tracked in the enrollment record.

**Publishing Status**  
A course's visibility state (published, draft, archived) controlling whether courses appear in public listings and are accessible to students.

