package com.facetrack.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.facetrack.dao.InstituteDaoRepository;
import com.facetrack.dao.InstituteLocationDaoRepository;
import com.facetrack.data_service.util.ApiResponse;
import com.facetrack.data_service.util.GeoUtils;
import com.facetrack.dto.InstituteLocationRequestDTO;
import com.facetrack.dto.InstituteLocationResponseDTO;
import com.facetrack.dto.LocationValidationRequestDTO;
import com.facetrack.dto.LocationValidationResponseDTO;
import com.facetrack.models.Institute;
import com.facetrack.models.InstituteLocation;

@Service
public class InstituteLocationService {

	private final InstituteLocationDaoRepository instituteLocationRepository;
	private final InstituteDaoRepository instituteRepository;

	public InstituteLocationService(InstituteLocationDaoRepository instituteLocationRepository,
			InstituteDaoRepository instituteRepository) {
		this.instituteLocationRepository = instituteLocationRepository;
		this.instituteRepository = instituteRepository;
	}

	public ResponseEntity<ApiResponse<InstituteLocationResponseDTO>> createInstituteLocation(
			InstituteLocationRequestDTO requestDTO) {

		Institute institute = instituteRepository.findById(requestDTO.getInstituteId())
				.orElseThrow(() -> new RuntimeException("Institute not found"));

		InstituteLocation location = new InstituteLocation();
		location.setInstitute(institute);
		location.setLatitude(requestDTO.getLatitude());
		location.setLongitude(requestDTO.getLongitude());
		location.setAllowedRadius(requestDTO.getAllowedRadius());
		location.setLocationName(requestDTO.getLocationName());

		location = instituteLocationRepository.save(location);

		InstituteLocationResponseDTO responseDTO = new InstituteLocationResponseDTO();
		responseDTO.setId(location.getId());
		responseDTO.setInstituteId(location.getInstitute().getId());
		responseDTO.setInstituteName(location.getInstitute().getName());
		responseDTO.setLatitude(location.getLatitude());
		responseDTO.setLongitude(location.getLongitude());
		responseDTO.setAllowedRadius(location.getAllowedRadius());
		responseDTO.setLocationName(location.getLocationName());

		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<InstituteLocationResponseDTO>(true,
				"Institute location created successfully", responseDTO));
	}

	public ResponseEntity<ApiResponse<InstituteLocationResponseDTO>> getInstituteLocationById(Long id) {

		InstituteLocation location = instituteLocationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Institute location not found"));

		InstituteLocationResponseDTO responseDTO = new InstituteLocationResponseDTO();

		responseDTO.setId(location.getId());
		responseDTO.setInstituteId(location.getInstitute().getId());
		responseDTO.setInstituteName(location.getInstitute().getName());
		responseDTO.setLatitude(location.getLatitude());
		responseDTO.setLongitude(location.getLongitude());
		responseDTO.setAllowedRadius(location.getAllowedRadius());
		responseDTO.setLocationName(location.getLocationName());

		return ResponseEntity.ok(new ApiResponse<InstituteLocationResponseDTO>(true,
				"Institute location fetched successfully", responseDTO));
	}

	public ResponseEntity<ApiResponse<?>> getAllInstituteLocations() {

		List<InstituteLocationResponseDTO> response = instituteLocationRepository.findAll().stream().map(location -> {
			InstituteLocationResponseDTO dto = new InstituteLocationResponseDTO();
			dto.setId(location.getId());
			dto.setInstituteId(location.getInstitute().getId());
			dto.setInstituteName(location.getInstitute().getName());
			dto.setLatitude(location.getLatitude());
			dto.setLongitude(location.getLongitude());
			dto.setAllowedRadius(location.getAllowedRadius());
			dto.setLocationName(location.getLocationName());
			return dto;
		}).toList();

		return ResponseEntity.ok(new ApiResponse<>(true, "Institute locations fetched successfully", response));
	}

	public ResponseEntity<ApiResponse<?>> getLocationsByInstituteId(Long instituteId) {

		List<InstituteLocationResponseDTO> response = instituteLocationRepository.findByInstituteId(instituteId)
				.stream().map(location -> {
					InstituteLocationResponseDTO dto = new InstituteLocationResponseDTO();
					dto.setId(location.getId());
					dto.setInstituteId(location.getInstitute().getId());
					dto.setInstituteName(location.getInstitute().getName());
					dto.setLatitude(location.getLatitude());
					dto.setLongitude(location.getLongitude());
					dto.setAllowedRadius(location.getAllowedRadius());
					dto.setLocationName(location.getLocationName());
					return dto;
				}).toList();

		return ResponseEntity.ok(new ApiResponse<>(true, "Institute locations fetched successfully", response));
	}

	public ResponseEntity<ApiResponse<InstituteLocationResponseDTO>> updateInstituteLocation(Long id,
			InstituteLocationRequestDTO requestDTO) {

		InstituteLocation location = instituteLocationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Institute location not found"));

		Institute institute = instituteRepository.findById(requestDTO.getInstituteId())
				.orElseThrow(() -> new RuntimeException("Institute not found"));

		// Update Entity
		location.setInstitute(institute);
		location.setLatitude(requestDTO.getLatitude());
		location.setLongitude(requestDTO.getLongitude());
		location.setAllowedRadius(requestDTO.getAllowedRadius());
		location.setLocationName(requestDTO.getLocationName());

		location = instituteLocationRepository.save(location);

		// Map Entity -> DTO
		InstituteLocationResponseDTO responseDTO = new InstituteLocationResponseDTO();
		responseDTO.setId(location.getId());
		responseDTO.setInstituteId(location.getInstitute().getId());
		responseDTO.setInstituteName(location.getInstitute().getName());
		responseDTO.setLatitude(location.getLatitude());
		responseDTO.setLongitude(location.getLongitude());
		responseDTO.setAllowedRadius(location.getAllowedRadius());
		responseDTO.setLocationName(location.getLocationName());

		return ResponseEntity.ok(new ApiResponse<>(true, "Institute location updated successfully", responseDTO));
	}

	public ResponseEntity<ApiResponse<String>> deleteInstituteLocation(Long id) {

		InstituteLocation location = instituteLocationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Institute location not found"));

		instituteLocationRepository.delete(location);

		return ResponseEntity.ok(new ApiResponse<>(true, "Institute location deleted successfully", "Deleted"));
	}

