# Notifications System Implementation Guide

## Overview

This document provides a comprehensive guide for implementing a fully functional, database-driven notifications system for the AxioQuan E-Learning platform. The current inbox page (`src/app/dashboard/inbox/page.tsx`) uses hardcoded mock data and needs to be connected to a real database-backed notification system.

### Steps

1. **Verify Database Schema** - Most critical step
2. **Implement Database Queries** - Start with `getUserNotifications`
3. **Create Server Actions** - Follow existing patterns
4. **Create API Endpoints** - Test each endpoint individually
5. **Update Inbox Page** - Replace mock data with real API calls
6. **Integrate SSE** - Add real-time updates
7. **Add Notification Triggers** - Integrate throughout the system
8. **Test Thoroughly** - Follow the testing checklist
9. **Monitor Performance** - Watch for slow queries or connection issues
10. **Iterate** - Add features like notification preferences, email notifications, etc.

### Success Considerations
This guide provides a comprehensive roadmap for implementing a fully functional notifications system. Considerthe following when implementing:

1. **Verify database schema first** - Don't assume
2. **Follow existing patterns** - Match the code style of existing queries and actions
3. **Test incrementally** - Test each layer before moving to the next
4. **Handle errors gracefully** - Always include error handling and fallbacks
5. **Monitor real-time updates** - Ensure SSE integration works correctly


## Current State Analysis

### Existing Infrastructure

1. **SSE (Server-Sent Events) System**: ✅ Already implemented
   - `lib/sse/server-events.ts` - Server-side event manager
   - `lib/sse/actions.ts` - Server actions for sending events
   - `src/app/api/sse/route.ts` - SSE API endpoint
   - `hooks/use-server-events.ts` - Client-side hook for receiving events

2. **Database**: ✅ Notifications table exists (referenced in `lib/db/queries/users.ts` line 48)
   - Table name: `notifications`
   - Referenced in user deletion queries, confirming table existence

3. **UI Components**: ✅ Inbox page exists with full UI
   - Location: `src/app/dashboard/inbox/page.tsx`
   - Currently uses hardcoded mock data
   - Supports filtering, searching, and categorization

### Missing Components

1. Database query functions (`lib/db/queries/notifications.ts` is empty)
2. API endpoints for notifications
3. Server actions for notification operations
4. TypeScript interfaces for database notifications
5. Real-time notification updates via SSE
6. Integration between SSE events and notification persistence

---

## Database Schema Requirements

### Step 1: Verify/Create Notifications Table

**SCHEMA VERIFIED**: The actual database schema has been queried and verified. The schema below reflects the **actual** table structure in the database.

**Actual Database Schema** (verified via information_schema query):

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'assignment', 'achievement', 'message', 'deadline', 'certificate', 'announcement'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE, -- ⚠️ CRITICAL: Column is named 'is_read', NOT 'read'
  action_url TEXT, -- URL to navigate when notification is clicked (nullable)
  related_entity_type VARCHAR(50), -- Type of related entity (e.g., 'course', 'assignment', 'achievement')
  related_entity_id UUID, -- ID of the related entity (e.g., course_id, assignment_id)
  created_at TIMESTAMPTZ DEFAULT NOW(), -- timestamp with time zone
  read_at TIMESTAMPTZ -- When the notification was marked as read (nullable)
);

