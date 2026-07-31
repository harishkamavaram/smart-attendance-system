export const departments = [
  { id: 'dep-cse', name: 'Computer Science & Engineering', code: 'CSE', students: 412, faculty: 24, hod: 'Dr. Anitha Rao' },
  { id: 'dep-ece', name: 'Electronics & Communication', code: 'ECE', students: 318, faculty: 19, hod: 'Dr. Vikram Shah' },
  { id: 'dep-mech', name: 'Mechanical Engineering', code: 'MECH', students: 276, faculty: 17, hod: 'Dr. Sunita Patel' },
  { id: 'dep-civil', name: 'Civil Engineering', code: 'CIVIL', students: 198, faculty: 13, hod: 'Prof. Rajesh Kumar' },
  { id: 'dep-it', name: 'Information Technology', code: 'IT', students: 289, faculty: 16, hod: 'Dr. Meera Nair' },
]

export const teachers = [
  { id: 'tch-001', name: 'Dr. Anitha Rao', department: 'CSE', subject: 'Data Structures', email: 'anitha.rao@university.edu', avatar: null },
  { id: 'tch-002', name: 'Prof. Karan Mehta', department: 'CSE', subject: 'Computer Networks', email: 'karan.mehta@university.edu', avatar: null },
  { id: 'tch-003', name: 'Dr. Vikram Shah', department: 'ECE', subject: 'Digital Signal Processing', email: 'vikram.shah@university.edu', avatar: null },
  { id: 'tch-004', name: 'Dr. Meera Nair', department: 'IT', subject: 'Machine Learning', email: 'meera.nair@university.edu', avatar: null },
  { id: 'tch-005', name: 'Prof. Rajesh Kumar', department: 'CIVIL', subject: 'Structural Analysis', email: 'rajesh.kumar@university.edu', avatar: null },
  { id: 'tch-006', name: 'Dr. Sunita Patel', department: 'MECH', subject: 'Thermodynamics', email: 'sunita.patel@university.edu', avatar: null },
]

export const subjects = [
  { id: 'sub-001', name: 'Data Structures & Algorithms', code: 'CS201', department: 'CSE', credits: 4, teacher: 'Dr. Anitha Rao' },
  { id: 'sub-002', name: 'Computer Networks', code: 'CS301', department: 'CSE', credits: 3, teacher: 'Prof. Karan Mehta' },
  { id: 'sub-003', name: 'Operating Systems', code: 'CS302', department: 'CSE', credits: 4, teacher: 'Dr. Anitha Rao' },
  { id: 'sub-004', name: 'Machine Learning', code: 'IT401', department: 'IT', credits: 4, teacher: 'Dr. Meera Nair' },
  { id: 'sub-005', name: 'Digital Signal Processing', code: 'EC301', department: 'ECE', credits: 3, teacher: 'Dr. Vikram Shah' },
  { id: 'sub-006', name: 'Structural Analysis', code: 'CE302', department: 'CIVIL', credits: 3, teacher: 'Prof. Rajesh Kumar' },
]

export const timetable = [
  { day: 'Monday', slots: [
    { time: '09:00 - 09:50', subject: 'Data Structures & Algorithms', room: 'Lab 204', teacher: 'Dr. Anitha Rao' },
    { time: '10:00 - 10:50', subject: 'Computer Networks', room: 'Room 112', teacher: 'Prof. Karan Mehta' },
    { time: '11:10 - 12:00', subject: 'Operating Systems', room: 'Room 108', teacher: 'Dr. Anitha Rao' },
  ]},
  { day: 'Tuesday', slots: [
    { time: '09:00 - 09:50', subject: 'Machine Learning', room: 'Lab 301', teacher: 'Dr. Meera Nair' },
    { time: '10:00 - 10:50', subject: 'Data Structures & Algorithms', room: 'Room 112', teacher: 'Dr. Anitha Rao' },
  ]},
  { day: 'Wednesday', slots: [
    { time: '09:00 - 09:50', subject: 'Computer Networks', room: 'Room 112', teacher: 'Prof. Karan Mehta' },
    { time: '11:10 - 12:00', subject: 'Operating Systems', room: 'Room 108', teacher: 'Dr. Anitha Rao' },
  ]},
  { day: 'Thursday', slots: [
    { time: '09:00 - 09:50', subject: 'Machine Learning', room: 'Lab 301', teacher: 'Dr. Meera Nair' },
    { time: '10:00 - 10:50', subject: 'Data Structures & Algorithms', room: 'Lab 204', teacher: 'Dr. Anitha Rao' },
  ]},
  { day: 'Friday', slots: [
    { time: '09:00 - 09:50', subject: 'Operating Systems', room: 'Room 108', teacher: 'Dr. Anitha Rao' },
    { time: '10:00 - 10:50', subject: 'Computer Networks', room: 'Room 112', teacher: 'Prof. Karan Mehta' },
  ]},
]
