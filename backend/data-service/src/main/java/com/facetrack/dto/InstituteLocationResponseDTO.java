package com.facetrack.dto;

public class InstituteLocationResponseDTO {

    private Long id;
    private Long instituteId;
    private String instituteName;
    private Double latitude;
    private Double longitude;
    private Integer allowedRadius;
    private String locationName;

    public InstituteLocationResponseDTO() {
    }

    public InstituteLocationResponseDTO(Long id,
                                        Long instituteId,
                                        String instituteName,
                                        Double latitude,
                                        Double longitude,
                                        Integer allowedRadius,
                                        String locationName) {
        this.id = id;
        this.instituteId = instituteId;
        this.instituteName = instituteName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.allowedRadius = allowedRadius;
        this.locationName = locationName;
    }

    public Long getId() {
        return id;
    }

    public Long getInstituteId() {
        return instituteId;
    }

    public String getInstituteName() {
        return instituteName;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Integer getAllowedRadius() {
        return allowedRadius;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setInstituteId(Long instituteId) {
        this.instituteId = instituteId;
    }

    public void setInstituteName(String instituteName) {
        this.instituteName = instituteName;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public void setAllowedRadius(Integer allowedRadius) {
        this.allowedRadius = allowedRadius;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

}