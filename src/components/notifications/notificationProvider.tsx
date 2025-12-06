// components/notifications/NotificationProvider.tsx
/*
"use client";

import { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }: any) {
  const [refreshFlag, setRefreshFlag] = useState(0);

  const refresh = () => setRefreshFlag((v) => v + 1);

  return (
    <NotificationContext.Provider value={{ refreshFlag, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => useContext(NotificationContext);*/
