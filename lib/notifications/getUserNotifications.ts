// lib/db/queries/notifications/getUserNotifications.ts
import { sql } from "@/lib/db";

export async function getUserNotifications(userId: string) {
  const notifications = await sql`
    SELECT *
    FROM notifications
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `;

  return notifications;
}
