'use server';

import { sql } from "@/lib/db"; 

/**
 * STRUCTURE NOTIFICATION OBJECT
 */
export interface NotificationInput {
  user_id: string;
  title: string;
  message: string;
  type: string;
  action_url?: string | null;
  course_id?: string | null;
}

/**
 * CREATE NOTIFICATION
 */
export async function createNotification(data: NotificationInput) {
  try {
    const result = await sql/*sql*/ `
      INSERT INTO notifications (
        user_id, title, message, type, action_url, course_id
      )
      VALUES (
        ${data.user_id}, 
        ${data.title}, 
        ${data.message}, 
        ${data.type}, 
        ${data.action_url ?? null}, 
        ${data.course_id ?? null}
      )
      RETURNING *;
    `;

    return result[0];
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    throw new Error("Failed to create notification");
  }
}

/**
 * GET ALL NOTIFICATIONS FOR A USER
 */
export async function getNotifications(user_id: string) {
  try {
    const rows = await sql/*sql*/ `
      SELECT * FROM notifications
      WHERE user_id = ${user_id}
      ORDER BY created_at DESC;
    `;

    return rows;
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
}

/**
 * GET UNREAD COUNT
 */
export async function getUnreadNotificationCount(user_id: string) {
  try {
    const rows = await sql/*sql*/ `
      SELECT COUNT(*)::int AS count
      FROM notifications
      WHERE user_id = ${user_id} AND is_read = false;
    `;

    return rows[0].count;
  } catch (error) {
    console.error("❌ Error counting unread notifications:", error);
    throw new Error("Failed to count unread notifications");
  }
}

/**
 * MARK ONE AS READ
 */
export async function markNotificationAsRead(notification_id: string) {
  try {
    await sql/*sql*/ `
      UPDATE notifications
      SET is_read = true
      WHERE id = ${notification_id};
    `;

    return { success: true };
  } catch (error) {
    console.error("❌ Error marking notification read:", error);
    throw new Error("Failed to mark notification as read");
  }
}

/**
 * MARK ALL AS READ FOR USER
 */
export async function markAllNotificationsAsRead(user_id: string) {
  try {
    await sql/*sql*/ `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ${user_id};
    `;

    return { success: true };
  } catch (error) {
    console.error("❌ Error marking all notifications read:", error);
    throw new Error("Failed to mark all notifications");
  }
}
