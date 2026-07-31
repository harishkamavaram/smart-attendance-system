import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, KeyRound, EyeOff, Eye } from 'lucide-react'
import AuthShell from '@/components/shared/AuthShell'
import { Input, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { handleForgotPassword, handleUpdatePassword, handleVerifyOtp } from '../../services/api/auth/admin/auth'
import { handleStudentForgotPassword, handleStudentUpdatePassword, handleStudentVerifyOtp } from '../../services/api/auth/student/auth'

const roles = Object.freeze({
  ADMIN: 'admin',
  STUDENT: 'student',
});

export function ForgotPasswordScreen({ loginPath, otpPath, roleLabel }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // console.log("ForgotPasswordScreen Props:", { loginPath, otpPath, roleLabel });

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
    return true;
  };

  const submit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return;
    setLoading(true)
    try {
      let response = null;
      if (roleLabel === roles.ADMIN) {
        response = await handleForgotPassword({ email });
      } else if (roleLabel === roles.STUDENT) {
        response = await handleStudentForgotPassword({ email });
      }
      console.log('Resend verification email response:', response);
      if (response && response.success) {
        toast.success(response?.data?.message || 'Verification email sent successfully');
        localStorage.setItem('forgot_email', email);
        navigate(otpPath)
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Forgot password"
      description={`Enter your ${roleLabel} email and we'll send a one-time code to reset it.`}
      footer={<Link to={loginPath} className="font-medium text-primary hover:underline">Back to sign in</Link>}
    >
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" required className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending code…' : 'Send reset code'}
        </Button>
      </form>
    </AuthShell>
  )
}

export function OtpScreen({ loginPath, resetPath, roleLabel, dashboardPath }) {
  const [values, setValues] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const refs = useRef([])
  const navigate = useNavigate()

  const handleChange = (i, v) => {
    if (!/^\d?$/.test(v)) return
    const next = [...values]
    next[i] = v
    setValues(next)
    if (v && i < 5) refs.current[i + 1]?.focus()
  }

  const validateForm = () => {
    const OTP = values.join("");
    const email = localStorage.getItem("forgot_email");

    if (!email) {
      toast.error("Email not found. Please start the forgot password process again.");
      return false;
    }

    if (!OTP.trim()) {
      toast.error("OTP is required.");
      return false;
    }

    if (!/^\d{6}$/.test(OTP)) {
      toast.error("OTP must be exactly 6 digits.");
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const OTP = values.join("");
      const email = localStorage.getItem("forgot_email");

      console.log("Entered OTP:", OTP);
      let response = null;
      if (roleLabel === roles.ADMIN) {
        response = await handleVerifyOtp({ email, OTP });
      } else if (roleLabel === roles.STUDENT) {
        response = await handleStudentVerifyOtp({ email, OTP });
      }
      console.log("OTP Verification Response:", response);

      if (response.success) {
        localStorage.setItem("forgot_otp", OTP);
        toast.success(response.data.message || "Code verified");
        navigate(resetPath);

      } else {
        toast.error(response.data.message || "Invalid OTP");
        navigate(dashboardPath || loginPath);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Verify your identity"
      description={`Enter the 6-digit code sent to your ${roleLabel} email.`}
      footer={<Link to={loginPath} className="font-medium text-primary hover:underline">Back to sign in</Link>}
    >
      <form className="space-y-5" onSubmit={submit}>
        <div className="flex justify-between gap-2">
          {values.map((v, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
              maxLength={1}
              inputMode="numeric"
              className="h-12 w-11 rounded-lg border border-border bg-card text-center text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-12"
            />
          ))}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying…' : 'Verify code'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Didn't get a code? <button type="button" onClick={() => toast.success('Code resent')} className="font-medium text-primary hover:underline">Resend</button>
        </p>
      </form>
    </AuthShell>
  )
}

export function ResetPasswordScreen({ loginPath,roleLabel }) {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  const validateForm = () => {
    if (!password.trim()) {
      toast.error("New password is required");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    if (password.length > 100) {
      toast.error("Password cannot exceed 100 characters");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,100}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number and special character"
      );
      return false;
    }

    if (!confirmPassword.trim()) {
      toast.error("Confirm password is required");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return;
    setLoading(true)
    try {
      const email = localStorage.getItem('forgot_email')
      const OTP = localStorage.getItem('forgot_otp')
      let response = null;
      if (roleLabel === roles.ADMIN) {
        response = await handleUpdatePassword({ email, OTP, password })
      } else if (roleLabel === roles.STUDENT) {
        response = await handleStudentUpdatePassword({ email, OTP, password })
      }
      console.log('Password reset response:', response)
      if (response && response.success) {
        localStorage.removeItem('forgot_email')
        localStorage.removeItem('forgot_otp')
        toast.success(response.data.message || 'Password reset successfully')
        navigate(loginPath)
      }
    } catch (error) {
      console.error('Error resetting password:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Set a new password"
      description="Choose a strong password you haven't used before."
      footer={
        <Link
          to={loginPath}
          className="font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <Label htmlFor="password">New Password</Label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="pl-9 pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirm">Confirm Password</Label>

          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="confirm"
              type={showConfirmPassword ? "text" : "password"}
              className="pl-9 pr-10"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </AuthShell>
  )
}