-- Existing Indexes (verified):
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE (is_read = false);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```


**All code examples in this guide use the verified schema above.**  
    If there are errors in the schema, there will likely be 400 errors.


### Step 2: Add Notification Types

**File**: `types/notifications.ts`

The following interface matches the verified database schema above:

```typescript
export interface Notification {
  id: string;
  user_id: string;
  type: 'assignment' | 'achievement' | 'message' | 'deadline' | 'certificate' | 'announcement';
  title: string;
  message: string;
  course_id?: string | null;
  read: boolean;
  action_url?: string | null;
  metadata?: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
  read_at?: Date | null;
}
```

Include a reference to notifcation type in the page.tsx file or a master component file.
**File**: `src/app/dashboard/inbox/page.tsx`
**Master Component File**: `src/components/inbox/notifications-viewer.tsx`

---

## Database Queries

### Step 3: Implement Notification Queries

**File**: `lib/db/queries/notifications.ts` is currently empty. The following query functions should do the trick:

You can implement the following query functions following the pattern used in `lib/db/queries/enrollments.ts`:
The following are examples of the query functions you can implement but may not fit your exact needs.

#### 4.1 Get User Notifications

```typescript
import { sql } from '../index';
    /**
     * Get all notifications for a user with optional filters
     * @param userId - The user ID
     * @param options - Filter options (read status, type, limit, offset)
     */

    export async function getUserNotifications(
    userId: string,
    options: {
        read?: boolean | null; // null = all, true = read only, false = unread only
        type?: string; // Filter by notification type
        limit?: number;
        offset?: number;
    } = {}
    ): Promise<Notification[]> {
    try {
        const { read = null, type, limit = 50, offset = 0 } = options;
        
        let query = sql`
        SELECT 
            n.*,
            c.title as course_title,
            c.slug as course_slug
        FROM notifications n
        LEFT JOIN courses c ON n.course_id = c.id
        WHERE n.user_id = ${userId}
        `;
        
        // Add read filter
        if (read !== null) {
        query = sql`
            ${query}
            AND n.read = ${read}
        `;
        }
        
        // Add type filter
        if (type) {
        query = sql`
            ${query}
            AND n.type = ${type}
        `;
        }
        
        // Add ordering and pagination
        query = sql`
        ${query}
        ORDER BY n.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
        `;
        
        const rows = await query;
        return rows as Notification[];
    } catch (error) {
        console.error('❌ Error fetching user notifications:', error);
        return [];
    }
    }
```

#### 4.2 Get Unread Count

```typescript
    /**
     * Get count of unread notifications for a user
     */
    export async function getUnreadNotificationCount(userId: string): Promise<number> {
    try {
        const result = await sql`
        SELECT COUNT(*) as count
        FROM notifications
        WHERE user_id = ${userId} AND read = false
        `;
        return parseInt(result[0]?.count || '0', 10);
    } catch (error) {
        console.error('❌ Error fetching unread count:', error);
        return 0;
    }
    }
```

#### 4.3 Mark Notification as Read

```typescript
    /**
     * Mark a single notification as read
     */
    export async function markNotificationAsRead(
    notificationId: string,
    userId: string
    ): Promise<boolean> {
    try {
        const result = await sql`
        UPDATE notifications
        SET read = true, read_at = NOW(), updated_at = NOW()
        WHERE id = ${notificationId} AND user_id = ${userId}
        RETURNING id
        `;
        return result.length > 0;
    } catch (error) {
        console.error('❌ Error marking notification as read:', error);
        return false;
    }
    }
```

#### 4.4 Mark All as Read

```typescript
    /**
     * Mark all notifications as read for a user
     */
    export async function markAllNotificationsAsRead(userId: string): Promise<number> {
    try {
        const result = await sql`
        UPDATE notifications
        SET read = true, read_at = NOW(), updated_at = NOW()
        WHERE user_id = ${userId} AND read = false
        RETURNING id
        `;
        return result.length;
    } catch (error) {
        console.error('❌ Error marking all notifications as read:', error);
        return 0;
    }
    }
```

#### 4.5 Create Notification

```typescript
    /**
     * Create a new notification
     */
    export async function createNotification(
    notification: {
        user_id: string;
        type: string;
        title: string;
        message: string;
        course_id?: string | null;
        action_url?: string | null;
        metadata?: Record<string, any> | null;
    }
    ): Promise<Notification | null> {
    try {
        const result = await sql`
        INSERT INTO notifications (
            user_id, type, title, message, course_id, action_url, metadata
        )
        VALUES (
            ${notification.user_id},
            ${notification.type},
            ${notification.title},
            ${notification.message},
            ${notification.course_id || null},
            ${notification.action_url || null},
            ${notification.metadata ? JSON.stringify(notification.metadata) : null}
        )
        RETURNING *
        `;
        return result[0] as Notification;
    } catch (error) {
        console.error('❌ Error creating notification:', error);
        return null;
    }
    }