//	public ResponseEntity<ApiResponse<LocationValidationResponseDTO>> validateLocation(Long locationId,
//			LocationValidationRequestDTO requestDTO) {
//
//		InstituteLocation location = instituteLocationRepository.findById(locationId)
//				.orElseThrow(() -> new RuntimeException("Location not found"));
//
//		double distance = GeoUtils.calculateDistance(location.getLatitude(), location.getLongitude(),
//				requestDTO.latitude(), requestDTO.longitude());
//
//		boolean isValid = distance <= location.getAllowedRadius();
//
//		LocationValidationResponseDTO response = new LocationValidationResponseDTO(isValid, distance,
//				location.getAllowedRadius(),
//				isValid ? "User is within the allowed radius." : "User is outside the allowed radius.");
//
//		return ResponseEntity.ok(new ApiResponse<>(true,
//				isValid ? "User is within the allowed radius." : "User is outside the allowed radius.", response));
//	}

	public ResponseEntity<ApiResponse<LocationValidationResponseDTO>> validateLocation(Long instituteId,
			LocationValidationRequestDTO requestDTO) {

		List<InstituteLocation> locations = instituteLocationRepository.findByInstituteId(instituteId);
		
		locations.stream().forEach(System.out::println);
		System.out.println("Is Locations Empty: " + locations.isEmpty());
	

		if (locations.isEmpty()) {
			throw new RuntimeException("No locations found for the institute.");
		}

		for (InstituteLocation location : locations) {
			System.out.println("Location: " + location);
			double distance = GeoUtils.calculateDistance(location.getLatitude(), location.getLongitude(),
					requestDTO.latitude(), requestDTO.longitude());
			
			System.out.println("Distance: " + distance);
			
			if (distance <= location.getAllowedRadius()) {

				LocationValidationResponseDTO response = new LocationValidationResponseDTO(true, distance,
						location.getAllowedRadius(), "User is within the allowed radius.");

				return ResponseEntity.ok(new ApiResponse<>(true, "User is within the allowed radius.", response));
			}
		}

		LocationValidationResponseDTO response = new LocationValidationResponseDTO(false, 0, 0,
				"User is outside all allowed institute locations.");

		return ResponseEntity.ok(new ApiResponse<>(true, "User is outside all allowed institute locations.", response));
	}

}