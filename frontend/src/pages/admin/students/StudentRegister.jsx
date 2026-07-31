import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ScanFace, UserPlus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input, Label } from '@/components/ui/Input'
import { Select } from '@/components/ui/Controls'
import { Button } from '@/components/ui/Button'
import { Breadcrumb } from '@/components/ui/Controls'
import { toast } from 'sonner'
import { handleRegisterSingleStudent } from '../../../services/api/auth/student/auth'

export default function StudentRegister() {
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [batch, setBatch] = useState("");
  const [section, setSection] = useState("");

  const [courseCode, setCourseCode] = useState("");
  const [institueCode, setInstituteCode] = useState("");

  const [parentName, setParentName] = useState("");
  const [parentMobileNumber, setParentMobileNumber] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const navigate = useNavigate()

  // Need to make it dynamic
  const courseOptions = [
    { value: 1, label: "Computer Science Engineering" },
    { value: 2, label: "Electronics & Communication" },
    { value: 3, label: "Mechanical Engineering" },
    { value: 4, label: "Civil Engineering" },
  ];

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const batchRegex = /^\d{4}$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    // Roll Number
    if (!rollNumber.trim()) {
      toast.error("Roll number is required");
      return false;
    }

    if (rollNumber.trim().length < 3 || rollNumber.trim().length > 20) {
      toast.error("Roll number must be between 3 and 20 characters");
      return false;
    }

    // First Name
    if (!firstName.trim()) {
      toast.error("First name is required");
      return false;
    }

    if (firstName.trim().length < 2 || firstName.trim().length > 100) {
      toast.error("First name must be between 2 and 100 characters");
      return false;
    }

    if (!nameRegex.test(firstName.trim())) {
      toast.error("First name can contain only letters and spaces");
      return false;
    }

    // Last Name
    if (!lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }

    if (lastName.trim().length < 2 || lastName.trim().length > 100) {
      toast.error("Last name must be between 2 and 100 characters");
      return false;
    }

    if (!nameRegex.test(lastName.trim())) {
      toast.error("Last name can contain only letters and spaces");
      return false;
    }

    // Email
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (email.trim().length > 150) {
      toast.error("Email cannot exceed 150 characters");
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      toast.error("Invalid email format");
      return false;
    }

    // Batch
    if (!batch.trim()) {
      toast.error("Batch is required");
      return false;
    }

    if (!batchRegex.test(batch.trim())) {
      toast.error("Batch must be a valid 4-digit year (e.g. 2023)");
      return false;
    }

    // Course
    if (!courseCode || courseCode <= 0) {
      toast.error("Please select a course");
      return false;
    }

    // Section
    if (!section.trim()) {
      toast.error("Section is required");
      return false;
    }

    if (section.trim().length > 10) {
      toast.error("Section cannot exceed 10 characters");
      return false;
    }

    // Parent Name
    if (!parentName.trim()) {
      toast.error("Parent name is required");
      return false;
    }

    if (parentName.trim().length < 2 || parentName.trim().length > 100) {
      toast.error("Parent name must be between 2 and 100 characters");
      return false;
    }

    if (!nameRegex.test(parentName.trim())) {
      toast.error("Parent name can contain only letters and spaces");
      return false;
    }

    // Parent Mobile Number
    if (!parentMobileNumber.trim()) {
      toast.error("Parent mobile number is required");
      return false;
    }

    if (!mobileRegex.test(parentMobileNumber.trim())) {
      toast.error("Enter a valid 10-digit mobile number");
      return false;
    }

    // Parent Email
    if (!parentEmail.trim()) {
      toast.error("Parent email is required");
      return false;
    }

    if (parentEmail.trim().length > 150) {
      toast.error("Parent email cannot exceed 150 characters");
      return false;
    }

    if (!emailRegex.test(parentEmail.trim())) {
      toast.error("Invalid parent email format");
      return false;
    }

    // Institute
    if (!institueCode || institueCode <= 0) {
      toast.error("Please select an institute");
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!validateForm) return;

    try {
      const adminUser = JSON.parse(localStorage.getItem("admin_user"));

      const institueCode = adminUser?.institute?.id;
      console.log("institueCode: ", institueCode)
      const data = {
        rollNumber: rollNumber.trim().toUpperCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        batch: batch.trim(),
        courseCode: courseCode,
        section: section.trim().toUpperCase(),
        parentName: parentName.trim(),
        parentMobileNumber: parentMobileNumber.trim(),
        parentEmail: parentEmail.trim().toLowerCase(),
        institueCode,
      };

      const response = await handleRegisterSingleStudent(data);
      console.log("Response: ", response)
      if (response.success) {
        toast.success(response.data.message || 'Student registered — face enrollment pending')
        navigate('/admin/students')
      }
    } catch (error) {
      console.error("Error in student registration: " + error)
    } finally {
      setLoading(false)
    }
    setTimeout(() => {
    }, 800)
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Students', href: '/admin/students' }, { label: 'Register' }]} />
      <Link to="/admin/students" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to students
      </Link>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Register a new student</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">

              {/* First Name */}
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Harish"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Kamavaram"
                  required
                />
              </div>

              {/* Roll Number */}
              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                  placeholder="CSE23001"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Student Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                />
              </div>

              {/* Batch */}
              <div>
                <Label htmlFor="batch">Batch</Label>
                <Input
                  id="batch"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="2023"
                  required
                />
              </div>

              {/* Section */}
              <div>
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value.toUpperCase())}
                  placeholder="A"
                  required
                />
              </div>

              {/* Course */}
              <div>
                <Label>Course</Label>
                <Select
                  value={courseCode}
                  onChange={setCourseCode}
                  placeholder="Select Course"
                  options={courseOptions}
                />
              </div>



              {/* Parent Name */}
              <div>
                <Label htmlFor="parentName">Parent Name</Label>
                <Input
                  id="parentName"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Rakesh"
                  required
                />
              </div>

              {/* Parent Mobile */}
              <div>
                <Label htmlFor="parentMobileNumber">Parent Mobile</Label>
                <Input
                  id="parentMobileNumber"
                  value={parentMobileNumber}
                  onChange={(e) => setParentMobileNumber(e.target.value)}
                  placeholder="9876543210"
                  required
                />
              </div>

              {/* Parent Email */}
              <div className="sm:col-span-2">
                <Label htmlFor="parentEmail">Parent Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@example.com"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <Link to="/admin/students">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>

                <Button type="submit" disabled={loading}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {loading ? "Registering..." : "Register Student"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle>Face registration</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <ScanFace className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium">Face capture will begin after registration</p>
              <p className="text-xs text-muted-foreground">The student completes a guided scan on their next login, or staff can capture it now on a connected device.</p>
              <Button variant="outline" size="sm" onClick={() => toast.info('Camera capture is connected to hardware later')}>Capture now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
