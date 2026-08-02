package com.smartattendance.attendance_service.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smartattendance.attendance_service.model.Section;
import com.smartattendance.attendance_service.model.SectionRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/attendance/sections")
public class SectionController {

    private final SectionRepository sectionRepository;

    public SectionController(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    // Create Section
    @PostMapping
    public ResponseEntity<?> createSection(@Valid @RequestBody Section section) {
        Section savedSection = sectionRepository.save(section);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSection);
    }

    // Get All Sections
    @GetMapping
    public ResponseEntity<List<Section>> getAllSections() {
        return ResponseEntity.ok(sectionRepository.findAll());
    }

    // Get Section By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSectionById(@PathVariable Long id) {

        Optional<Section> section = sectionRepository.findById(id);

        if (section.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Section not found.");
        }

        return ResponseEntity.ok(section.get());
    }

    // Update Section
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSection(
            @PathVariable Long id,
            @Valid @RequestBody Section updatedSection) {

        Optional<Section> optionalSection = sectionRepository.findById(id);

        if (optionalSection.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Section not found.");
        }

        Section section = optionalSection.get();

        section.setCourseId(updatedSection.getCourseId());
        section.setSectionName(updatedSection.getSectionName());

        sectionRepository.save(section);

        return ResponseEntity.ok(section);
    }

    // Delete Section
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSection(@PathVariable Long id) {

        Optional<Section> optionalSection = sectionRepository.findById(id);

        if (optionalSection.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Section not found.");
        }

        sectionRepository.deleteById(id);

        return ResponseEntity.ok("Section deleted successfully.");
    }

}