```

#### 4.6 Delete Notification

```typescript
    /**
     * Delete a notification
     */
    export async function deleteNotification(
    notificationId: string,
    userId: string
    ): Promise<boolean> {
    try {
        const result = await sql`
        DELETE FROM notifications
        WHERE id = ${notificationId} AND user_id = ${userId}
        RETURNING id
        `;
        return result.length > 0;
    } catch (error) {
        console.error('❌ Error deleting notification:', error);
        return false;
    }
    }
```

---

## Server Actions
    Server actions are the functions that are called by the client to perform actions on the server.
    You can create the following server actions following the pattern used in `lib/courses/actions.ts`:

### Step 5: Create Notification Server Actions

**File**: `lib/notifications/actions.ts` (create new file)

Create server actions following the pattern used in `lib/courses/actions.ts`:

```typescript
    'use server';

    import { getSession } from '@/lib/auth/session';
    import {
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    createNotification,
    deleteNotification,
    } from '@/lib/db/queries/notifications';
    import { serverEvents } from '@/lib/sse/server-events';

    /**
     * Get notifications for the current user
     */
    export async function getNotificationsAction(options?: {
    read?: boolean | null;
    type?: string;
    limit?: number;
    offset?: number;
    }) {
    try {
        const session = await getSession();
        if (!session) {
        return { success: false, errors: ['Unauthorized'] };
        }

        const notifications = await getUserNotifications(session.userId, options || {});
        return { success: true, notifications };
    } catch (error: any) {
        console.error('❌ Error in getNotificationsAction:', error);
        return { success: false, errors: [error.message || 'Failed to fetch notifications'] };
    }
    }

    /**
     * Get unread notification count
     */
    export async function getUnreadCountAction() {
    try {
        const session = await getSession();
        if (!session) {
        return { success: false, count: 0 };
        }

        const count = await getUnreadNotificationCount(session.userId);
        return { success: true, count };
    } catch (error: any) {
        console.error('❌ Error in getUnreadCountAction:', error);
        return { success: false, count: 0 };
    }
    }

    /**
     * Mark notification as read
     */
    export async function markAsReadAction(notificationId: string) {
    try {
        const session = await getSession();
        if (!session) {
        return { success: false, errors: ['Unauthorized'] };
        }

        const success = await markNotificationAsRead(notificationId, session.userId);
        if (success) {
        // Optionally send SSE event to update UI in real-time
        serverEvents.sendToUser(session.userId, 'notification_read', { notificationId });
        }

        return { success };
    } catch (error: any) {
        console.error('❌ Error in markAsReadAction:', error);
        return { success: false, errors: [error.message || 'Failed to mark notification as read'] };
    }
    }

    /**
     * Mark all notifications as read
     */
    export async function markAllAsReadAction() {
    try {
        const session = await getSession();
        if (!session) {
        return { success: false, errors: ['Unauthorized'] };
        }

        const count = await markAllNotificationsAsRead(session.userId);
        if (count > 0) {
        serverEvents.sendToUser(session.userId, 'all_notifications_read', { count });
        }

        return { success: true, count };
    } catch (error: any) {
        console.error('❌ Error in markAllAsReadAction:', error);
        return { success: false, errors: [error.message || 'Failed to mark all as read'] };
    }
    }

    /**
     * Delete notification
     */
    export async function deleteNotificationAction(notificationId: string) {
    try {
        const session = await getSession();
        if (!session) {
        return { success: false, errors: ['Unauthorized'] };
        }

        const success = await deleteNotification(notificationId, session.userId);
        return { success };
    } catch (error: any) {
        console.error('❌ Error in deleteNotificationAction:', error);
        return { success: false, errors: [error.message || 'Failed to delete notification'] };
    }
    }

    /**
     * Create notification (for system use - can be called by admins/instructors)
     */
    export async function createNotificationAction(notification: {
    user_id: string;
    type: string;
    title: string;
    message: string;
    course_id?: string | null;
    action_url?: string | null;
    metadata?: Record<string, any> | null;
    }) {
    try {
        const session = await getSession();
        if (!session) {
        return { success: false, errors: ['Unauthorized'] };
        }

        // Verify permissions (admin or instructor creating for their students)
        // Add permission check logic here

        const newNotification = await createNotification(notification);
        if (newNotification) {
        // Send SSE event to notify user in real-time
        serverEvents.sendToUser(notification.user_id, 'new_notification', newNotification);
        }

        return { success: !!newNotification, notification: newNotification };
    } catch (error: any) {
        console.error('❌ Error in createNotificationAction:', error);
        return { success: false, errors: [error.message || 'Failed to create notification'] };
    }
    }
