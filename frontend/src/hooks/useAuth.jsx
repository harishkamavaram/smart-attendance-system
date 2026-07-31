import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    const stored = localStorage.getItem('admin_user')
    return stored ? JSON.parse(stored) : null
  })
  const [studentUser, setStudentUser] = useState(() => {
    const stored = localStorage.getItem('student_user')
    return stored ? JSON.parse(stored) : null
  })

  const loginAdmin = useCallback((user) => {
    localStorage.setItem('admin_user', JSON.stringify(user))
    setAdminUser(user)
  }, [])

  const loginStudent = useCallback((user) => {
    localStorage.setItem('student_user', JSON.stringify(user))
    setStudentUser(user)
  }, [])

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem('admin_user')
    setAdminUser(null)
  }, [])

  const logoutStudent = useCallback(() => {
    localStorage.removeItem('student_user')
    setStudentUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ adminUser, studentUser, loginAdmin, loginStudent, logoutAdmin, logoutStudent }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
