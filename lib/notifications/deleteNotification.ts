// lib/db/queries/notifications/deleteNotification.ts
import { sql } from "@/lib/db";

export async function deleteNotification(notificationId: string) {
  const result = await sql`
    DELETE FROM notifications
    WHERE id = ${notificationId}
    RETURNING *;
  `;

  return result[0];
}