```

---

## API Endpoints

### Step 6: Create Notification API Routes

**File**: `src/app/api/notifications/route.ts` (create new file)

```typescript
import { NextRequest } from 'next/server';
import { getNotificationsAction, getUnreadCountAction } from '@/lib/notifications/actions';
import { getSession } from '@/lib/auth/session';

/**
 * GET /api/notifications
 * Get notifications for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const read = searchParams.get('read');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await getNotificationsAction({
      read: read === null ? null : read === 'true',
      type: type || undefined,
      limit,
      offset,
    });

    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to fetch notifications' },
        { status: 400 }
      );
    }

    return Response.json({ notifications: result.notifications });
  } catch (error: any) {
    console.error('❌ API Error fetching notifications:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**File**: `src/app/api/notifications/count/route.ts` (create new file)

```typescript
import { NextRequest } from 'next/server';
import { getUnreadCountAction } from '@/lib/notifications/actions';
import { getSession } from '@/lib/auth/session';

/**
 * GET /api/notifications/count
 * Get unread notification count
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await getUnreadCountAction();
    return Response.json({ count: result.count });
  } catch (error: any) {
    console.error('❌ API Error fetching notification count:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**File**: `src/app/api/notifications/[id]/route.ts` (create new file)

```typescript
import { NextRequest } from 'next/server';
import { markAsReadAction, deleteNotificationAction } from '@/lib/notifications/actions';
import { getSession } from '@/lib/auth/session';

/**
 * PATCH /api/notifications/[id]
 * Mark notification as read
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await markAsReadAction(params.id);
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to mark notification as read' },
        { status: 400 }
      );
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('❌ API Error marking notification as read:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/notifications/[id]
 * Delete notification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await deleteNotificationAction(params.id);
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to delete notification' },
        { status: 400 }
      );
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('❌ API Error deleting notification:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**File**: `src/app/api/notifications/read-all/route.ts` (create new file)

```typescript
import { NextRequest } from 'next/server';
import { markAllAsReadAction } from '@/lib/notifications/actions';
import { getSession } from '@/lib/auth/session';

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await markAllAsReadAction();
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to mark all as read' },
        { status: 400 }
      );
    }

    return Response.json({ success: true, count: result.count });
  } catch (error: any) {
    console.error('❌ API Error marking all as read:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Client-Side Updates

### Step 6: Replace Inbox Mock Data with callback functions

**File**: `src/app/dashboard/inbox/page.tsx`

The following are the key changes needed to replace the mock data with the API calls:

1. **Remove hardcoded data** - Replace mock `notifications` array with API calls
2. **Add data fetching** - Use `useEffect` and `useState` to fetch notifications
3. **Add real-time updates** - Integrate SSE events for new notifications
4. **Add interaction handlers** - Mark as read, delete, etc.
5. **Add loading states** - Show loading indicators while fetching
6. **Add error handling** - Handle API errors gracefully

#### 7.1 Add Imports

```typescript
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useServerEvents } from "@/hooks/use-server-events"
import { getNotificationsAction, markAsReadAction, deleteNotificationAction, markAllAsReadAction } from "@/lib/notifications/actions"
```

#### 7.2 Replace Mock Data with API Calls

```typescript
export default function InboxPage() {
  const router = useRouter()
  const { lastEvent } = useServerEvents()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"notifications" | "messages">("notifications")
  // ... other state

  // Fetch notifications on mount and when filters change
  useEffect(() => {
    fetchNotifications()
  }, [filterType, filterCategory])

  // Listen for new notifications via SSE
  useEffect(() => {
    if (lastEvent?.event === 'new_notification') {
      // Add new notification to the top of the list
      setNotifications(prev => [lastEvent.data, ...prev])
    } else if (lastEvent?.event === 'notification_read') {
      // Update read status
      setNotifications(prev =>
        prev.map(n => n.id === lastEvent.data.notificationId ? { ...n, read: true } : n)
      )
    } else if (lastEvent?.event === 'all_notifications_read') {
      // Mark all as read
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }, [lastEvent])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const result = await getNotificationsAction({
        read: filterType === "all" ? null : filterType === "unread" ? false : true,
        type: filterCategory === "all" ? undefined : filterCategory,
      })
      if (result.success && result.notifications) {
        setNotifications(result.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsReadAction(notificationId)
    // Update local state optimistically
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const handleDelete = async (notificationId: string) => {
    await deleteNotificationAction(notificationId)
    // Remove from local state
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  // ... rest of component
}
```

#### 7.3 Update Notification Click Handler

```typescript
<button
  key={notif.id}
  onClick={() => {
    // Mark as read if unread
    if (!notif.read) {
      handleMarkAsRead(notif.id)
    }
    // Navigate to action URL if available
    if (notif.actionUrl) {
      router.push(notif.actionUrl)
    }
  }}
  className={...}
>
  {/* notification content */}
