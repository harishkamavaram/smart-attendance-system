export const notifications = [
  { id: 'ntf-001', title: 'Bulk upload completed', message: 'cse_year1_2026.xlsx processed — 60 of 62 students registered.', time: '10 min ago', type: 'success', read: false },
  { id: 'ntf-002', title: 'Low attendance alert', message: '14 students in CSE-A have fallen below 75% attendance.', time: '1 hour ago', type: 'warning', read: false },
  { id: 'ntf-003', title: 'Face registration pending', message: '8 students still need face enrollment before Monday.', time: '3 hours ago', type: 'warning', read: true },
  { id: 'ntf-004', title: 'Session completed', message: 'Data Structures & Algorithms — attendance marked for 62 students.', time: '5 hours ago', type: 'info', read: true },
  { id: 'ntf-005', title: 'New device connected', message: 'Classroom camera "Lab 204 — Cam 1" is now online.', time: 'Yesterday', type: 'info', read: true },
  { id: 'ntf-006', title: 'Monthly report ready', message: 'Your June attendance report has been generated.', time: '2 days ago', type: 'success', read: true },
]

export const studentNotifications = [
  { id: 'stn-001', title: 'Attendance marked present', message: 'Data Structures & Algorithms — 9:00 AM today.', time: '2 hours ago', type: 'success', read: false },
  { id: 'stn-002', title: 'Low attendance warning', message: 'Your attendance in Computer Networks is 71% — below the 75% threshold.', time: '1 day ago', type: 'warning', read: false },
  { id: 'stn-003', title: 'Face re-registration needed', message: 'Please update your face profile — last scan was low confidence.', time: '2 days ago', type: 'warning', read: true },
  { id: 'stn-004', title: 'Timetable updated', message: 'Machine Learning has moved to Lab 301 from next week.', time: '3 days ago', type: 'info', read: true },
]

export const recentActivity = [
  { id: 'act-001', actor: 'Dr. Anitha Rao', action: 'marked attendance for', target: 'Data Structures & Algorithms', time: '10 min ago' },
  { id: 'act-002', actor: 'Admin', action: 'uploaded student sheet', target: 'cse_year1_2026.xlsx', time: '25 min ago' },
  { id: 'act-003', actor: 'System', action: 'flagged unknown face in', target: 'Session #ses-002', time: '1 hour ago' },
  { id: 'act-004', actor: 'Prof. Karan Mehta', action: 'created session for', target: 'Computer Networks', time: '2 hours ago' },
  { id: 'act-005', actor: 'Admin', action: 'approved registration for', target: '12 students', time: '4 hours ago' },
]

export const dashboardStats = {
  totalStudents: 1493,
  attendanceToday: 91.2,
  absentToday: 87,
  lateToday: 34,
  aiAccuracy: 97.8,
  pendingRegistrations: 23,
}

export const reportsList = [
  { id: 'rep-001', name: 'Daily Attendance — Jul 25, 2026', type: 'Daily', department: 'All', generatedOn: '2026-07-25', format: ['PDF', 'CSV', 'Excel'] },
  { id: 'rep-002', name: 'Weekly Summary — Week 30', type: 'Weekly', department: 'All', generatedOn: '2026-07-24', format: ['PDF', 'Excel'] },
  { id: 'rep-003', name: 'Monthly Report — June 2026', type: 'Monthly', department: 'CSE', generatedOn: '2026-07-01', format: ['PDF', 'CSV', 'Excel'] },
  { id: 'rep-004', name: 'Semester Report — Spring 2026', type: 'Semester', department: 'All', generatedOn: '2026-06-15', format: ['PDF'] },
  { id: 'rep-005', name: 'Department Report — IT', type: 'Department', department: 'IT', generatedOn: '2026-07-20', format: ['PDF', 'Excel'] },
]

export const testimonials = [
  { name: 'Dr. Anitha Rao', role: 'Head of Department, CSE', quote: 'Roll call used to eat ten minutes of every lecture. Now it happens while I\'m still opening my slides.', avatar: null },
  { name: 'Rohan Mehta', role: 'Dean of Academics', quote: 'The accuracy is what convinced our board — we no longer see proxy attendance in any section.', avatar: null },
  { name: 'Priya Iyer', role: 'Administrative Officer', quote: 'Bulk uploads that took a week of manual entry are done in minutes, and reports build themselves.', avatar: null },
]

export const faqs = [
  { q: 'How accurate is the face recognition?', a: 'The recognition engine maintains a 97–99% accuracy rate under normal classroom lighting, with confidence scores shown for every match so staff can review edge cases.' },
  { q: 'What file formats can we upload student lists in?', a: 'CSV, Excel (.xlsx/.xls), PDF, and Word (.doc/.docx) are all supported. The system parses names, roll numbers, and contact details automatically.' },
  { q: 'What happens with unrecognized faces?', a: 'Any face that can\'t be matched with sufficient confidence is flagged as "unknown" for manual review rather than being auto-assigned.' },
  { q: 'Can students see their own attendance?', a: 'Yes — every student has a dashboard with daily, weekly, and monthly attendance, a calendar view, and per-subject breakdowns.' },
  { q: 'Is student data secure?', a: 'Face embeddings and personal data are encrypted at rest and in transit, with role-based access control for staff.' },
  { q: 'Can we set a custom attendance threshold?', a: 'Yes, administrators can configure minimum attendance percentage and recognition confidence thresholds in Settings.' },
]

export const features = [
  { title: 'Real-time face recognition', description: 'Mark attendance for an entire classroom from a single photo in seconds.', icon: 'ScanFace' },
  { title: 'Bulk student onboarding', description: 'Upload CSV, Excel, PDF, or Word rosters — students are registered automatically.', icon: 'UploadCloud' },
  { title: 'Live analytics dashboards', description: 'Attendance trends, department comparisons, and AI accuracy at a glance.', icon: 'BarChart3' },
  { title: 'Automated reporting', description: 'Daily, weekly, monthly, and semester reports exported to PDF, CSV, or Excel.', icon: 'FileText' },
  { title: 'Duplicate & unknown detection', description: 'Flags proxy attempts and unrecognized faces for manual review.', icon: 'ShieldAlert' },
  { title: 'Student self-service', description: 'Students track their own attendance, subjects, and notifications in real time.', icon: 'UserCheck' },
]

export const howItWorks = [
  { step: '01', title: 'Upload the roster', description: 'Admins import student lists from CSV, Excel, PDF, or Word — no manual data entry.' },
  { step: '02', title: 'Register faces', description: 'Students complete a short guided face capture that generates a secure embedding.' },
  { step: '03', title: 'Capture the room', description: 'Teachers upload a single classroom photo at the start of class.' },
  { step: '04', title: 'AI marks attendance', description: 'Faces are detected, matched, and logged — with confidence scores for every match.' },
  { step: '05', title: 'Review & export', description: 'Staff review flagged faces, then export attendance to any report format.' },
]

export const statistics = [
  { label: 'Institutions onboard', value: '120+' },
  { label: 'Students tracked', value: '48K+' },
  { label: 'Recognition accuracy', value: '97.8%' },
  { label: 'Avg. time saved / class', value: '8 min' },
]
