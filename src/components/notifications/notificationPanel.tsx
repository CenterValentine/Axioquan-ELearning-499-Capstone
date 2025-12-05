// components/notifications/NotificationPanel.tsx
"use client";

import { useNotifications } from "@/hooks/useNotifications";
import NotificationItem from "./notificationItem";

export default function NotificationPanel({ userId }: { userId: string }) {
  const { notifications, loading } = useNotifications(userId);

  if (loading) return <div className="absolute right-0 mt-3 p-4 bg-white shadow rounded">Loading...</div>;

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border overflow-hidden z-50">
      <div className="p-3 font-semibold border-b">Notifications</div>

      {notifications.length === 0 ? (
        <p className="p-4 text-gray-500 text-sm">No notifications</p>
      ) : (
        notifications.map((notif: any) => (
          <NotificationItem key={notif.id} notification={notif} />
        ))
      )}
    </div>
  );
}
