import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/components/shared/AuthShell";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { handleRegisterAdmin } from "../../../services/api/auth/admin/auth";

export default function AdminSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    institute: {
      name: "",
      instituteCode: "",
      email: "",
      mobileNumber: "",
      address: "",
    },
    superAdmin: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

const validateForm = () => {
  const { institute, superAdmin } = formData;

  // Institute Name
  if (institute.name.trim().length < 3 || institute.name.trim().length > 100) {
    toast.error("Institute name must be between 3 and 100 characters");
    return false;
  }

  // Institute Code
  if (!Number(institute.instituteCode) || Number(institute.instituteCode) <= 0) {
    toast.error("Institute code must be greater than 0");
    return false;
  }

  // Institute Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(institute.email)) {
    toast.error("Invalid institute email format");
    return false;
  }

  // Mobile Number
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(institute.mobileNumber)) {
    toast.error("Mobile number must be a valid 10-digit Indian mobile number");
    return false;
  }

  // Address
  if (institute.address.trim().length < 10 || institute.address.trim().length > 255) {
    toast.error("Address must be between 10 and 255 characters");
    return false;
  }

  // Super Admin Name
  if (superAdmin.name.trim().length < 3 || superAdmin.name.trim().length > 50) {
    toast.error("Super admin name must be between 3 and 50 characters");
    return false;
  }

  // Super Admin Email
  if (!emailRegex.test(superAdmin.email)) {
    toast.error("Invalid super admin email format");
    return false;
  }

  // Password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;

  if (!passwordRegex.test(superAdmin.password)) {
    toast.error(
      "Password must be 8-20 characters and contain uppercase, lowercase, digit, and special character."
    );
    return false;
  }

  return true;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

  if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        institute: {
          ...formData.institute,
          instituteCode: Number(formData.institute.instituteCode),
        },
        superAdmin: formData.superAdmin,
      };
      console.log("Submitting payload:", payload);
      const response = await handleRegisterAdmin(payload);
      console.log("Registration response:", response);
      if(response.success) {
        toast.success(response.data.message ||"Account created. Verify your email to continue.");
        navigate("/admin/login");
      } else {
        console.error("Registration failed:", response);
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Your Institution"
      description="Register your institution and create the Super Admin account."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/admin/login"
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ================= Institute ================= */}

          <div className="space-y-4 rounded-xl border p-5">

            <h2 className="text-lg font-semibold">
              Institute Details
            </h2>

            <div>
              <Label htmlFor="institutionName">
                Institution Name
              </Label>

              <Input
                id="institutionName"
                placeholder="ABC Engineering College"
                value={formData.institute.name}
                onChange={(e) =>
                  handleChange(
                    "institute",
                    "name",
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <Label htmlFor="institutionCode">
                  Institute Code
                </Label>

                <Input
                  id="institutionCode"
                  type="number"
                  placeholder="1001"
                  value={formData.institute.instituteCode}
                  onChange={(e) =>
                    handleChange(
                      "institute",
                      "instituteCode",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="mobile">
                  Mobile Number
                </Label>

                <Input
                  id="mobile"
                  placeholder="9876543210"
                  value={formData.institute.mobileNumber}
                  onChange={(e) =>
                    handleChange(
                      "institute",
                      "mobileNumber",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

            </div>

            <div>
              <Label htmlFor="institutionEmail">
                Institute Email
              </Label>

              <Input
                id="institutionEmail"
                type="email"
                placeholder="info@college.edu"
                value={formData.institute.email}
                onChange={(e) =>
                  handleChange(
                    "institute",
                    "email",
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="address">
                Address
              </Label>

              <Input
                id="address"
                placeholder="Hyderabad, Telangana"
                value={formData.institute.address}
                onChange={(e) =>
                  handleChange(
                    "institute",
                    "address",
                    e.target.value
                  )
                }
                required
              />
            </div>

          </div>

          {/* ================= Super Admin ================= */}

          <div className="space-y-4 rounded-xl border p-5">

            <h2 className="text-lg font-semibold">
              Super Admin
            </h2>

            <div>
              <Label htmlFor="adminName">
                Full Name
              </Label>

              <Input
                id="adminName"
                placeholder="John Doe"
                value={formData.superAdmin.name}
                onChange={(e) =>
                  handleChange(
                    "superAdmin",
                    "name",
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="adminEmail">
                Email
              </Label>

              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@college.edu"
                value={formData.superAdmin.email}
                onChange={(e) =>
                  handleChange(
                    "superAdmin",
                    "email",
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.superAdmin.password}
                onChange={(e) =>
                  handleChange(
                    "superAdmin",
                    "password",
                    e.target.value
                  )
                }
                required
              />
            </div>
{/* 
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">
                Super Admin Permissions
              </p>

              <ul className="list-disc ml-5 space-y-1">
                <li>Manage departments</li>
                <li>Manage faculty & students</li>
                <li>View attendance reports</li>
                <li>Configure institution settings</li>
              </ul>
            </div> */}

          </div>

        </div>

        <Button
          type="submit"
          className="w-full h-11"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>

      </form>
    </AuthShell>
  );
}