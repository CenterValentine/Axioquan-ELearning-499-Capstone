// lib/db/queries/notifications/createNotification.ts
import { sql } from "@/lib/db";

export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}) {
  const { userId, title, message, type, link } = data;

  const result = await sql`
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (${userId}, ${title}, ${message}, ${type || null}, ${link || null})
    RETURNING *;
  `;

  return result[0];
}
