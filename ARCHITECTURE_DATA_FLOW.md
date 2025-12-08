# AxioQuan E-Learning Platform - Data Flow Diagram

## Main Data Flow Diagram

```mermaid
flowchart LR
    %% Start with Authentication
    Auth[🔐 Auth System<br/>Login/Signup/Session] -->|Creates User| User[👤 User<br/>Profile & Roles]
    
    %% User enrolls in courses
    User -->|Enrolls| Enrollment[📝 Enrollment<br/>user_id + course_id]
    
    %% Course structure
    Course[📚 Course<br/>Title, Description, Price] -->|Contains| Module[📖 Module<br/>Order, Objectives]
    Module -->|Contains| Lesson[🎓 Lesson<br/>Video/Text/Quiz]
    
    %% Assessment as lesson type
    Lesson -->|Can be type| Quiz[📝 Quiz/Assessment<br/>Questions & Answers]
    
    %% Progress tracking
    Enrollment -->|Tracks| Progress[📊 Progress<br/>% Complete, Time Spent]
    Lesson -->|Updates| Progress
    Quiz -->|Updates| Progress
    
    %% Social features
    Course -->|Has| Reviews[⭐ Reviews<br/>Ratings & Comments]
    Reviews -->|Has| Replies[💬 Review Replies]
    
    %% Messaging (placeholder)
    User -.->|Sends/Receives| Messages[💬 Messages<br/>Direct Communication]
    
    %% Notifications
    Enrollment -.->|Triggers| Notifications[🔔 Notifications<br/>SSE Events]
    Progress -.->|Triggers| Notifications
    Reviews -.->|Triggers| Notifications
    
    %% Styling
    classDef authClass fill:#e1f5ff,stroke:#01579b,stroke-width:3px
    classDef userClass fill:#f3e5f5,stroke:#4a148c,stroke-width:3px
    classDef courseClass fill:#e8f5e9,stroke:#1b5e20,stroke-width:3px
    classDef curriculumClass fill:#fff3e0,stroke:#e65100,stroke-width:3px
    classDef assessmentClass fill:#fce4ec,stroke:#880e4f,stroke-width:3px
    classDef progressClass fill:#e0f2f1,stroke:#004d40,stroke-width:3px
    classDef socialClass fill:#f1f8e9,stroke:#33691e,stroke-width:3px
    classDef notificationClass fill:#fff9c4,stroke:#f57f17,stroke-width:3px
    classDef messagingClass fill:#e8eaf6,stroke:#283593,stroke-width:2px,stroke-dasharray: 5 5

    class Auth authClass
    class User,Enrollment userClass
    class Course,Reviews,Replies courseClass
    class Module,Lesson curriculumClass
    class Quiz assessmentClass
    class Progress progressClass
    class Messages messagingClass
    class Notifications notificationClass
```

## Detailed Subsystem Flow

```mermaid
flowchart TD
    %% Authentication Flow
    subgraph AuthFlow["Authentication → User Creation"]
        A1[User Signs Up] --> A2[Validate Credentials]
        A2 --> A3[Create User Record]
        A3 --> A4[Assign Default Role: student]
        A4 --> A5[Create Session Cookie]
        A5 --> A6[User Authenticated]
    end
    
    %% Enrollment Flow
    subgraph EnrollmentFlow["User → Course Enrollment"]
        E1[User Browses Courses] --> E2[Selects Course]
        E2 --> E3[Check if Already Enrolled]
        E3 -->|Not Enrolled| E4[Create Enrollment Record]
        E3 -->|Already Enrolled| E5[Return Existing Enrollment]
        E4 --> E6[Initialize Progress: 0%]
        E6 --> E7[Set Status: active]
    end
    
    %% Learning Flow
    subgraph LearningFlow["Course → Module → Lesson"]
        L1[User Accesses Course] --> L2[Load Course Modules]
        L2 --> L3[User Selects Module]
        L3 --> L4[Load Module Lessons]
        L4 --> L5[User Views Lesson]
        L5 --> L6{Lesson Type?}
        L6 -->|Video| L7[Play Video]
        L6 -->|Text| L8[Display Content]
        L6 -->|Quiz| L9[Show Quiz]
        L7 --> L10[Mark Lesson Complete]
        L8 --> L10
        L9 --> L11[Submit Answers]
        L11 --> L10
    end
    
    %% Progress Flow
    subgraph ProgressFlow["Progress Tracking"]
        P1[Lesson Completed] --> P2[Update Lesson Progress]
        P2 --> P3[Calculate Module Progress]
        P3 --> P4[Calculate Course Progress]
        P4 --> P5[Update Enrollment.progress_percentage]
        P5 --> P6[Update Enrollment.completed_lessons]
        P6 --> P7[Track Time Spent]
    end
    
    %% Assessment Flow
    subgraph AssessmentFlow["Quiz/Assessment"]
        Q1[User Reaches Quiz Lesson] --> Q2[Load Quiz Questions]
        Q2 --> Q3[User Answers Questions]
        Q3 --> Q4[Submit Quiz]
        Q4 --> Q5[Calculate Score]
        Q5 --> Q6{Passing Score?}
        Q6 -->|Yes| Q7[Mark Quiz Complete]
        Q6 -->|No| Q8[Allow Retake]
        Q7 --> Q9[Update Progress]
        Q8 --> Q3
    end
    
    %% Notification Flow
    subgraph NotificationFlow["Event → Notification"]
        N1[System Event Occurs] --> N2{Event Type?}
        N2 -->|Role Update| N3[Role Request Approved]
        N2 -->|Enrollment| N4[Course Enrollment Confirmed]
        N2 -->|Progress| N5[Course Completion Milestone]
        N3 --> N6[SSE Manager.sendToUser]
        N4 --> N6
        N5 --> N6
        N6 --> N7[Client Receives via EventSource]
        N7 --> N8[Update UI / Show Toast]
    end
    
    %% Connect flows
    AuthFlow --> EnrollmentFlow
    EnrollmentFlow --> LearningFlow
    LearningFlow --> ProgressFlow
    LearningFlow --> AssessmentFlow
    AssessmentFlow --> ProgressFlow
    ProgressFlow -.-> NotificationFlow
    EnrollmentFlow -.-> NotificationFlow
    
    %% Styling
    classDef flowBox fill:#f9f9f9,stroke:#333,stroke-width:2px
    class AuthFlow,EnrollmentFlow,LearningFlow,ProgressFlow,AssessmentFlow,NotificationFlow flowBox
```

