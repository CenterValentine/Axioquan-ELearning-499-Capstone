// notification.tsx
// pnpm add framer-motion


"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

// -------------------------------------------------------------
// 1. Create a context so any component in the app can trigger a notification.
// -------------------------------------------------------------
const NotificationContext = createContext<any>(null);

export function useNotification() {
  return useContext(NotificationContext);
}

// -------------------------------------------------------------
// 2. Provider that wraps your entire app in layout.tsx
//    This holds the list of notifications + the function to show a new one.
// -------------------------------------------------------------
type NotificationProviderProps = {
  children: ReactNode;
};

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<any[]>([]);

  // Function to show a notification anywhere in your app
  const notify = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now(); // Unique ID

    setNotifications((prev) => [...prev, { id, message, type }]);

    // Remove after 3 seconds automatically
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {/* Notification container (fixed on screen) */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.25 }}
              className={`rounded-lg shadow-lg p-4 text-white flex items-start justify-between w-72
                ${n.type === "success" ? "bg-green-600" : ""}
                ${n.type === "error" ? "bg-red-600" : ""}
                ${n.type === "info" ? "bg-blue-600" : ""}`}
            >
              <span>{n.message}</span>

              {/* Close button to manually dismiss */}
              <button
                onClick={() =>
                  setNotifications((prev) => prev.filter((x) => x.id !== n.id))
                }
                className="ml-3 opacity-70 hover:opacity-100"
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

// -------------------------------------------------------------
// 3. Example usage
//    import { useNotification } from "@/components/ui/notification";
//    const { notify } = useNotification();
//    notify("Message sent successfully!", "success");
// -------------------------------------------------------------
