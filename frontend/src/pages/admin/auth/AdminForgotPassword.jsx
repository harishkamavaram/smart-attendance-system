import { ForgotPasswordScreen } from '@/components/shared/AuthFlows'
export default function AdminForgotPassword() {
  return <ForgotPasswordScreen loginPath="/admin/login" otpPath="/admin/otp" roleLabel="admin" />
}
