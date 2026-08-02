package com.facetrack.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.Student;

@Repository
public interface StudentDaoRepository extends JpaRepository<Student, Long> {

    List<Student> findByInstituteId(Long instituteId);
    
    long countByCourseId(Long courseId);

}
