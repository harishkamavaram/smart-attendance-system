package com.facetrack.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.redis.RefreshToken;

@Repository
public interface RefreshTokenDaoRepository extends CrudRepository<RefreshToken, String>{

}
