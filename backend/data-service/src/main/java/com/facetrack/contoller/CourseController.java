package com.facetrack.contoller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import com.facetrack.dao.CourseDaoRepository;
import com.facetrack.data_service.payload.ApiResponse;
import com.facetrack.data_service.util.ResponseUtil;
import com.facetrack.models.Course;

@RestController
@RequestMapping("/api/v1/data/courses")
public class CourseController {

    @Autowired
    private CourseDaoRepository courseRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Course>>> getAllCourses() {

        List<Course> courses = courseRepository.findAll();

        return ResponseEntity.ok(
                ResponseUtil.success("Courses fetched successfully.", courses)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> getCourse(@PathVariable Long id) {

        Optional<Course> course = courseRepository.findById(id);

        if (course.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseUtil.error("Course not found."));
        }

        return ResponseEntity.ok(
                ResponseUtil.success("Course fetched successfully.", course.get())
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Course>> createCourse(@RequestBody Course course) {

        Course saved = courseRepository.save(course);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseUtil.success("Course created successfully.", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> updateCourse(
            @PathVariable Long id,
            @RequestBody Course course) {

        Optional<Course> optional = courseRepository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseUtil.error("Course not found."));
        }

        Course existing = optional.get();

        existing.setName(course.getName());
        // Update other fields

        Course updated = courseRepository.save(existing);

        return ResponseEntity.ok(
                ResponseUtil.success("Course updated successfully.", updated)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {

        if (!courseRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseUtil.error("Course not found."));
        }

        courseRepository.deleteById(id);

        return ResponseEntity.ok(
                ResponseUtil.success("Course deleted successfully.")
        );
    }
}
