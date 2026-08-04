package com.facetrack.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "institute_locations")
public class InstituteLocation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institute_id", nullable = false)
    private Institute institute;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    // Radius in meters
    @Column(nullable = false)
    private Integer allowedRadius;

    @Column(length = 255)
    private String locationName;

    public InstituteLocation() {
        super();
    }

    public InstituteLocation(Institute institute, Double latitude,
                             Double longitude, Integer allowedRadius,
                             String locationName) {
        super();
        this.institute = institute;
        this.latitude = latitude;
        this.longitude = longitude;
        this.allowedRadius = allowedRadius;
        this.locationName = locationName;
    }

    public Institute getInstitute() {
        return institute;
    }

    public void setInstitute(Institute institute) {
        this.institute = institute;
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

    @Override
    public String toString() {
        return "InstituteLocation [institute=" + institute +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", allowedRadius=" + allowedRadius +
                ", locationName=" + locationName + "]";
    }
}