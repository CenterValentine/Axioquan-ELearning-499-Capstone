// src/mocks/instructor-courses.mock.ts

export interface InstructorCourseOverview {
  id: number;
  title: string;
  description: string;
  students: number;
  rating: number;
  reviews: number;
  status: 'Published' | 'Draft';
  thumbnail: 'blue' | 'purple' | 'green' | string;
  modules: number;
  lessons: number;
  lastUpdated: string;
}

export const instructorCoursesMock: InstructorCourseOverview[] = [
  {
    id: 1,
    title: 'Full-Stack Web Development Masterclass',
    description: 'Learn to build modern web applications from scratch',
    students: 124,
    rating: 4.9,
    reviews: 87,
    status: 'Published',
    thumbnail: 'blue',
    modules: 6,
    lessons: 24,
    lastUpdated: '3 days ago',
  },
  {
    id: 2,
    title: 'Introduction to Python Programming',
    description: 'Master the fundamentals of Python programming',
    students: 89,
    rating: 4.8,
    reviews: 62,
    status: 'Published',
    thumbnail: 'purple',
    modules: 4,
    lessons: 12,
    lastUpdated: '1 week ago',
  },
  {
    id: 3,
    title: 'Modern Web Design Principles',
    description: 'Create beautiful and functional user interfaces',
    students: 67,
    rating: 4.6,
    reviews: 45,
    status: 'Published',
    thumbnail: 'green',
    modules: 3,
    lessons: 8,
    lastUpdated: '5 days ago',
  }
];