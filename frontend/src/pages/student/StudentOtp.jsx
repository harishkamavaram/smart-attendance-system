import { OtpScreen } from '@/components/shared/AuthFlows'
export default function StudentOtp() {
  return <OtpScreen loginPath="/student/login" resetPath="/student/reset-password" dashboardPath="/student/login" roleLabel="student" />
}
