import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import LocationPicker from "@/components/maps/LocationPicker";
import { handleRegisterAdmin } from "../../../services/api/auth/admin/auth";
import { Sparkles } from "lucide-react";

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
    location: {
      latitude: "",
      longitude: "",
      allowedRadius: 100,
      locationName: "",
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

  // LocationPicker reports the full location object on every change.
  const handleLocationChange = (location) => {
    setFormData((prev) => ({
      ...prev,
      location,
    }));
  };

  const validateForm = () => {
    const { institute, location, superAdmin } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;

    // ======================
    // Institute Validation
    // ======================

    if (institute.name.trim().length < 3 || institute.name.trim().length > 100) {
      toast.error("Institute name must be between 3 and 100 characters.");
      return false;
    }

    if (
      institute.instituteCode === "" ||
      !Number.isFinite(Number(institute.instituteCode)) ||
      Number(institute.instituteCode) <= 0
    ) {
      toast.error("Institute code must be greater than 0.");
      return false;
    }

    if (!emailRegex.test(institute.email.trim())) {
      toast.error("Please enter a valid institute email.");
      return false;
    }

    if (!mobileRegex.test(institute.mobileNumber.trim())) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return false;
    }

    if (
      institute.address.trim().length < 10 ||
      institute.address.trim().length > 255
    ) {
      toast.error("Address must be between 10 and 255 characters.");
      return false;
    }

    // ======================
    // Location Validation
    // ======================

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);
    const radius = Number(location.allowedRadius);

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      toast.error("Please select a valid latitude.");
      return false;
    }

    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      toast.error("Please select a valid longitude.");
      return false;
    }

    if (!Number.isFinite(radius) || radius <= 0 || radius > 10000) {
      toast.error("Allowed radius must be between 1 and 10000 meters.");
      return false;
    }

    if (
      location.locationName.trim().length < 3 ||
      location.locationName.trim().length > 100
    ) {
      toast.error("Location name must be between 3 and 100 characters.");
      return false;
    }

    // ======================
    // Super Admin Validation
    // ======================

    if (
      superAdmin.name.trim().length < 3 ||
      superAdmin.name.trim().length > 50
    ) {
      toast.error("Super admin name must be between 3 and 50 characters.");
      return false;
    }

    if (!emailRegex.test(superAdmin.email.trim())) {
      toast.error("Please enter a valid super admin email.");
      return false;
    }

    if (!passwordRegex.test(superAdmin.password)) {
      toast.error(
        "Password must be 8-20 characters long and include uppercase, lowercase, a number, and a special character."
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
        location: {
          ...formData.location,
          latitude: Number(formData.location.latitude),
          longitude: Number(formData.location.longitude),
          allowedRadius: Number(formData.location.allowedRadius),
          locationName: formData.location.locationName.trim(),
        },
        superAdmin: formData.superAdmin,
      };
      console.log("Submitting payload:", payload);
      const response = await handleRegisterAdmin(payload);
      console.log("Registration response:", response);
      if (response.success) {
        toast.success(response.data.message || "Account created. Verify your email to continue.");
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
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* ================= Header ================= */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <Link to="/" className="flex items-center gap-2 ">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <Sparkles className="h-5 w-5 " />
          </div>

          <span className="font-display text-xl font-semibold">
            FaceTrack
          </span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Already have an account?</span>
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link to="/admin/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* ================= Main ================= */}
      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight">Create Your Institution</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Register your institution and create the Super Admin account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-[calc(100vh-64px-140px)] flex-1 flex-col"
        >
          <div className="grid flex-1 gap-5 xl:grid-cols-12">

            {/* ================= Institute ================= */}
            <div className="rounded-xl border bg-background p-5 shadow-sm xl:col-span-3">
              <h2 className="mb-4 text-lg font-semibold">Institute Details</h2>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="institutionName">Institution Name</Label>
                  <Input
                    id="institutionName"
                    className="h-9"
                    placeholder="ABC Engineering College"
                    value={formData.institute.name}
                    onChange={(e) =>
                      handleChange("institute", "name", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="institutionCode">Institute Code</Label>
                    <Input
                      id="institutionCode"
                      className="h-9"
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
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      className="h-9"
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
                  <Label htmlFor="institutionEmail">Institute Email</Label>
                  <Input
                    id="institutionEmail"
                    className="h-9"
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
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    className="h-9"
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
            </div>

            {/* ================= Super Admin ================= */}
            <div className="rounded-xl border bg-background p-5 shadow-sm xl:col-span-3">
              <h2 className="mb-4 text-lg font-semibold">Super Admin</h2>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="adminName">Full Name</Label>
                  <Input
                    id="adminName"
                    className="h-9"
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
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    className="h-9"
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    className="h-9"
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
              </div>
            </div>

            {/* ================= Location ================= */}
            <div className="rounded-xl bg-background  shadow-sm xl:col-span-6">
              {/* <h2 className="mb-4 text-lg font-semibold">Campus Location</h2> */}
              <div className="h-[calc(100%-2.5rem)] overflow-hidden rounded-lg">
                <LocationPicker
                  value={formData.location}
                  addressHint={formData.institute.address}
                  onLocationChange={handleLocationChange}
                  compact
                />
              </div>
            </div>

          </div>

          {/* ================= Bottom Action Bar ================= */}
          <div className="sticky bottom-0 mt-5 flex items-center justify-between border-t bg-background/95 px-1 py-4 backdrop-blur">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>

            <Button
              type="submit"
              className="h-10 w-48"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
