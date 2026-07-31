import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import AuthShell from '@/components/shared/AuthShell'
import { Input, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { handleStudentLogin } from '../../services/api/auth/student/auth'

export default function StudentLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { loginStudent } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    // Email Validation
    if (!email.trim()) {
      toast.error("College email is required");
      return false;
    }

    if (email.length > 100) {
      toast.error("Email cannot exceed 100 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    // Password Validation
    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (password.length < 8 || password.length > 20) {
      toast.error("Password must be between 8 and 20 characters");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return;
    setLoading(true)
    try {
      const response = await handleStudentLogin({ email, password })
      if (response.success) {
        console.log('Student login response:', response)
        const user = response.data.student;
        loginStudent(user)
        toast.success(response.data.message || 'Welcome back!')
        navigate('/student/dashboard')
      }
    } catch (error) {
      console.error("Error during student login:", error);
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Student sign in"
      description="Check your attendance, subjects, and notifications."
      footer={<>Are you an admin? <Link to="/admin/login" className="font-medium text-primary hover:underline">Sign in here</Link></>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">College email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" required className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>

            <div className="flex gap-3 text-xs">

              <Link
                to="/student/forgot-password"
                className="font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
              <Link
                to="/student/change-default-password"
                className="font-medium text-primary hover:underline"
              >
                First time login?
              </Link>

            </div>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type={showPassword ? 'text' : 'password'} required className="pl-9 pr-9" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Accounts are created by your institution's admin after registration.
      </p>
    </AuthShell>
  )
}
