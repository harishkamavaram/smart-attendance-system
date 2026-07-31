package com.facetrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummary {

    private Long studentId;
    private long totalClasses;
    private long present;
    private long absent;
    private double attendancePercentage;
}