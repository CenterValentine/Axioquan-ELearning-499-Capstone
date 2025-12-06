# Student Journey Through AxioQuan Platform

This document narrates the complete flow of a student's experience from login to certificate completion, with references to the specific files and API routes involved.

---

## 1. Student Logs In

### User Action
The student navigates to `/login` and enters their email and password.

### Frontend Flow
**File: `src/app/(auth)/login/page.tsx`**  
The login page renders the login form component.

**File: `src/components/auth/login-form.tsx`**  
- The form captures email and password inputs
- On submit, it calls `loginWithSession()` from `lib/auth/actions.ts`
- Shows loading state and handles success/error responses
- On success, redirects to `/dashboard` using Next.js router

### Backend Flow
**File: `lib/auth/actions.ts` → `loginUser()` function**  
1. Queries database for user by email: `SELECT u.*, ARRAY_AGG(r.name) AS roles, ... FROM users u WHERE u.email = ${email}`
2. Verifies password using `verifyPassword()` from `lib/auth/password.ts` (bcrypt comparison)
3. Updates `last_login` timestamp in users table
4. Builds `AuthUser` object with user data and roles (excluding password)
5. Returns success response with user data

**File: `lib/auth/actions.ts` → `loginWithSession()` function**  
1. Calls `loginUser()` to authenticate
2. If successful, calls `createSession()` from `lib/auth/session.ts`
3. `createSession()` stores session data in HTTP-only cookie named `axioquan-user`
4. Cookie contains: `userId`, `email`, `name`, `image`, `roles[]`, `primaryRole`, `expires` (1 hour from now)
5. Redirects to dashboard

### Session Management
**File: `lib/auth/session.ts`**  
- `createSession()`: Sets HTTP-only cookie with session data
- `getSession()`: Reads and validates session cookie on subsequent requests
- Session expires after 1 hour, auto-refreshes if user is active within last 15 minutes

### Result
Student is authenticated, session cookie is set, and they're redirected to `/dashboard`.

---

## 2. Student Enrolls in a Course

### User Action
Student browses courses, clicks on a course, views the course detail page, and clicks "Enroll Now".

### Frontend Flow
**File: `src/app/courses/[slug]/page.tsx`**  
- Server component that loads course data by slug
- Calls `getCourseBySlugAction()` and `getCourseCurriculumAction()` from `lib/courses/actions.ts`
- Checks enrollment status via `checkEnrollmentAction()`
- Renders course detail page with hero, instructor section, and curriculum

**File: `src/components/courses/CourseEnrollmentCard.tsx`**  
- Displays enrollment button and course pricing
- On "Enroll Now" click:
  1. Calls `checkAuthStatus()` to verify user is logged in
  2. If not authenticated, redirects to `/login?redirect=/courses/${slug}`
  3. If authenticated, calls `createEnrollmentAction(courseId)` from `lib/courses/actions.ts`
  4. Shows loading state and toast notifications
  5. Updates local state to reflect enrollment

### Backend Flow
**File: `lib/courses/actions.ts` → `createEnrollmentAction()`**  
1. Calls `requireAuth()` to verify session exists
2. Fetches course by ID using `getCourseById()` from `lib/db/queries/courses.ts`
3. Validates course is published
4. Extracts `price_cents` and `access_type` from course
5. Calls `createEnrollment()` from `lib/db/queries/enrollments.ts`

**File: `lib/db/queries/enrollments.ts` → `createEnrollment()`**  
1. Checks if enrollment already exists (reactivates if cancelled)
2. Creates new enrollment record:
   ```sql
   INSERT INTO enrollments (
     user_id, course_id, enrolled_price_cents, access_type,
     status, progress_percentage, total_lessons, completed_lessons
   ) VALUES (
     ${userId}, ${courseId}, ${priceCents}, ${accessType},
     'active', 0, ${total_lessons}, 0
   )
   ```
3. Updates course's `enrolled_students_count` counter
4. Returns enrollment object with success status

### Database Changes
- New row in `enrollments` table linking user to course
- `progress_percentage` initialized to 0
- `completed_lessons` initialized to empty array
- `status` set to `'active'`
- Course's `enrolled_students_count` incremented

### Result
Student is enrolled, enrollment record created, and UI updates to show "Continue Learning" button.

---

## 3. Student Watches a Lesson

### User Action
Student navigates to enrolled course, selects a module, clicks on a lesson, and watches the video content.

### Frontend Flow
**File: `src/app/courses/learn/[id]/page.tsx`**  
- Server component that loads course curriculum
- Calls `getCourseCurriculumAction(courseId)` to fetch modules and lessons
- Renders `CourseLearningPage` component with curriculum data

**File: `src/components/courses/course-learning.tsx`**  
- Displays course curriculum with modules and lessons
- Tracks which lessons are completed (client-side state)
- When student clicks a lesson, navigates to lesson player

