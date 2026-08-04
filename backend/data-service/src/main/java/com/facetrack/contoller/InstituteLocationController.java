package com.facetrack.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.facetrack.data_service.util.ApiResponse;
import com.facetrack.dto.InstituteLocationRequestDTO;
import com.facetrack.dto.InstituteLocationResponseDTO;
import com.facetrack.dto.LocationValidationRequestDTO;
import com.facetrack.dto.LocationValidationResponseDTO;
import com.facetrack.service.InstituteLocationService;

@RestController
@RequestMapping("/api/v1/data/institute-locations")
public class InstituteLocationController {

    @Autowired
    private InstituteLocationService instituteLocationService;

    // Create
    @PostMapping
    public ResponseEntity<ApiResponse<InstituteLocationResponseDTO>> createInstituteLocation(
            @RequestBody InstituteLocationRequestDTO requestDTO) {
        return instituteLocationService.createInstituteLocation(requestDTO);
    }

    // Get By Id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InstituteLocationResponseDTO>> getInstituteLocationById(
            @PathVariable Long id) {
        return instituteLocationService.getInstituteLocationById(id);
    }

    // Get All
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllInstituteLocations() {
        return instituteLocationService.getAllInstituteLocations();
    }

    // Get By Institute Id
    @GetMapping("/institute/{instituteId}")
    public ResponseEntity<ApiResponse<?>> getLocationsByInstituteId(
            @PathVariable Long instituteId) {
        return instituteLocationService.getLocationsByInstituteId(instituteId);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InstituteLocationResponseDTO>> updateInstituteLocation(
            @PathVariable Long id,
            @RequestBody InstituteLocationRequestDTO requestDTO) {
        return instituteLocationService.updateInstituteLocation(id, requestDTO);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteInstituteLocation(
            @PathVariable Long id) {
        return instituteLocationService.deleteInstituteLocation(id);
    }
//    // Validate
//    @PostMapping("/{locationId}/validate")
//    public ResponseEntity<ApiResponse<LocationValidationResponseDTO>> validateLocation(
//            @PathVariable Long locationId,
//            @RequestBody LocationValidationRequestDTO requestDTO) {
//
//        return instituteLocationService.validateLocation(locationId, requestDTO);
//    }
 // Validate
    @PostMapping("/institute/{instituteId}/validate")
    public ResponseEntity<ApiResponse<LocationValidationResponseDTO>> validateLocation(
            @PathVariable Long instituteId,
            @RequestBody LocationValidationRequestDTO requestDTO) {

        return instituteLocationService.validateLocation(instituteId, requestDTO);
    }

}