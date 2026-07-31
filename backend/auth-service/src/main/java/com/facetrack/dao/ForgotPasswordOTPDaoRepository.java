package com.facetrack.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.redis.ForgotPasswordOTP;

@Repository
public interface ForgotPasswordOTPDaoRepository extends CrudRepository<ForgotPasswordOTP, String> {

}