**File: `src/app/courses/watch/[courseId]/[lessonId]/page.tsx`**  
- Server component that verifies authentication via `getSession()`
- Loads lesson data and renders `VideoPlayerPage` component

**File: `src/components/courses/video-player.tsx`**  
- Displays video player interface with controls
- Shows lesson title, description, and video content
- Tracks playback progress (currently mock data)
- Provides bookmarking functionality
- Has "Mark as Complete" button that calls lesson completion handler

### Backend Flow
**File: `lib/courses/curriculum-actions.ts` → `getCourseCurriculumAction()`**  
1. Calls `getCourseModules()` from `lib/db/queries/curriculum.ts`
2. Fetches modules with nested lessons using SQL aggregation:
   ```sql
   SELECT m.*, json_agg(l.*) as lessons
   FROM modules m
   LEFT JOIN lessons l ON l.module_id = m.id
   WHERE m.course_id = ${courseId}
   ORDER BY m.order_index, l.order_index
   ```
3. Returns curriculum structure with modules and lessons

**File: `lib/db/queries/curriculum.ts` → `getLessonById()`**  
- Fetches individual lesson data including:
  - Video URL, duration, thumbnail
  - Content HTML, transcripts
  - Lesson type (video, text, quiz, etc.)
  - Completion criteria and passing score

### Progress Tracking (Current Implementation)
**Note**: Lesson completion tracking is partially implemented. The UI tracks completion client-side, but server-side persistence needs to be connected.

**Planned Flow** (when fully implemented):
1. When student marks lesson complete, call server action
2. Update `enrollments.completed_lessons` array to include lesson ID
3. Recalculate `enrollments.progress_percentage` based on completed lessons
4. Update `enrollments.last_accessed_at` timestamp
5. If all lessons complete, set `enrollments.status` to `'completed'`

### Result
Student watches lesson content, progress is tracked (client-side), and they can navigate to next lesson.

---

## 4. Student Completes a Quiz

### User Action
Student reaches a quiz-type lesson, answers questions, submits the quiz, and receives their score.

### Frontend Flow
**File: `src/app/courses/quiz/[id]/page.tsx`**  
- Server component that verifies authentication
- Renders `QuizPage` component with quiz ID

**File: `src/components/courses/quiz-page.tsx`**  
- Displays quiz interface with multiple stages:
  1. **Intro Stage**: Shows quiz title, description, time limit, passing score
  2. **Quiz Stage**: Displays questions one at a time with navigation
  3. **Results Stage**: Shows score, percentage, pass/fail status, explanations
- Supports multiple question types:
  - Multiple choice
  - True/false
  - Short answer
  - Essay
  - Code
- Tracks user answers in state
- Implements timer functionality (countdown from time limit)
- Calculates score by comparing answers to correct answers
- Shows detailed results with correct/incorrect indicators

### Current Implementation Status
**Note**: Quiz functionality currently uses mock data. The component is fully functional UI-wise, but database integration is pending.

**Planned Backend Flow** (when fully implemented):
1. Fetch quiz questions from database (stored in lesson content or separate quiz table)
2. Store student answers in database
3. Calculate score server-side
4. Update lesson completion status if passing score achieved
5. Update enrollment progress

### Quiz Data Structure (Mock)
```typescript
interface Quiz {
  id: string
  title: string
  questions: Question[]
  timeLimit: number
  passingScore: number
}

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay" | "code"
  question: string
  options?: string[]
  correctAnswer: string | string[]
  points: number
  explanation?: string
}
```

### Result
Student completes quiz, receives score and feedback, and quiz completion updates their progress (when backend is connected).

---

## 5. Student Receives a Certificate

### User Action
Student completes all lessons in a course (reaches 100% progress), and a certificate becomes available for download.

### Progress Completion Flow
**File: `lib/db/queries/enrollments.ts`**  
When all lessons are completed:
1. `progress_percentage` reaches 100
2. `enrollments.status` changes from `'active'` to `'completed'`
3. `enrollments.completed_at` timestamp is set
4. System checks if `courses.certificate_available` is `true`

### Certificate Generation (Planned Implementation)
**Note**: Certificate generation is referenced in the codebase but not fully implemented. The following describes the intended flow:

**File: `src/app/dashboard/certificates/page.tsx`**  
- Displays list of earned certificates for student
- Shows certificate preview and download option

**File: `src/components/dashboard/student-certificates-page.tsx`**  
- Renders certificate cards with course name, completion date
- Provides download/view certificate functionality

**Planned API Route: `src/app/api/certificates/[id]/route.ts`**  
- Generates PDF certificate with:
  - Student name
  - Course title
  - Completion date
  - Certificate ID (for verification)
  - Instructor signature/logo
- Returns PDF file for download

