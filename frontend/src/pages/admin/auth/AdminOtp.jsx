import { OtpScreen } from '@/components/shared/AuthFlows'
export default function AdminOtp() {
  return <OtpScreen loginPath="/admin/login" resetPath="/admin/reset-password" roleLabel="admin" />
}
