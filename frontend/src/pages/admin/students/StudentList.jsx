import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Upload, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Misc";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import {
  SearchInput,
  Select,
  Pagination,
  Breadcrumb,
} from "@/components/ui/Controls";

import { toast } from "sonner";
import { handleFetchStudentsByInstituteId } from "../../../services/api/studentList/api";
import { useAuth } from "../../../hooks/useAuth";

const PAGE_SIZE = 10;

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("");
  const [section, setSection] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { adminUser } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);

        const instituteId = adminUser?.institute?.id || 1;
        console.log("Institute Id: ", instituteId)
        const response = await handleFetchStudentsByInstituteId(instituteId);

        console.log("Fetched students:", response.data);

        setStudents(response.data || []);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to fetch students");
      } finally {
        setIsLoading(false);
      }
    };

    if (adminUser) {
      fetchStudents();
    }
  }, [adminUser]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = `${s.first_name} ${s.last_name} ${s.roll_number}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesBatch = !batch || s.batch === batch;
      const matchesSection = !section || s.section === section;

      let matchesStatus = true;

      if (status === "uploaded") {
        matchesStatus = s.has_images;
      } else if (status === "pending") {
        matchesStatus = s.has_images && !s.has_embeddings;
      } else if (status === "registered") {
        matchesStatus = s.has_embeddings;
      }

      return (
        matchesSearch &&
        matchesBatch &&
        matchesSection &&
        matchesStatus
      );
    });
  }, [students, search, batch, section, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/template/Student_Import_Template_With_Instructions.xlsx";
    link.download = "Student_Import_Template_With_Instructions.xlsx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Please Create Course And Sections First, Before Registering Or Uploading Student Data")
  };
  
  return isLoading ? (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="rounded-full bg-primary/10 p-5">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        Loading Students
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Please wait while we fetch the latest data...
      </p>
    </div>
  ) : (
    <>

      <div className="space-y-5">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Students" },
          ]}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Students
            </h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} students across all departments
            </p>
          </div>

          <div className="flex gap-2">
            <Link to="/admin/students/bulk-upload">
              <Button variant="outline">
                <Upload className="h-4 w-4" /> Bulk upload
              </Button>
            </Link>

            <Link to="/admin/students/register">
              <Button>
                <Plus className="h-4 w-4" /> Add student
              </Button>
            </Link>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search by name, roll number..."
              className="sm:flex-1"
            />

            <Select
              value={section}
              onChange={(v) => {
                setSection(v);
                setPage(1);
              }}
              placeholder="All sections"
              className="sm:w-48"
              options={[...new Set(students.map((s) => s.section))]
                .filter(Boolean)
                .map((sec) => ({
                  value: sec,
                  label: sec,
                }))}
            />

            {/* <Select
                value={status}
                onChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
                placeholder="All statuses"
                className="sm:w-44"
                options={[
                  { value: "registered", label: "Registered" },
                  { value: "pending", label: "Pending" },
                ]}
              /> */}
          </div>
        </Card>
        {filtered.length === 0 ? (
          <div className="flex justify-center">
            <button
              onClick={downloadTemplate}
              className="rounded-lg border border-blue-700 bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Download Template
            </button>
          </div>
        ) : (
          <>
            <Table>
              <THead>
                <TR>
                  <TH>Student</TH>
                  <TH>Roll No.</TH>
                  <TH>Batch</TH>
                  <TH>Section</TH>
                  <TH>Images</TH>
                  <TH>Embeddings</TH>
                  <TH>Action</TH>
                </TR>
              </THead>

              <TBody>
                {pageItems.map((s) => (
                  <TR key={s.id}>
                    <TD>
                      <Link
                        to={`/admin/students/${s.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="shrink-0">
                          <Avatar
                            name={`${s.firstName} ${s.lastName}`}
                            size={32}
                          />
                        </div>

                        <div>
                          <p className="font-medium">
                            {s.firstName} {s.lastName}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Student ID: {s.id}
                          </p>
                        </div>
                      </Link>
                    </TD>
                    <TD className="font-mono">{s.rollNumber}</TD>

                    <TD>
                      <Badge variant="outline">{s.batch}</Badge>
                    </TD>

                    <TD>{s.section}</TD>

                    <TD>
                      {s.has_images ? (
                        <Badge variant="success">Uploaded</Badge>
                      ) : (
                        <Badge variant="destructive">Not Uploaded</Badge>
                      )}
                    </TD>

                    <TD>
                      {s.has_embeddings ? (
                        <Badge variant="success">Registered</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </TD>

                    <TD>
                      {s.has_images && !s.has_embeddings ? (
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/students/${s.id}`)
                          }
                        >
                          Register Embedding
                        </Button>
                      ) : s.has_images && s.has_embeddings ? (
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/students/${s.id}`)
                          }
                        >
                          View Images
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/admin/students/${s.id}`)
                          }
                        >
                          Upload Images
                        </Button>
                      )}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        )}
      </div>

    </>
  );
}