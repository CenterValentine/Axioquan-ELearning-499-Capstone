# AxioQuan E-Learning Platform

A comprehensive, full-stack e-learning platform built with Next.js 16 and React 19, designed to support multi-role users (students, instructors, and administrators) in creating, managing, and consuming educational content.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)

## 🎯 Features

### For Students
- **Course Discovery**: Browse courses by category, search, and filter by tags
- **Learning Experience**: 
  - Structured course content with modules and lessons
  - Multiple lesson types: Video, Text, Document, Quiz, Code, Assignment, Audio, Interactive
  - Progress tracking and completion certificates
  - Bookmarking and note-taking capabilities
- **Assessments**: 
  - Interactive quizzes with multiple question types
  - Code lessons with syntax highlighting and execution
  - Assignment submissions
- **Social Features**: 
  - Course reviews and ratings
  - Reactions and replies to reviews
  - Discussion forums
- **Real-time Notifications**: Server-Sent Events for instant updates
- **Certificates**: Earn completion certificates upon course completion

### For Instructors
- **Course Management**: 
  - Create and edit courses with rich content
  - Upload videos, documents, and media via Cloudinary
  - Set pricing (free, premium, trial)
  - Publish/unpublish courses
- **Curriculum Builder**: 
  - Organize content into modules and lessons
  - Support for multiple lesson types
  - Drag-and-drop reordering
  - Preview functionality
- **Code Lessons**: 
  - Interactive code editor with Monaco Editor
  - Multiple programming languages (JavaScript, Python, TypeScript, etc.)
  - Test case management
  - Starter code and instructions
- **Quiz Builder**: 
  - Multiple question types (Multiple Choice, True/False, Short Answer, Essay, Code)
  - Time limits and passing scores
  - Retake options
- **Analytics**: 
  - Student enrollment tracking
  - Progress monitoring
  - Course performance metrics
- **Earnings Dashboard**: Track course revenue and earnings

### For Administrators
- **User Management**: 
  - View and manage all users
  - Role assignment and upgrades
  - Review role upgrade requests
- **Content Moderation**: 
  - Manage categories and tags
  - Oversee course content
- **System Maintenance**: 
  - Database cleanup utilities
  - System health monitoring

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Component Library**: shadcn/ui (59+ components built on Radix UI)
- **State Management**: Zustand (client state) + Server Components
- **Form Handling**: React Hook Form with Zod validation
- **Code Editor**: Monaco Editor (VS Code editor)
- **Markdown**: react-markdown with remark-gfm

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes + Server Actions
- **Database**: PostgreSQL (Neon serverless)
- **Media Storage**: Cloudinary
- **Email**: Nodemailer
- **Real-time**: Server-Sent Events (SSE)
- **Authentication**: Cookie-based sessions (HTTP-only)

### Infrastructure
- **Database**: Neon PostgreSQL (serverless, connection pooling)
- **Media CDN**: Cloudinary
- **Package Manager**: pnpm
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 9.12.1+
- PostgreSQL database (Neon recommended)
- Cloudinary account (for media storage)
- SMTP server (for email functionality)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Axioquan-ELearning-499-Capstone
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
AUTH_SECRET=your-secret-key-here
# Generate with: node generate-secret.js

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@axioquan.com

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

1. Create a PostgreSQL database (Neon recommended for serverless)
2. Run your database migrations/schema setup
3. Update `DATABASE_URL` in `.env.local`

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes
│   │   ├── api/               # API routes
│   │   ├── courses/           # Course pages
│   │   ├── dashboard/         # Dashboard pages (role-based)
│   │   └── categories/        # Category pages
│   └── components/            # React components
│       ├── auth/              # Authentication components
│       ├── courses/            # Course-related components
│       ├── curriculum/        # Curriculum builder components
│       ├── dashboard/         # Dashboard components
│       ├── ui/                # shadcn/ui components
│       └── ...
├── lib/                       # Utility libraries
│   ├── auth/                  # Authentication logic
│   ├── courses/               # Course actions
│   ├── db/                    # Database queries
│   │   └── queries/           # SQL query functions
│   ├── code/                  # Code lesson utilities
│   ├── email/                 # Email utilities
│   ├── social/                # Social features
│   └── utils/                 # General utilities
├── types/                     # TypeScript type definitions
├── hooks/                     # React hooks
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🎓 Lesson Types

The platform supports multiple lesson types:

1. **Video**: MP4, Vimeo, YouTube integration
2. **Text**: Rich HTML content
3. **Document**: PDF, Word, PowerPoint viewers
4. **Quiz**: Interactive assessments with multiple question types
5. **Code**: Interactive code editor with execution (Monaco Editor)
6. **Assignment**: Student submissions
7. **Audio**: Audio lessons
8. **Interactive**: Interactive content
9. **Discussion**: Forum-style discussions
10. **Live Session**: Live streaming integration

## 🔐 Authentication & Authorization

### User Roles
- **Student**: Default role, can enroll and learn
- **Instructor**: Can create and manage courses
- **Admin**: Full system access

### Session Management
- HTTP-only cookies for security
- Auto-refresh on activity
- 1-hour expiration with 15-minute refresh window

## 📚 Key Features Documentation

- [Architecture Overview](./AxioQuan_Platform_Architecture_Overview.md)
- [Student Journey](./STUDENT_JOURNEY.md)
- [Glossary](./GLOSSARY.md)
- [Quiz Implementation](./QUIZ_IMPLEMENTATION_COMPLETE.md)
- [Notifications Guide](./docs/NOTIFICATIONS_IMPLEMENTATION_GUIDE.md)

## 🧪 Development

### Available Scripts

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint
```

### Code Organization Principles

- **Server Components First**: Default to server components for better performance
- **Server Actions for Mutations**: Use server actions instead of API routes for form submissions
- **Direct SQL Queries**: No ORM - use tagged template literals for database queries
- **Feature-Based Organization**: Group related files by domain/feature
- **Type Safety**: TypeScript types defined in `/types` directory

### Common Patterns

**Authentication Check:**
```typescript
// Server Component
const session = await getSession();
if (!session) redirect('/login');

// Server Action
const session = await requireAuth();
```

**Database Query:**
```typescript
import { sql } from '@/lib/db';

const result = await sql`
  SELECT * FROM users WHERE id = ${userId}
`;
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables from `.env.local` are set in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
- Check the [Architecture Overview](./AxioQuan_Platform_Architecture_Overview.md)
- Review the [Glossary](./GLOSSARY.md) for domain concepts
- See [Student Journey](./STUDENT_JOURNEY.md) for user flows

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Code editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)

---

**Version**: 0.1.0  
**Last Updated**: 2024
