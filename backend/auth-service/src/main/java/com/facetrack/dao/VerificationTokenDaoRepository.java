package com.facetrack.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.redis.VerificationToken;

@Repository
public interface VerificationTokenDaoRepository extends CrudRepository<VerificationToken, String> {

}
