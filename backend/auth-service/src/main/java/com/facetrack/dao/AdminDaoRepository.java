package com.facetrack.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.Admin;

@Repository
public interface AdminDaoRepository extends JpaRepository<Admin, Long> {

	boolean existsByEmail(String email);

	Optional<Admin> findByEmail(String email);

}
