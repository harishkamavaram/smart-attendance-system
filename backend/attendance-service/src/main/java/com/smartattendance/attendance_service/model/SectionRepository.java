package com.smartattendance.attendance_service.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository  extends JpaRepository<Section, Long>{

}
