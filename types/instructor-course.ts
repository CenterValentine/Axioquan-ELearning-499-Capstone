// src/types/instructor-course-overview.ts
export interface InstructorCourseOverview {
  id: number;                  // courses.id
  title: string;               // courses.title
  description: string;         // short/plaintext version of description_html
  students: number;            // COUNT(*) from enrollments
  rating: number;              // AVG(...) from reviews (mock for now)
  reviews: number;             // COUNT(...) from reviews (mock for now)
  status: 'Draft' | 'Published' | 'Archived';
  thumbnail: 'blue' | 'purple' | 'green' | string;  // UI color key
  modules: number;             // COUNT(*) modules per course
  lessons: number;             // COUNT(*) lessons per course
  lastUpdated: string;         // formatted courses.updated_at
}