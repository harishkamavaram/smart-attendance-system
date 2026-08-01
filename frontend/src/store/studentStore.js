import { create } from "zustand";

const useStudentStore = create((set, get) => ({
  students: [
  ],

  bulkUploadHistory: [
  ],

  // ---------- Getters ----------

  getStudentById: (id) => {
    return get().students.find(
      (student) => student.id === Number(id)
    );
  },

  // ---------- Student Actions ----------

  setStudents: (students) => set({ students }),

  addStudent: (student) =>
    set((state) => ({
      students: [...state.students, student],
    })),

  updateStudent: (id, updatedStudent) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === id
          ? { ...student, ...updatedStudent }
          : student
      ),
    })),

  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter(
        (student) => student.id !== id
      ),
    })),

  // ---------- Upload History ----------

  setBulkUploadHistory: (history) =>
    set({
      bulkUploadHistory: history,
    }),

  addUploadHistory: (upload) =>
    set((state) => ({
      bulkUploadHistory: [
        upload,
        ...state.bulkUploadHistory,
      ],
    })),
}));

export default useStudentStore;

// import useStudentStore from "@/store/studentStore";

// const {
//   students,
//   bulkUploadHistory,

//   getStudentById,

//   setStudents,
//   addStudent,
//   updateStudent,
//   deleteStudent,

//   setBulkUploadHistory,
//   addUploadHistory,
// } = useStudentStore();

// const getStudentById = useStudentStore(
//   (state) => state.getStudentById
// );

// const student = getStudentById(5);

// const useStudentStore = create((set) => ({
//   students: [],
//   bulkUploadHistory: [],

//   setStudents: (students) => set({ students }),
//   setBulkUploadHistory: (history) => set({ bulkUploadHistory }),
// }));

// const { setStudents } = useStudentStore.getState();

// const response = await axios.get("/api/v1/students");
// setStudents(response.data);