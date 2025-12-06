// components/notifications/NotificationItem.tsx
"use client";

import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";

export default function NotificationItem({ notification }: any) {
  const { markRead, remove } = useNotifications(notification.user_id);

  return (
    <div
      className={`p-3 border-b hover:bg-gray-50 ${
        !notification.is_read ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{notification.title}</p>
          <p className="text-sm text-gray-600">{notification.message}</p>

          {notification.link && (
            <Link
              href={notification.link}
              onClick={() => markRead(notification.id)}
              className="text-blue-600 text-sm underline"
            >
              View
            </Link>
          )}
        </div>

        <button
          onClick={() => remove(notification.id)}
          className="text-gray-400 hover:text-red-500 text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
