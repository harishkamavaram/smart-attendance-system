import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { Breadcrumb } from "@/components/ui/Controls";
import { toast } from "sonner";
import { handleFetchCourses } from "../../../services/api/course/api";
import instance from "../../../services/api/instance";



export default function Courses() {

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState(null);

  const [courseName, setCourseName] = useState("");
  const [deleteCourse, setDeleteCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setIsLoading(true);

    try {
      const res = await handleFetchCourses();
      console.log("Fetched courses:", res.data);
      setCourses(res.data || []);

    } finally {
      setIsLoading(false);
    }
  }

  async function saveCourse() {

    if (!courseName.trim()) return;

    try {

      if (editing) {
        console.log("Editing course:", editing.id, "New name:", courseName);
        await instance.put(`/api/v1/data/courses/${editing.id}`, {
          name: courseName,
        });

        toast.success("Course updated");

      } else {
        console.log("Creating new course with name:", courseName);
        await instance.post("/api/v1/data/courses", {
          name: courseName,
        });

        toast.success("Course created");
      }

      fetchCourses();

      closeDialog();

    } catch {

      toast.error("Something went wrong");
    }
  }

  async function handleDeleteCourse() {

    if (!deleteCourse) return;
    console.log("Deleting course:", deleteCourse.id, "Name:", deleteCourse.name);
    await instance.delete(`/api/v1/data/courses/${deleteCourse.id}`);

    toast.success("Deleted");

    fetchCourses();

    setDeleteCourse(null);
  }

  function closeDialog() {
    setOpen(false);
    setEditing(null);
    setCourseName("");
  }

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    isLoading ? (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="rounded-full bg-primary/10 p-5">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>

        <h3 className="mt-6 text-lg font-semibold">
          Loading Courses
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while we fetch the latest data...
        </p>
      </div>
    ) : (
      <div className="space-y-6">

        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Courses" },
          ]}
        />

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-semibold">
              Courses
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage institute courses.
            </p>

          </div>

          <Button
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>

        </div>

        <Card>

          <CardContent className="space-y-4 p-6">

            <div className="relative">

              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                placeholder="Search course..."
              />

            </div>

            <Table>

              <THead>

                <TR>
                  <TH>Name</TH>
                  <TH>Created</TH>
                  <TH className="text-right">
                    Actions
                  </TH>
                </TR>

              </THead>

              <TBody>

                {filtered.length === 0 ? (

                  <TR>

                    <TD colSpan={3} className="text-center py-10">

                      No Courses Found

                    </TD>

                  </TR>

                ) : (

                  filtered.map(course => (

                    <TR key={course.id}>

                      <TD>{course.name}</TD>

                      <TD>
                        {new Date(course.createdAt)
                          .toLocaleDateString()}
                      </TD>

                      <TD className="text-right">

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditing(course);

                            setCourseName(course.name);

                            setOpen(true);
                          }}
                        >

                          <Pencil className="h-4 w-4" />

                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteCourse(course)}
                        >

                          <Trash2 className="h-4 w-4 text-red-500" />

                        </Button>

                      </TD>

                    </TR>

                  ))

                )}

              </TBody>

            </Table>

          </CardContent>

        </Card>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 shadow-xl p-6">

              <h2 className="text-xl font-semibold mb-5">
                {editing ? "Edit Course" : "Add Course"}
              </h2>

              <Input
                placeholder="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={closeDialog}
                >
                  Cancel
                </Button>

                <Button onClick={saveCourse}>
                  Save
                </Button>
              </div>

            </div>
          </div>
        )}
        {deleteCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl">

              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-7 w-7 text-red-600" />
                </div>
              </div>

              <h2 className="mt-4 text-center text-xl font-semibold">
                Delete Course
              </h2>

              <p className="mt-2 text-center text-sm text-muted-foreground">
                Are you sure you want to delete
                <span className="font-semibold">
                  {" "}{deleteCourse.name}
                </span>
                ?
                <br />
                This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteCourse(null)}
                >
                  Cancel
                </Button>

                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteCourse}
                >
                  Delete
                </Button>
              </div>

            </div>
          </div>
        )}
      </div>

    ));

}