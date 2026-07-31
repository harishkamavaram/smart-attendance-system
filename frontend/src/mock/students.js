const firstNames = ['Aarav', 'Vivaan', 'Aditi', 'Ananya', 'Ishaan', 'Diya', 'Kabir', 'Myra', 'Reyansh', 'Saanvi', 'Arjun', 'Kiara', 'Vihaan', 'Anika', 'Rohan', 'Pooja', 'Aryan', 'Neha', 'Karthik', 'Sneha', 'Dhruv', 'Meera', 'Yash', 'Riya', 'Sai', 'Tanvi', 'Nikhil', 'Priya', 'Rahul', 'Aisha']
const lastNames = ['Sharma', 'Verma', 'Reddy', 'Nair', 'Iyer', 'Gupta', 'Patel', 'Singh', 'Rao', 'Menon', 'Kumar', 'Joshi', 'Das', 'Pillai', 'Chauhan', 'Bansal', 'Kapoor', 'Malhotra', 'Shah', 'Desai']
const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT']
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const sections = ['A', 'B', 'C']

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

const rand = seededRandom(42)

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)]
}

export const students = Array.from({ length: 64 }).map((_, i) => {
  const first = pick(firstNames)
  const last = pick(lastNames)
  const dept = pick(departments)
  const year = pick(years)
  const attendance = Math.round(55 + rand() * 45)
  const regStatus = rand() > 0.12 ? 'registered' : 'pending'
  const faceStatus = regStatus === 'registered' ? (rand() > 0.08 ? 'completed' : 'processing') : 'not_started'
  const rollNumber = `${dept}${year[0]}${String(i + 1).padStart(3, '0')}`
  return {
    id: `stu-${String(i + 1).padStart(3, '0')}`,
    rollNumber,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@university.edu`,
    phone: `+91 9${Math.floor(100000000 + rand() * 899999999)}`,
    department: dept,
    year,
    section: pick(sections),
    attendancePercent: attendance,
    status: attendance >= 75 ? 'good' : attendance >= 60 ? 'warning' : 'critical',
    registrationStatus: regStatus,
    faceRegistrationStatus: faceStatus,
    avatar: null,
    joinedOn: `2023-0${(i % 6) + 1}-${String((i % 27) + 1).padStart(2, '0')}`,
    guardianName: `${pick(firstNames)} ${last}`,
    guardianPhone: `+91 9${Math.floor(100000000 + rand() * 899999999)}`,
    address: `${Math.floor(rand() * 200) + 1}, ${pick(['MG Road', 'Park Street', 'Lake View', 'Green Valley', 'Sunrise Colony'])}, Hyderabad`,
  }
})

export const getStudentById = (id) => students.find((s) => s.id === id)

export const bulkUploadHistory = [
  { id: 'up-001', fileName: 'cse_year1_2026.xlsx', type: 'Excel', uploadedOn: '2026-07-20 10:14 AM', totalRows: 62, registered: 60, failed: 2, status: 'completed' },
  { id: 'up-002', fileName: 'it_year2_list.csv', type: 'CSV', uploadedOn: '2026-07-18 03:42 PM', totalRows: 48, registered: 48, failed: 0, status: 'completed' },
  { id: 'up-003', fileName: 'ece_admissions.pdf', type: 'PDF', uploadedOn: '2026-07-15 09:05 AM', totalRows: 35, registered: 31, failed: 4, status: 'completed' },
  { id: 'up-004', fileName: 'mech_transfer_students.docx', type: 'DOC', uploadedOn: '2026-07-24 11:30 AM', totalRows: 12, registered: 0, failed: 0, status: 'processing' },
]
