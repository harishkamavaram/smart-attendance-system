package com.facetrack.service;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.facetrack.dao.AdminDaoRepository;
import com.facetrack.dao.ForgotPasswordOTPDaoRepository;
import com.facetrack.dao.InstituteDaoRepository;
import com.facetrack.dao.RefreshTokenDaoRepository;
import com.facetrack.dao.ResetPasswordTokenDaoRepository;
import com.facetrack.dao.VerificationTokenDaoRepository;
import com.facetrack.dto.JwtUser;
import com.facetrack.dto.request.EmailVerificationRequest;
import com.facetrack.dto.request.ForgotPasswordRequest;
import com.facetrack.dto.request.LoginRequest;
import com.facetrack.dto.request.RegisterAdminAndInstituteRequest;
import com.facetrack.dto.request.ResendVerificationMailRequest;
import com.facetrack.dto.request.UpdatePasswordRequest;
import com.facetrack.dto.request.VerifyOtpRequest;
import com.facetrack.dto.request.VerifyResetPasswordRequest;
import com.facetrack.dto.response.AdminLoginResponse;
import com.facetrack.dto.response.ApiResponse;
import com.facetrack.dto.response.EmailVerificationResponse;
import com.facetrack.dto.response.ForgotPasswordResponse;
import com.facetrack.dto.response.InstituteResponse;
import com.facetrack.dto.response.LoginResponse;
import com.facetrack.dto.response.LogoutAdminResponse;
import com.facetrack.dto.response.RefreshTokenResponse;
import com.facetrack.dto.response.RegisterAdminAndInstituteResponse;
import com.facetrack.dto.response.ResendVerificationMailResponse;
import com.facetrack.dto.response.UpdatePasswordResponse;
import com.facetrack.dto.response.VerifyOtpResponse;
import com.facetrack.dto.response.VerifyResetPasswordResponse;
import com.facetrack.exceptions.DuplicateResourceException;
import com.facetrack.exceptions.UnauthorizedException;
import com.facetrack.helpers.EmailHelpers;
import com.facetrack.models.Admin;
import com.facetrack.models.Institute;
import com.facetrack.models.redis.ForgotPasswordOTP;
import com.facetrack.models.redis.RefreshToken;
import com.facetrack.models.redis.ResetPasswordToken;
import com.facetrack.models.redis.VerificationToken;
import com.facetrack.util.HashUtil;
import com.facetrack.util.TokenUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@Service
@Validated
public class AdminService {

	@Autowired
	private AdminDaoRepository adminDAO;
	@Autowired
	private InstituteDaoRepository instituteDAO;
	@Autowired
	private VerificationTokenDaoRepository verificationTokenDAO;
	@Autowired
	private ResetPasswordTokenDaoRepository resetPasswordTokenDao;
	@Autowired
	private RefreshTokenDaoRepository refreshTokenDAO;
	@Autowired
	private ForgotPasswordOTPDaoRepository forgotPasswordOtpDAO;
	@Autowired
	private EmailHelpers mailSender;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	private static final TokenUtil tokenUtil = new TokenUtil();

	@Value("${jwt.access-token-expiration}")
	private long accessTokenExpiration;

	@Value("${jwt.refresh-token-expiration}")
	private long refreshTokenExpiration;

