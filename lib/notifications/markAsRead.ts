// lib/db/queries/notifications/markAsRead.ts
import { sql } from "@/lib/db";

export async function markAsRead(notificationId: string) {
  const result = await sql`
    UPDATE notifications
    SET is_read = true
    WHERE id = ${notificationId}
    RETURNING *;
  `;

  return result[0];
}
