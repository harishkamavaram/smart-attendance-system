package com.facetrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.facetrack.entity.Student;
import com.facetrack.repository.Studentrepository;

@Service
public class StudentService {
	
	private final Studentrepository studentrepository;
	
	public StudentService(Studentrepository studentrepository) {
		this.studentrepository=studentrepository;
	}
	
	/*Create Student*/
	public Student addStudent(Student student) {
		return studentrepository.save(student);
	}
	
	// Get all students //
	public List<Student> getAllStudents() {
		return studentrepository.findAll();
	}
	
	// Get student by ID
    public Student getStudentById(Long id) {
        return studentrepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }
 // Update student
    public Student updateStudent(Long id, Student student) {

        Student existingStudent = getStudentById(id);

        existingStudent.setName(student.getName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setRollno(student.getRollno());
        existingStudent.setDepartment(student.getDepartment());

        return studentrepository.save(existingStudent);
    }


    

    // Delete student
    public void deleteStudent(Long id) {

        Student existingStudent = getStudentById(id);

        studentrepository.delete(existingStudent);
    }
}