</button>
```

---

## SSE Integration

### Step 8: Extend SSE System for Notifications

**File**: `lib/sse/server-events.ts`

Add notification-specific helper methods:

```typescript
// Add to ServerEventManager class

notifyUser(userId: string, notification: Notification) {
  return this.sendToUser(userId, 'new_notification', notification);
}

notifyNotificationRead(userId: string, notificationId: string) {
  return this.sendToUser(userId, 'notification_read', { notificationId });
}

notifyAllRead(userId: string, count: number) {
  return this.sendToUser(userId, 'all_notifications_read', { count });
}
```

**File**: `hooks/use-server-events.ts`

Add notification event handlers:

```typescript
switch (serverEvent.event) {
  // ... existing cases
  
  case 'new_notification':
    console.log('🔔 New notification:', serverEvent.data);
    // Trigger UI update (handled in inbox page)
    break;
    
  case 'notification_read':
    console.log('✅ Notification read:', serverEvent.data);
    break;
    
  case 'all_notifications_read':
    console.log('✅ All notifications read:', serverEvent.data);
    break;
}
```

---

## Notification Triggers

### Step 8: (Final Step) Integrate Notification Creation Throughout the System:

Notifications should be created when specific events occur.  Consider the notification types: assignment, achievement, certificate, deadline, announcement, message and consider implimenting one of each type where appropriate.  This can be implimented last after all other features are working correctly.

Example notifications (8.1 - 8.6):
- Course Completion → Certificate Notification (8.1)
- Assignment Posted → Assignment Notification (8.2)
- Achievement Unlocked → Achievement Notification (8.3)
- Deadline Approaching → Deadline Notification (8.4)
- Announcement → Announcement Notification (8.5)
- Message → Message Notification (8.6)

#### 8.1 Course Completion → Certificate Notification

**File**: `lib/courses/progress-actions.ts` (or wherever course completion is handled)

```typescript
import { createNotification } from '@/lib/db/queries/notifications';
import { serverEvents } from '@/lib/sse/server-events';

