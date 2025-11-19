// src/mocks/my-courses.mock.ts

import {Module} from '@/types/module'

export type InProgressCourse = Module & {
  progress: number;
  status: 'in-progress';
};

export type CompletedCourse = Module & {
  progress: number;
  status: 'completed';
  completedDate: string;
};

export const enrolledCoursesMock: InProgressCourse[] = [
  {
    id: '1',
    title: 'Introduction to Python Programming',
    description:
      'Master the fundamentals of Python through interactive coding challenges and real-world projects.',
    duration: '6 weeks',
    difficulty: 'Beginner',
    category: 'Programming',
    progress: 65,
    status: 'in-progress',
    lessons: [],
  },
  {
    id: '2',
    title: 'Modern Web Design Principles',
    description:
      'Learn to create beautiful, user-friendly websites with modern design techniques and best practices.',
    duration: '4 weeks',
    difficulty: 'Intermediate',
    category: 'Design',
    progress: 40,
    status: 'in-progress',
    lessons: [],
  },
  {
    id: '3',
    title: 'Data Structures and Algorithms',
    description:
      'Deep dive into essential data structures and algorithms to solve complex programming challenges.',
    duration: '8 weeks',
    difficulty: 'Advanced',
    category: 'Programming',
    progress: 25,
    status: 'in-progress',
    lessons: [],
  },
];

export const completedCoursesMock: CompletedCourse[] = [
  {
    id: '4',
    title: 'JavaScript Basics',
    description: 'Learn the fundamentals of JavaScript programming.',
    duration: '4 weeks',
    difficulty: 'Beginner',
    category: 'Programming',
    progress: 100,
    status: 'completed',
    completedDate: 'March 15, 2024',
    lessons: [],
  },
  {
    id: '5',
    title: 'HTML & CSS Fundamentals',
    description: 'Master the building blocks of web development.',
    duration: '3 weeks',
    difficulty: 'Beginner',
    category: 'Programming',
    progress: 100,
    status: 'completed',
    completedDate: 'March 1, 2024',
    lessons: [],
  },
];