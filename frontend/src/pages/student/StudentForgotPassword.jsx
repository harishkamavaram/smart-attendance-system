import { ForgotPasswordScreen } from '@/components/shared/AuthFlows'
export default function StudentForgotPassword() {
  return <ForgotPasswordScreen loginPath="/student/login" otpPath="/student/otp" roleLabel="student" />
}
