// hooks/useNotifications.ts
"use client";

import { useEffect, useState } from "react";

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNotifications() {
    if (!userId) return;

    const res = await fetch(`/api/notifications?userId=${userId}`);
    const data = await res.json();
    setNotifications(data);
    setLoading(false);
  }

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    fetchNotifications();
  }

  async function remove(id: string) {
    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    fetchNotifications();
  }

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return { notifications, loading, markRead, remove };
}
