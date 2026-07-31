package com.facetrack.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.Course;

@Repository
public interface CourseDaoRepository extends JpaRepository<Course, Long> {

}
