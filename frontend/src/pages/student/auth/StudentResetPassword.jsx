import { ResetPasswordScreen } from '@/components/shared/AuthFlows'
export default function StudentResetPassword() {
  return <ResetPasswordScreen loginPath="/student/login" roleLabel="student" />
}
