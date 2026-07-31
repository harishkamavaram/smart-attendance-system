import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import AuthShell from "@/components/shared/AuthShell";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { handleUpdatePassword } from "../../services/api/auth/student/auth";

export default function ChangeDefaultPassword() {
    const navigate = useNavigate();

    //   const [defaultPassword, setDefaultPassword] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

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

        // New Password Validation
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
                "New password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            );
            return false;
        }

        // Confirm Password Validation
        if (!confirmPassword.trim()) {
            toast.error("Please confirm your new password");
            return false;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const data = {
                email,
                password: newPassword
            }
            const response = await handleUpdatePassword(data);
            console.log("Data: ", data);

            toast.success("Password changed successfully");
            navigate("/student/login");
        } catch (err) {
            console.error("Unable to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            title="Change Default Password"
            description="Set a new password before accessing your student account."
            footer={
                <>
                    Remember your password?{" "}
                    <Link
                        to="/student/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="email">College Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            required
                            className="pl-9"
                            placeholder="student@college.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* <div>
          <Label htmlFor="defaultPassword">Default Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="defaultPassword"
              type={show ? "text" : "password"}
              required
              className="pl-9 pr-10"
              value={defaultPassword}
              onChange={(e) => setDefaultPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div> */}

                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Password"}
                </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
                This page is only for students signing in with the password provided by
                their institution for the first time.
            </p>
        </AuthShell>
    );
}