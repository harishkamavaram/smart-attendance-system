import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Misc'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { useTheme } from '@/hooks/useTheme'
import { Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'
import { handleStudentChangePassword } from '../../services/api/auth/student/auth'
import { useState } from 'react'

export default function StudentSettings() {
  const { theme, toggleTheme } = useTheme()
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const validateForm = () => {
    // Current Password
    if (!currentPassword.trim()) {
      toast.error("Current password is required");
      return false;
    }

    // New Password
    if (!newPassword.trim()) {
      toast.error("New password is required");
      return false;
    }

    if (newPassword.length < 8 || newPassword.length > 20) {
      toast.error("New password must be between 8 and 20 characters");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return false;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from the current password");
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = {
        oldPassword: currentPassword,
        newPassword,
      };

      const response = await handleStudentChangePassword(data);
      console.log("Response of Change Password: ", response)
      if (response.success) {
        toast.success(response.data.message || "Password updated successfully");

        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            Dark mode
          </div>
          <Switch checked={theme === 'dark'} onChange={toggleTheme} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notification preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {['Low attendance alerts', 'Session reminders', 'Weekly summary email'].map((label, i) => (
            <div key={label} className="flex items-center justify-between">
              <p className="text-sm">{label}</p>
              <Switch checked={i !== 2} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 max-w-sm">

          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}
