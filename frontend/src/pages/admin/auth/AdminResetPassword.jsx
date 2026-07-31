import { ResetPasswordScreen } from '@/components/shared/AuthFlows'
export default function AdminResetPassword() {
  return <ResetPasswordScreen loginPath="/admin/login" roleLabel="admin" />
}