## Data Flow Sequence

### 1. User Registration & Authentication
```
Auth System → Creates User → Assigns Roles → Creates Session
```

### 2. Course Enrollment Flow
```
User → Browses Courses → Enrolls → Creates Enrollment Record → Links to Course
```

### 3. Learning Flow
```
User → Accesses Course → Views Modules → Completes Lessons → Updates Progress
```

### 4. Assessment Flow
```
User → Reaches Quiz Lesson → Answers Questions → Submits Answers → Updates Progress
```

### 5. Progress Tracking Flow
```
Lesson Completion → Updates Lesson Progress → Aggregates to Module Progress → 
Updates Course Progress → Stores in Enrollment
```

### 6. Notification Flow
```
Any System Event → Triggers Notification → SSE Manager → Broadcasts to User → 
Client Receives → Updates UI
```

## Database Entity Relationships

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    USERS ||--o{ ENROLLMENTS : enrolls
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ SESSIONS : creates
    
    ROLES ||--o{ USER_ROLES : assigned_to
    ROLES ||--o{ ROLE_REQUESTS : requested
    
    COURSES ||--o{ COURSE_MODULES : contains
    COURSES ||--o{ ENROLLMENTS : has
    COURSES ||--o{ REVIEWS : receives
    COURSES }o--|| CATEGORIES : belongs_to
    COURSES }o--o{ COURSE_TAGS : tagged_with
    
    COURSE_MODULES ||--o{ LESSONS : contains
    LESSONS }o--o| QUIZ : can_be
    
    ENROLLMENTS ||--|| PROGRESS : tracks
    LESSONS ||--o{ PROGRESS : updates
    
    REVIEWS ||--o{ REVIEW_REPLIES : has
    REVIEWS ||--o{ REVIEW_REACTIONS : receives
    
    USERS {
        string id PK
        string email
        string username
        string name
        string image
        boolean is_active
    }
    
    ROLES {
        string id PK
        string name
        json permissions
        int hierarchy_level
    }
    
    USER_ROLES {
        string id PK
        string user_id FK
        string role_id FK
        boolean is_primary
    }
    
    COURSES {
        string id PK
        string title
        string slug
        string instructor_id FK
        string category_id FK
        decimal price_cents
        boolean is_published
    }
    
    COURSE_MODULES {
        string id PK
        string course_id FK
        string title
        int order_index
    }
    
    LESSONS {
        string id PK
        string module_id FK
        string course_id FK
        string title
        string lesson_type
        string video_url
        int order_index
    }
    
    ENROLLMENTS {
        string id PK
        string user_id FK
        string course_id FK
        decimal progress_percentage
        json completed_lessons
        int total_time_spent
        timestamp enrolled_at
    }
    
    REVIEWS {
        string id PK
        string course_id FK
        string user_id FK
        int rating
        string comment
    }
    
    REVIEW_REPLIES {
        string id PK
        string review_id FK
        string user_id FK
        string parent_reply_id FK
        string content
    }
```

## Key Data Relationships

1. **User ↔ Enrollment ↔ Course**: Many-to-many relationship (users enroll in multiple courses)
2. **Course → Module → Lesson**: Hierarchical one-to-many (course contains modules, modules contain lessons)
3. **Lesson → Quiz**: One-to-one (lesson can be a quiz type)
4. **Enrollment → Progress**: One-to-one tracking (each enrollment tracks its own progress)
5. **User → Notifications**: One-to-many via SSE (notifications table exists but queries pending)
6. **Course → Reviews → Replies**: Social interaction tree (reviews can have nested replies)
7. **User → Roles**: Many-to-many (users can have multiple roles, one primary)