**Planned Database Table: `certificates`**  
```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  enrollment_id UUID REFERENCES enrollments(id),
  certificate_number VARCHAR UNIQUE,
  issued_at TIMESTAMP,
  status VARCHAR, -- 'issued', 'revoked'
  pdf_url VARCHAR,
  verification_code VARCHAR
)
```

### Certificate Availability Check
**File: `lib/db/queries/courses.ts`**  
- Course must have `certificate_available = true`
- Student must have `enrollments.progress_percentage = 100`
- Student must have `enrollments.status = 'completed'`

### Notification Flow
**File: `lib/sse/server-events.ts`**  
When certificate becomes available:
1. System triggers `course_completed` event
2. SSE manager sends notification to student's connected clients
3. Client receives event via `useServerEvents()` hook
4. UI shows toast notification: "Congratulations! Your certificate is ready"

**File: `hooks/use-server-events.ts`**  
- Listens for `course_completed` events
- Updates UI when certificate is available
- Triggers page refresh to show new certificate

### Current Implementation Status
- Certificate UI components exist (`student-certificates-page.tsx`)
- Certificate availability is checked in dashboard queries
- Certificate generation logic is not yet implemented
- Database table may not exist (code has try/catch fallbacks)

### Result
Student completes course, certificate becomes available, notification is sent, and student can view/download certificate from dashboard.

---

## Summary: Complete Data Flow

```
1. LOGIN
   Client: login-form.tsx
   → Server Action: lib/auth/actions.ts::loginUser()
   → Database: SELECT users + roles
   → Session: lib/auth/session.ts::createSession()
   → Cookie: HTTP-only session cookie set
   → Redirect: /dashboard

2. ENROLLMENT
   Client: CourseEnrollmentCard.tsx
   → Server Action: lib/courses/actions.ts::createEnrollmentAction()
   → Database Query: lib/db/queries/enrollments.ts::createEnrollment()
   → Database: INSERT INTO enrollments (progress: 0%)
   → UI Update: Enrollment status changed

3. LESSON VIEWING
   Client: video-player.tsx
   → Server Component: courses/watch/[courseId]/[lessonId]/page.tsx
   → Database Query: lib/db/queries/curriculum.ts::getLessonById()
   → Database: SELECT lesson data
   → UI: Video player renders with lesson content
   → Progress: Client-side tracking (server persistence pending)

4. QUIZ COMPLETION
   Client: quiz-page.tsx
   → Mock Data: Quiz questions and answers
   → Calculation: Score computed client-side
   → Progress: Updates enrollment progress (when backend connected)
   → Database: UPDATE enrollments SET completed_lessons, progress_percentage

5. CERTIFICATE
   Trigger: progress_percentage = 100%
   → Database: UPDATE enrollments SET status = 'completed'
   → Certificate Generation: (Planned) Generate PDF
   → Database: INSERT INTO certificates
   → Notification: SSE event 'course_completed'
   → Client: useServerEvents() receives notification
   → UI: Certificate available in dashboard
```

---

## Key Files Reference

### Authentication
- `src/app/(auth)/login/page.tsx` - Login page
- `src/components/auth/login-form.tsx` - Login form component
- `lib/auth/actions.ts` - Login/logout server actions
- `lib/auth/session.ts` - Session management
- `lib/auth/password.ts` - Password hashing/verification

### Enrollment
- `src/app/courses/[slug]/page.tsx` - Course detail page
- `src/components/courses/CourseEnrollmentCard.tsx` - Enrollment UI
- `lib/courses/actions.ts::createEnrollmentAction()` - Enrollment server action
- `lib/db/queries/enrollments.ts::createEnrollment()` - Enrollment database query

### Learning
- `src/app/courses/learn/[id]/page.tsx` - Course learning interface
- `src/app/courses/watch/[courseId]/[lessonId]/page.tsx` - Lesson player page
- `src/components/courses/course-learning.tsx` - Learning UI component
- `src/components/courses/video-player.tsx` - Video player component
- `lib/courses/curriculum-actions.ts` - Curriculum server actions
- `lib/db/queries/curriculum.ts` - Curriculum database queries

### Assessments
- `src/app/courses/quiz/[id]/page.tsx` - Quiz page
- `src/components/courses/quiz-page.tsx` - Quiz component

### Certificates
- `src/app/dashboard/certificates/page.tsx` - Certificates page
- `src/components/dashboard/student-certificates-page.tsx` - Certificate UI
- `lib/sse/server-events.ts` - Notification system
- `hooks/use-server-events.ts` - Real-time event hook

### API Routes
- `src/app/api/auth/status/route.ts` - Authentication status check
- `src/app/api/courses/[id]/route.ts` - Course operations
- `src/app/api/student/progress/route.ts` - Student progress data
- `src/app/api/sse/route.ts` - Server-Sent Events endpoint

