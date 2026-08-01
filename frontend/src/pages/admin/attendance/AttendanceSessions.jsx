import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { Input, Label } from '@/components/ui/Input'
import { Select, Breadcrumb } from '@/components/ui/Controls'
import { attendanceSessionsMock } from '@/mock/attendance'
import { subjects } from '@/mock/academics'
import { toast } from 'sonner'
import { handleCreateAttendanceSession, handleFetchAttendanceSessions } from '../../../services/api/attendance/api'

export default function AttendanceSessions() {
  const [open, setOpen] = useState(false)
  // Form state
  const [selectedCourse, setSelectedCourse] = useState(1);
  const [selectedSection, setSelectedSection] = useState(1);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [course, setCourse] = useState([
    { id: 1, name: "Computer Science Engineering" },
    { id: 2, name: "Information Technology" },
    { id: 3, name: "Electronics & Communication Engineering" }
  ]);
  const [sections, setSections] = useState([
    { id: 1, courseId: 1, name: "A" },
    { id: 2, courseId: 1, name: "B" },
    { id: 3, courseId: 2, name: "A" },
    { id: 4, courseId: 2, name: "B" },
    { id: 5, courseId: 3, name: "A" }
  ]);
  const validateForm = () => {
    // Course
    if (!selectedCourse) {
      toast.error("Please select a course");
      return false;
    }

    // Section
    if (!selectedSection) {
      toast.error("Please select a section");
      return false;
    }

    // Date
    if (!date) {
      toast.error("Please select a date");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Date cannot be earlier than today");
      return false;
    }

    // Start Time
    if (!startTime) {
      toast.error("Please select a start time");
      return false;
    }

    // End Time
    if (!endTime) {
      toast.error("Please select an end time");
      return false;
    }

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    if (end <= start) {
      toast.error("End time must be greater than start time");
      return false;
    }

    const duration = (end - start) / (1000 * 60); // Duration in minutes

    if (duration < 30) {
      toast.error("Session duration must be at least 30 minutes");
      return false;
    }

    if (duration > 240) {
      toast.error("Session duration cannot exceed 4 hours");
      return false;
    }
    // Room
    if (!room.trim()) {
      toast.error("Room is required");
      return false;
    }

    if (room.trim().length < 2) {
      toast.error("Room name must be at least 2 characters");
      return false;
    }

    if (room.trim().length > 50) {
      toast.error("Room name cannot exceed 50 characters");
      return false;
    }

    const roomRegex = /^[A-Za-z0-9\s-]+$/;

    if (!roomRegex.test(room.trim())) {
      toast.error("Room can only contain letters, numbers, spaces and hyphens");
      return false;
    }

    return true;
  };
  const createSession = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      courseId: selectedCourse,
      sectionId: selectedSection,
      date,
      startTime,
      endTime,
      room: room.trim(),
    };

    console.log(payload);

    try {
      const response = await handleCreateAttendanceSession(payload);
      console.log("Attendance session created:", response);
      setAttendanceSessions((prevSessions) => [...prevSessions, response]);
      toast.success("Attendance session created");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create attendance session:", error);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await handleFetchAttendanceSessions();
        console.log("Fetched attendance sessions:", response);
        setAttendanceSessions(response);
      } catch (error) {
        console.error("Failed to fetch attendance sessions:", error);
      }
    };
    console.log("Sessions before fetch:", attendanceSessions);
    fetchSessions();
  }, []);

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Attendance' }]} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Attendance sessions</h1>
          <p className="text-sm text-muted-foreground">Create a session, then upload a classroom photo for AI recognition.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create session</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {attendanceSessions.map((s) => (
          <Link key={s.id} to={`/admin/attendance/sessions/${s.id}`}>
            <Card className="h-full p-5 hover:shadow-soft-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">Session #{s.id}</p>
                  <p className="text-xs text-muted-foreground">
                    Course: {s.courseId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Section: {s.sectionId}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {s.date}
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {s.startTime} - {s.endTime}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {s.room}
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="mt-4 w-full"
              >
                Start Session
              </Button>
            </Card>
          </Link>
        ))}
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Create Attendance Session"
      >
        <form className="space-y-4" onSubmit={createSession}>

          {/* Course */}
          <div>
            <Label>Course</Label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
            >
              {course.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <Label>Section</Label>
            <select
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedSection}
              onChange={(e) => setSelectedSection(Number(e.target.value))}
            >
              {sections
                .filter((section) => section.courseId === selectedCourse)
                .map((section) => (
                  <option key={section.id} value={section.id}>
                    Section {section.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Room */}
          <div>
            <Label>Room</Label>
            <Input
              placeholder="Enter room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Create Session
            </Button>
          </div>

        </form>
      </Dialog>
    </div>
  )
}