// When course is completed
if (progressPercentage === 100 && course.certificate_available) {
  await createNotification({
    user_id: userId,
    type: 'certificate',
    title: 'Certificate Ready',
    message: `Your certificate for ${course.title} is ready to download`,
    course_id: courseId,
    action_url: `/dashboard/certificates`,
    metadata: { course_id: courseId, course_title: course.title }
  });
  
  // Send real-time notification
  serverEvents.notifyUser(userId, notification);
}
```

#### 8.2 Assignment Posted → Assignment Notification

**File**: Where assignments are created (instructor dashboard)

```typescript
// When instructor posts assignment
const enrolledStudents = await getEnrolledStudents(courseId);
for (const student of enrolledStudents) {
  await createNotification({
    user_id: student.user_id,
    type: 'assignment',
    title: 'New Assignment Posted',
    message: `A new assignment has been posted for ${course.title}`,
    course_id: courseId,
    action_url: `/courses/${courseSlug}/assignments`,
    metadata: { assignment_id: assignmentId }
  });
}
```

#### 8.3 Achievement Unlocked → Achievement Notification

**File**: Where achievements are awarded

```typescript
await createNotification({
  user_id: userId,
  type: 'achievement',
  title: 'Achievement Unlocked',
  message: `You earned the "${achievement.name}" badge`,
  metadata: { achievement_id: achievementId }
});
```

#### 8.4 Deadline Approaching → Deadline Notification

**File**: Background job or cron task

```typescript
// Check for approaching deadlines (run daily)
const approachingDeadlines = await getApproachingDeadlines();
for (const deadline of approachingDeadlines) {
  await createNotification({
    user_id: deadline.user_id,
    type: 'deadline',
    title: 'Approaching Deadline',
    message: `${deadline.daysLeft} days left to submit ${deadline.assignmentName}`,
    course_id: deadline.course_id,
    action_url: deadline.action_url,
    metadata: { deadline_id: deadline.id, due_date: deadline.due_date }
  });
}
```

---


## Common Pitfalls & Solutions

### Pitfall 1: Database Schema Mismatch

**Problem**: TypeScript interface doesn't match database schema, causing 400 errors.

**Solution**: 
- Always verify database schema first
- Use database introspection tools
- Test queries in isolation before integrating

### Pitfall 2: Missing Indexes

**Problem**: Slow queries when fetching notifications for users with many notifications.

**Solution**: 
- Ensure indexes exist on `user_id`, `read`, `created_at`
- Monitor query performance
- Consider pagination limitsimage.png

### Pitfall 3: SSE Connection Issues

**Problem**: Notifications not appearing in real-time.

**Solution**:
- Verify SSE connection is establisheds
- Check browser console for SSE errors
- Implement reconnection logic
- Fall back to polling if SSE fails

### Pitfall 4: Race Conditions

**Problem**: Multiple notifications created simultaneously causing duplicates.

**Solution**:
- Use database transactions where appropriate
- Implement idempotency keys for critical notifications
- Add unique constraints if needed

### Pitfall 5: Performance with Large Datasets

**Problem**: Loading all notifications causes performance issues.

**Solution**:
- Implement pagination (limit/offset)
- Use virtual scrolling for large lists
- Cache unread count separately
- Consider lazy loading

---

## Recommended File Structure

```
lib/
  notifications/
    actions.ts          # Server actions
  db/
    queries/
      notifications.ts # Database queries
  sse/
    server-events.ts   # SSE manager (extend existing)
    actions.ts         # SSE actions (extend existing)

src/
  app/
    api/
      notifications/
        route.ts       # GET /api/notifications
        count/
          route.ts     # GET /api/notifications/count
        read-all/
          route.ts     # POST /api/notifications/read-all
        [id]/
          route.ts     # PATCH/DELETE /api/notifications/[id]
    dashboard/
      inbox/
        page.tsx       # Update existing

types/
  database.ts          # Add Notification interface

hooks/
  use-server-events.ts # Extend existing
```


---

## Additional Recommendations

### Future Enhancements

1. **Notification Preferences**: Allow users to configure which types of notifications they want to receive
2. **Email Notifications**: Send email for important notifications
3. **Push Notifications**: Implement browser push notifications
4. **Notification Groups**: Group related notifications (e.g., multiple assignment notifications)
5. **Notification Templates**: Create reusable notification templates
6. **Notification Analytics**: Track notification engagement rates
7. **Bulk Operations**: Allow users to select and act on multiple notifications at once

### Performance Optimization

1. **Caching**: Cache unread count in Redis or similar
2. **Batch Operations**: Batch notification creation for bulk events
3. **Background Jobs**: Use background jobs for deadline notifications
4. **Database Partitioning**: Consider partitioning notifications table by date for very large datasets

