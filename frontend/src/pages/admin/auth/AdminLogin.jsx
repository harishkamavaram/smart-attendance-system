import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import AuthShell from '@/components/shared/AuthShell'
import { Input, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { handleLoginAdmin } from '../../../services/api/auth/admin/auth'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { loginAdmin } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    // Email Validation
    if (!email.trim()) {
      toast.error("Admin email is required");
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

      const response = await handleLoginAdmin({ email, password })
      console.log('Admin login response:', response)
      const user = response.data.admin
      // console.log('Admin user data:', user)
      loginAdmin(user)
      navigate('/admin/dashboard')

    } catch (error) {
      console.error('Admin login error:', error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Admin sign in"
      description="Manage students, sessions, and reports for your institution."
      footer={<>Are you a student? <Link to="/student/login" className="font-medium text-primary hover:underline">Sign in here</Link></>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Institution email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" required className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@university.edu" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <div className="flex flex-col items-end gap-1">
              <Link
                to="/admin/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>

              <Link
                to="/resend-verification"
                className="text-xs font-medium text-primary hover:underline"
              >
                Didn't verify your email?
              </Link>
            </div></div>
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
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New institution? <Link to="/admin/signup" className="font-medium text-primary hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  )
}
