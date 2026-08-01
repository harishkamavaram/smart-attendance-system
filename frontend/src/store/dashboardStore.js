// src/store/dashboardStore.js

import { create } from "zustand";

const useDashboardStore = create((set) => ({
  notifications: [],
  studentNotifications: [],
  recentActivity: [],
  dashboardStats: {},
  reportsList: [],
  testimonials: [],
  faqs: [],
  features: [],
  howItWorks: [],
  statistics: [],

  // Notifications
  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      ),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    })),

  // Student Notifications
  setStudentNotifications: (studentNotifications) =>
    set({ studentNotifications }),

  markStudentNotificationRead: (id) =>
    set((state) => ({
      studentNotifications: state.studentNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      ),
    })),

  // Dashboard
  setDashboardStats: (dashboardStats) =>
    set({ dashboardStats }),

  // Activity
  setRecentActivity: (recentActivity) =>
    set({ recentActivity }),

  addActivity: (activity) =>
    set((state) => ({
      recentActivity: [activity, ...state.recentActivity],
    })),

  // Reports
  setReportsList: (reportsList) =>
    set({ reportsList }),

  // Landing Page
  setTestimonials: (testimonials) =>
    set({ testimonials }),

  setFaqs: (faqs) =>
    set({ faqs }),

  setFeatures: (features) =>
    set({ features }),

  setHowItWorks: (howItWorks) =>
    set({ howItWorks }),

  setStatistics: (statistics) =>
    set({ statistics }),
}));

export default useDashboardStore;

// import useDashboardStore from "@/store/dashboardStore";

// const {
//   notifications,
//   studentNotifications,
//   recentActivity,
//   dashboardStats,
//   reportsList,
//   testimonials,
//   faqs,
//   features,
//   howItWorks,
//   statistics,

//   setNotifications,
//   addNotification,
//   markNotificationRead,
//   removeNotification,

//   setStudentNotifications,
//   markStudentNotificationRead,

//   setDashboardStats,

//   setRecentActivity,
//   addActivity,

//   setReportsList,

//   setTestimonials,
//   setFaqs,
//   setFeatures,
//   setHowItWorks,
//   setStatistics,
// } = useDashboardStore();

// import useDashboardStore from "@/store/dashboardStore";

// const dashboardStats = useDashboardStore((state) => state.dashboardStats);
// const notifications = useDashboardStore((state) => state.notifications);
// const recentActivity = useDashboardStore((state) => state.recentActivity);