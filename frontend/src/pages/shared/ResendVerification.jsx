import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import AuthShell from "@/components/shared/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { toast } from "sonner";
import { handleResendVerificationEmail } from "@/services/api/auth/admin/auth";

export default function ResendVerification() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!email.trim()) {
            toast.error("Email is required");
            return false;
        }

        if (email.length > 100) {
            toast.error("Email cannot exceed 100 characters");
            return false;
        }

        const emailRegex =
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await handleResendVerificationEmail({ email });
            console.log("Resend Verification Response:", response);
            if (response.success) {
                toast.success(response.data.message || "Verification email sent successfully.");
            } else {
                console.error("Resend verification failed:", response);
            }
        } catch (error) {
            console.error("Error resending verification email:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            title="Resend verification email"
            description="We'll send a new verification link to your registered email address."
            footer={
                <>
                    Remember your password?{" "}
                    <Link
                        to="/student/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Back to Sign In
                    </Link>
                </>
            }
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="email">Registered email</Label>

                    <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            id="email"
                            type="email"
                            className="pl-9"
                            placeholder="admin@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading
                        ? "Sending verification email..."
                        : "Send Verification Email"}
                </Button>
            </form>
        </AuthShell>
    );
}