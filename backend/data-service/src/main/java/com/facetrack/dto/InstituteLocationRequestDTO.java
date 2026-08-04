package com.facetrack.dto;

public class InstituteLocationRequestDTO {

    private Long instituteId;
    private Double latitude;
    private Double longitude;
    private Integer allowedRadius;
    private String locationName;

    public InstituteLocationRequestDTO() {
    }

    public InstituteLocationRequestDTO(Long instituteId, Double latitude,
                                       Double longitude, Integer allowedRadius,
                                       String locationName) {
        this.instituteId = instituteId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.allowedRadius = allowedRadius;
        this.locationName = locationName;
    }

    public Long getInstituteId() {
        return instituteId;
    }

    public void setInstituteId(Long instituteId) {
        this.instituteId = instituteId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getAllowedRadius() {
        return allowedRadius;
    }

    public void setAllowedRadius(Integer allowedRadius) {
        this.allowedRadius = allowedRadius;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

}