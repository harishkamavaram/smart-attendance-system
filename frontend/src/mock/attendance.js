import { students } from './students'

export const attendanceSessions = [
  { id: 'ses-001', subject: 'Data Structures & Algorithms', department: 'CSE', section: 'A', date: '2026-07-25', time: '09:00 AM', room: 'Lab 204', teacher: 'Dr. Anitha Rao', totalStudents: 62, present: 57, absent: 3, late: 2, status: 'completed', accuracy: 98.4 },
  { id: 'ses-002', subject: 'Machine Learning', department: 'IT', section: 'B', date: '2026-07-25', time: '09:00 AM', room: 'Lab 301', teacher: 'Dr. Meera Nair', totalStudents: 48, present: 44, absent: 3, late: 1, status: 'completed', accuracy: 97.1 },
  { id: 'ses-003', subject: 'Computer Networks', department: 'CSE', section: 'A', date: '2026-07-24', time: '10:00 AM', room: 'Room 112', teacher: 'Prof. Karan Mehta', totalStudents: 62, present: 59, absent: 2, late: 1, status: 'completed', accuracy: 99.0 },
  { id: 'ses-004', subject: 'Digital Signal Processing', department: 'ECE', section: 'A', date: '2026-07-24', time: '11:10 AM', room: 'Room 214', teacher: 'Dr. Vikram Shah', totalStudents: 41, present: 36, absent: 4, late: 1, status: 'completed', accuracy: 96.5 },
  { id: 'ses-005', subject: 'Structural Analysis', department: 'CIVIL', section: 'A', date: '2026-07-25', time: '02:00 PM', room: 'Room 305', teacher: 'Prof. Rajesh Kumar', totalStudents: 38, present: 0, absent: 0, late: 0, status: 'scheduled', accuracy: null },
]

export const weeklyAttendanceTrend = [
  { day: 'Mon', present: 91, absent: 6, late: 3 },
  { day: 'Tue', present: 88, absent: 8, late: 4 },
  { day: 'Wed', present: 93, absent: 5, late: 2 },
  { day: 'Thu', present: 85, absent: 10, late: 5 },
  { day: 'Fri', present: 90, absent: 7, late: 3 },
  { day: 'Sat', present: 79, absent: 15, late: 6 },
]

export const monthlyAttendanceTrend = [
  { month: 'Feb', percent: 86 },
  { month: 'Mar', percent: 88 },
  { month: 'Apr', percent: 84 },
  { month: 'May', percent: 90 },
  { month: 'Jun', percent: 87 },
  { month: 'Jul', percent: 91 },
]

export const departmentAttendance = [
  { name: 'CSE', value: 91 },
  { name: 'ECE', value: 87 },
  { name: 'MECH', value: 82 },
  { name: 'CIVIL', value: 85 },
  { name: 'IT', value: 93 },
]

export const attendanceHeatmap = Array.from({ length: 7 }).map((_, week) =>
  Array.from({ length: 7 }).map((__, day) => ({
    week,
    day,
    value: Math.round(50 + ((week * 7 + day) * 37) % 50),
  }))
)

// per-student daily attendance for the current month (calendar view)
export function generateStudentCalendar(seedOffset = 0) {
  const days = Array.from({ length: 28 }).map((_, i) => {
    const r = ((i + seedOffset) * 53) % 100
    let status = 'present'
    if (r < 8) status = 'absent'
    else if (r < 16) status = 'late'
    return { date: i + 1, status }
  })
  return days
}

export function detectedFacesForSession(sessionId) {
  const pool = students.slice(0, 18)
  return pool.map((s, i) => ({
    id: `face-${sessionId}-${i}`,
    student: i % 9 === 8 ? null : s,
    confidence: i % 9 === 8 ? null : Math.round((88 + Math.random() * 11) * 10) / 10,
    box: { x: 8 + (i % 6) * 16, y: 10 + Math.floor(i / 6) * 30, w: 12, h: 15 },
    status: i % 9 === 8 ? 'unknown' : i % 13 === 0 ? 'duplicate' : 'recognized',
  }))
}
