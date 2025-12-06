// components/notifications/NotificationBell.tsx
"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";
import { useState } from "react";
import NotificationPanel from "./notificationPanel";

export default function NotificationBell({ userId }: { userId: string }) {
  const { notifications } = useNotifications(userId);
  const unread = notifications.filter((n: any) => !n.is_read).length;

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell size={22} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && <NotificationPanel userId={userId} />}
    </div>
  );
}
