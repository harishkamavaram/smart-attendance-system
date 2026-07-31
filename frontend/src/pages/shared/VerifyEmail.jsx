import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { handleVerifyToken } from "../../services/api/auth/admin/auth";
import { useAuth } from "../../hooks/useAuth";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginAdmin } = useAuth()

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await handleVerifyToken({ token, email });
                console.log(response);
                if (response.success) {
                    toast.success(response.data.message);
                    const user = response.data.admin
                    loginAdmin(user)
                    navigate("/admin/dashboard");
                }
            } catch (error) {
                console.error(error);
                navigate("/resend-verification");
            }
        };

        verifyEmail();
    }, [token, email]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-whilte-900">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500"></div>
        </div>
    );
}