	public ResponseEntity<ApiResponse<RegisterAdminAndInstituteResponse>> createAdmin(
			@Valid RegisterAdminAndInstituteRequest adminAndInstitute) {

		if (instituteDAO.existsByName(adminAndInstitute.institute().name())) {
			throw new DuplicateResourceException("Institute name already exists.");
		}
		if (instituteDAO.existsByInstituteCode(adminAndInstitute.institute().instituteCode())) {
			throw new DuplicateResourceException("Institute code already exists.");
		}
		if (instituteDAO.existsByEmail(adminAndInstitute.institute().email())) {
			throw new DuplicateResourceException("Institute email already exists.");
		}

		if (adminDAO.existsByEmail(adminAndInstitute.superAdmin().email())) {
			throw new DuplicateResourceException("Admin email already exists.");
		}

		Institute institute = new Institute();
		institute.setName(adminAndInstitute.institute().name());
		institute.setInstituteCode(adminAndInstitute.institute().instituteCode());
		institute.setEmail(adminAndInstitute.institute().email());
		institute.setMobileNumber(adminAndInstitute.institute().mobileNumber());
		institute.setAddress(adminAndInstitute.institute().address());

		Institute responseInstitute = instituteDAO.save(institute);

		Admin admin = new Admin();
		admin.setName(adminAndInstitute.superAdmin().name());
		admin.setEmail(adminAndInstitute.superAdmin().email());

		// Create an encoder with strength 7
		// need to use DI object
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(7);
		String hashedPassword = encoder.encode(adminAndInstitute.superAdmin().password());

		admin.setPassword(hashedPassword);
		admin.setInstitute(responseInstitute);

		Admin responseAdmin = adminDAO.save(admin);
		if (responseInstitute != null && responseAdmin != null) {

			VerificationToken tokenObj = new VerificationToken(tokenUtil.getToken(), responseAdmin.getEmail(),
					Instant.now());
			VerificationToken responseTokenObj = verificationTokenDAO.save(tokenObj);

			if (responseTokenObj != null) {
				String token = responseTokenObj.getToken();
				String mailResp = mailSender.sendVerificationEmail(responseAdmin.getEmail(), responseAdmin.getName(),
						token);
				System.out.println("Email response: " + mailResp);
				return ResponseEntity.status(HttpStatus.OK)
						.body(new ApiResponse<>(true, new RegisterAdminAndInstituteResponse(responseInstitute.getId(),
								responseAdmin.getId(), "Check Your Email For Verification.")));
			} else {
				return ResponseEntity.status(HttpStatus.CREATED)
						.body(new ApiResponse<>(true, new RegisterAdminAndInstituteResponse(responseInstitute.getId(),
								responseAdmin.getId(),
								"Registration completed, but verification email could not be sent. Please request a new verification email.")));
			}
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false,
				new RegisterAdminAndInstituteResponse(0l, 0l, "Registeration UnSuccessfull, Again Later.")));
	}

	public ResponseEntity<ApiResponse<EmailVerificationResponse>> emailVerification(
			@Valid EmailVerificationRequest verifyEmailObj) {
		System.out.println("Email verify obj: " + verifyEmailObj);
		Optional<VerificationToken> responseTokenObj = verificationTokenDAO.findById(verifyEmailObj.token());

		if (responseTokenObj.isPresent()) {
			String token = responseTokenObj.get().getToken();
			String email = responseTokenObj.get().getUserId();

			if (token.equals(verifyEmailObj.token()) && email.equals(verifyEmailObj.email())) {

				Optional<Admin> adminObj = adminDAO.findByEmail(email);
				System.out.println("Optional<Admin>: " + adminObj);
				if (adminObj.isPresent()) {

					Admin admin = adminObj.get();
					System.out.println("Admin: " + admin);
					if (admin.getIsVerified() == true) {
						return ResponseEntity.status(HttpStatus.CONFLICT)
								.body(new ApiResponse<>(true, new EmailVerificationResponse(null,
										responseTokenObj.get().getUserId(), "Email Already Verified, Please Login.")));
					}
					admin.setVerified(true);
					Admin savedAdmin = adminDAO.save(admin);

					InstituteResponse institute = new InstituteResponse(savedAdmin.getInstitute().getId(),
							savedAdmin.getInstitute().getName(), savedAdmin.getInstitute().getInstituteCode(),
							savedAdmin.getInstitute().getEmail(), savedAdmin.getInstitute().getMobileNumber(),
							savedAdmin.getInstitute().getAddress());

					AdminLoginResponse admindetails = new AdminLoginResponse(savedAdmin.getId(), savedAdmin.getName(),
							savedAdmin.getEmail(), savedAdmin.getRole(), institute);

					JwtUser user = new JwtUser(admin.getId(), admin.getEmail(), admin.getRole());
					String accessToken = jwtService.generateAccessToken(user);
					String refreshToken = jwtService.generateRefreshToken(user);

					ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken).httpOnly(true)
							.secure(true).sameSite("Strict").path("/").maxAge(Duration.ofMillis(accessTokenExpiration))
							.build();

					ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken).httpOnly(true)
							.secure(true).sameSite("Strict").path("/auth")
							.maxAge(Duration.ofMillis(refreshTokenExpiration)).build();

					String hashedRefreshToken = HashUtil.sha256(refreshToken);

					refreshTokenDAO.save(new RefreshToken(admin.getEmail(), hashedRefreshToken, Instant.now()));

					return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, accessCookie.toString())
							.header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
							.body(new ApiResponse<>(true,
									new EmailVerificationResponse(admindetails, verifyEmailObj.email(),
											"Email Verification Successfull, Redriecting To Dashboard.")));
				}

			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false,
						new EmailVerificationResponse(null, verifyEmailObj.email(), "Invalid User Email.")));
			}
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse<>(false, new EmailVerificationResponse(null, verifyEmailObj.email(),
						"Token Not Found, Email Verification UnSuccessfull.")));
	}

	public ResponseEntity<ApiResponse<ResendVerificationMailResponse>> resendVerificationMail(
			@Valid ResendVerificationMailRequest mail) {
		String email = mail.email();
		Optional<Admin> adminObj = adminDAO.findByEmail(email);

		if (adminObj.isPresent()) {

			Admin admin = adminObj.get();

			if (admin.getIsVerified() == true) {
				return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(true,
						new ResendVerificationMailResponse("Email Already Verified, Please Login.")));
			}

			VerificationToken tokenObj = new VerificationToken(tokenUtil.getToken(), email, Instant.now());
			VerificationToken responseTokenObj = verificationTokenDAO.save(tokenObj);

			if (responseTokenObj != null) {
				String token = responseTokenObj.getToken();
				String mailResp = mailSender.sendVerificationEmail(admin.getEmail(), admin.getName(), token);
				System.out.println("Resend Email response: " + mailResp);

				return ResponseEntity.status(HttpStatus.OK)
						.body(new ApiResponse<>(true, new ResendVerificationMailResponse(
								"Verification Mail Sent Again Successfully, Check Your Email Indox.")));
			}

		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false,
				new ResendVerificationMailResponse("Email Not Found, Please Try Again With Valid Email.")));
	}

	public ResponseEntity<ApiResponse<LoginResponse>> adminLogin(@Valid LoginRequest loginData) {
		String email = loginData.email();
		String password = loginData.password();

		Optional<Admin> adminObj = adminDAO.findByEmail(email);
		if (adminObj.isPresent()) {
			Admin admin = adminObj.get();
			if (admin.getIsVerified() == false) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
						new ApiResponse<>(false, new LoginResponse(null, "Please Verify Your Email Before Login!")));
			}
			// Create an encoder with strength 7
			BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(7);
			// For Verification
			boolean isValid = encoder.matches(password, admin.getPassword());

			if (isValid) {
				InstituteResponse institute = new InstituteResponse(admin.getInstitute().getId(),
						admin.getInstitute().getName(), admin.getInstitute().getInstituteCode(),
						admin.getInstitute().getEmail(), admin.getInstitute().getMobileNumber(),
						admin.getInstitute().getAddress());

				AdminLoginResponse admindetails = new AdminLoginResponse(admin.getId(), admin.getName(),
						admin.getEmail(), admin.getRole(), institute);

				JwtUser user = new JwtUser(admin.getId(), admin.getEmail(), admin.getRole());
				String accessToken = jwtService.generateAccessToken(user);
				String refreshToken = jwtService.generateRefreshToken(user);

				ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken).httpOnly(true)
						.secure(true).sameSite("Strict").path("/").maxAge(Duration.ofMillis(accessTokenExpiration))
						.build();

				ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken).httpOnly(true)
						.secure(true).sameSite("Strict").path("/auth").maxAge(Duration.ofMillis(refreshTokenExpiration))
						.build();

				String hashedRefreshToken = HashUtil.sha256(refreshToken);

				refreshTokenDAO.save(new RefreshToken(admin.getEmail(), hashedRefreshToken, Instant.now()));

				return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, accessCookie.toString())
						.header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
						.body(new ApiResponse<>(true, new LoginResponse(admindetails, "Login Succussfull, Welcome!")));
			}

			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ApiResponse<>(false, new LoginResponse(null, "Wrong Password, Enter Correct Password.")));
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse<>(false, new LoginResponse(null, "Email Does Not Exist")));
	}

	// Have name Request For params
	public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshTokens(HttpServletRequest request,
			HttpServletResponse response) {

		Cookie[] cookies = request.getCookies();
		if (cookies == null || cookies.length == 0) {
			throw new UnauthorizedException("No cookies found.");
		}

		String refreshToken = null;
		for (Cookie cookie : cookies) {
			if ("refreshToken".equals(cookie.getName())) {
				refreshToken = cookie.getValue();
				break;
			}
		}
		if (refreshToken == null || refreshToken.isBlank()) {
			throw new UnauthorizedException("Refresh token is missing.");
		}
		String email;
		try {
			email = jwtService.extractEmail(refreshToken);
			if (!jwtService.validateRefreshToken(refreshToken, email)) {
				throw new UnauthorizedException("Refresh token is invalid or expired.");
			}
		} catch (Exception ex) {
			throw new UnauthorizedException("Refresh token is invalid or expired.");
		}
		RefreshToken storedToken = refreshTokenDAO.findById(email)
				.orElseThrow(() -> new UnauthorizedException("Session not found. Please login again."));
		String refreshTokenHash = HashUtil.sha256(refreshToken);
		if (!refreshTokenHash.equals(storedToken.getTokenHash())) {
			refreshTokenDAO.deleteById(email);
			throw new UnauthorizedException("Refresh token mismatch detected. Please login again.");
		}
		Admin admin = adminDAO.findByEmail(email)
				.orElseThrow(() -> new UnauthorizedException("User account not found."));
		JwtUser user = new JwtUser(admin.getId(), admin.getEmail(), admin.getRole());
		String newAccessToken = jwtService.generateAccessToken(user);
		String newRefreshToken = jwtService.generateRefreshToken(user);

		ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken).httpOnly(true).secure(true)
				.sameSite("Strict").path("/").maxAge(Duration.ofMillis(accessTokenExpiration)).build();
		ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", newRefreshToken).httpOnly(true).secure(true)
				.sameSite("Strict").path("/auth").maxAge(Duration.ofMillis(refreshTokenExpiration)).build();

		String hashedRefreshToken = HashUtil.sha256(newRefreshToken);

		refreshTokenDAO.save(new RefreshToken(admin.getEmail(), hashedRefreshToken, Instant.now()));

		return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, accessCookie.toString())
				.header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
				.body(new ApiResponse<>(true, new RefreshTokenResponse("Token refreshed successfully.")));
	}

	public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(
			@Valid ForgotPasswordRequest forgotPasswordRequest) {
		String email = forgotPasswordRequest.email();
		Optional<Admin> adminObj = adminDAO.findByEmail(email);

		if (adminObj.isPresent()) {
			Admin admin = adminObj.get();
			refreshTokenDAO.deleteById(email);
			String OTP = tokenUtil.getOTP();
			System.out.println("Generated OTP: " + OTP);
			ForgotPasswordOTP otpObj = new ForgotPasswordOTP(OTP, email, Instant.now());
			forgotPasswordOtpDAO.save(otpObj);

			String mailResp = mailSender.sendForgotPasswordOtpEmail(admin.getEmail(), admin.getName(), OTP);
			System.out.println("OTP Email response: " + mailResp);

			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(true,
					new ForgotPasswordResponse("OTP has been sent successfully. Please check your email.")));
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
				new ApiResponse<>(false, new ForgotPasswordResponse("No account found with this email address.")));
	}

	public ResponseEntity<ApiResponse<VerifyResetPasswordResponse>> verifyResetPassword(
			@Valid VerifyResetPasswordRequest verifyResetPasswordRequest) {
		String email = verifyResetPasswordRequest.email();
		String password = verifyResetPasswordRequest.password();
		String token = verifyResetPasswordRequest.token();

		Optional<ResetPasswordToken> responseTokenObj = resetPasswordTokenDao.findById(token);

		if (responseTokenObj.isPresent() && responseTokenObj.get().getUserId().equals(email)) {

			Optional<Admin> adminObj = adminDAO.findByEmail(email);
			if (adminObj.isPresent()) {
				Admin admin = adminObj.get();
				// Create an encoder with strength 7
				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(7);
				String hashedPassword = encoder.encode(password);

				admin.setPassword(hashedPassword);
				adminDAO.save(admin);

				resetPasswordTokenDao.deleteById(token);
				refreshTokenDAO.deleteById(email);

				return ResponseEntity.status(HttpStatus.OK)
						.body(new ApiResponse<>(true, new VerifyResetPasswordResponse("Password Reset Successful")));
			}
		}

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ApiResponse<>(false, new VerifyResetPasswordResponse("Please Generate New Reset Link.")));
	}

	public ResponseEntity<ApiResponse<LogoutAdminResponse>> logout(HttpServletRequest request) {

		Cookie[] cookies = request.getCookies();

		if (cookies != null) {
			String refreshToken = null;

			for (Cookie cookie : cookies) {
				if ("refreshToken".equals(cookie.getName())) {
					refreshToken = cookie.getValue();
					break;
				}
			}

			if (refreshToken != null && !refreshToken.isBlank()) {
				try {
					String email = jwtService.extractEmail(refreshToken);
					refreshTokenDAO.deleteById(email);
				} catch (Exception ex) {
					System.out.println(ex);
				}
			}
		}

		ResponseCookie accessCookie = ResponseCookie.from("accessToken", "").httpOnly(true).secure(true)
				.sameSite("Strict").path("/").maxAge(Duration.ZERO).build();

		ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "").httpOnly(true).secure(true)
				.sameSite("Strict").path("/auth").maxAge(Duration.ZERO).build();

		return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, accessCookie.toString())
				.header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
				.body(new ApiResponse<>(true, new LogoutAdminResponse("Logout successful.")));
	}

	public ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyOtp(@Valid VerifyOtpRequest verifyOtpRequest) {
		String email = verifyOtpRequest.email();
		String otp = verifyOtpRequest.OTP();
		Optional<ForgotPasswordOTP> otpObj = forgotPasswordOtpDAO.findById(otp);
		if (otpObj.isPresent()) {
			ForgotPasswordOTP repsonseOtp = otpObj.get();
			if (repsonseOtp.getUserId().equals(email)) {
				return ResponseEntity.status(HttpStatus.OK)
						.body(new ApiResponse<>(true, new VerifyOtpResponse("OTP Verified.", otp)));
			}
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ApiResponse<>(true, new VerifyOtpResponse("Invalid OTP.", "")));

	}

	public ResponseEntity<ApiResponse<UpdatePasswordResponse>> updatePassword(
			@Valid UpdatePasswordRequest updatePasswordRequest) {
		String email = updatePasswordRequest.email();
		String otp = updatePasswordRequest.OTP();
		String password = updatePasswordRequest.password();
		Optional<ForgotPasswordOTP> otpObj = forgotPasswordOtpDAO.findById(otp);
		if (otpObj.isPresent()) {
			ForgotPasswordOTP responseOtp = otpObj.get();
			if (responseOtp.getUserId().equals(email)) {
				Optional<Admin> adminObj = adminDAO.findByEmail(email);
				if (adminObj.isPresent()) {
					Admin admin = adminObj.get();
					if (passwordEncoder.matches(password, admin.getPassword())) {
						return ResponseEntity.status(HttpStatus.BAD_REQUEST)
								.body(new ApiResponse<>(false,new UpdatePasswordResponse("New password cannot be the same as the old password.")));
					}
					String hashedPassword = passwordEncoder.encode(password);

					admin.setPassword(hashedPassword);
					adminDAO.save(admin);
					forgotPasswordOtpDAO.deleteById(otp);
					return ResponseEntity.status(HttpStatus.OK)
							.body(new ApiResponse<>(true, new UpdatePasswordResponse("Password Updation Successful.")));
				}
			}
		}

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse<>(false, new UpdatePasswordResponse("Invalid or expired OTP.")));
	}

}
