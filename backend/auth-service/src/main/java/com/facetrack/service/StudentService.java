package com.facetrack.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
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
import org.springframework.web.multipart.MultipartFile;

import com.facetrack.dao.AdminDaoRepository;
import com.facetrack.dao.CourseDaoRepository;
import com.facetrack.dao.FileUploadHistoryDaoRepository;
import com.facetrack.dao.ForgotPasswordOTPDaoRepository;
import com.facetrack.dao.InstituteDaoRepository;
import com.facetrack.dao.RefreshTokenDaoRepository;
import com.facetrack.dao.StudentDaoRepository;
import com.facetrack.dto.FileDetails;
import com.facetrack.dto.JwtUser;
import com.facetrack.dto.StudentImportDTO;
import com.facetrack.dto.request.ForgotPasswordRequest;
import com.facetrack.dto.request.VerifyOtpRequest;
import com.facetrack.dto.response.ApiResponse;
import com.facetrack.dto.response.ForgotPasswordResponse;
import com.facetrack.dto.response.LogoutAdminResponse;
import com.facetrack.dto.response.RefreshTokenResponse;
import com.facetrack.dto.response.VerifyOtpResponse;
import com.facetrack.dto.student.request.ChangePasswordRequest;
import com.facetrack.dto.student.request.RegisterSingleStudentRequest;
import com.facetrack.dto.student.request.StudentLoginRequest;
import com.facetrack.dto.student.request.UpdateForgotPasswordRequest;
import com.facetrack.dto.student.request.UpdatePasswordRequest;
import com.facetrack.dto.student.response.ChangePasswordResponse;
import com.facetrack.dto.student.response.RegisterSingleStudentResponse;
import com.facetrack.dto.student.response.RegisterStudentsResponse;
import com.facetrack.dto.student.response.StudentDetailsResponse;
import com.facetrack.dto.student.response.StudentLoginResponse;
import com.facetrack.dto.student.response.UpdateForgotPasswordResponse;
import com.facetrack.dto.student.response.UpdatePasswordResponse;
import com.facetrack.enums.UploadStatus;
import com.facetrack.exceptions.UnauthorizedException;
import com.facetrack.helpers.EmailHelpers;
import com.facetrack.models.Admin;
import com.facetrack.models.Course;
import com.facetrack.models.FileUploadHistory;
import com.facetrack.models.Institute;
import com.facetrack.models.Student;
import com.facetrack.models.redis.ForgotPasswordOTP;
import com.facetrack.models.redis.RefreshToken;
import com.facetrack.util.HashUtil;
import com.facetrack.util.TokenUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@Service
@Validated
public class StudentService {
	@Autowired
	private StudentDaoRepository studentDAO;
	@Autowired
	private AdminDaoRepository adminDAO;
	@Autowired
	private InstituteDaoRepository instituteDAO;
	@Autowired
	private CourseDaoRepository courseDAO;
	@Autowired
	private ForgotPasswordOTPDaoRepository forgotPasswordOtpDAO;
	@Autowired
	private FileUploadHistoryDaoRepository fileUploadDAO;
	@Autowired
	private StudentExcelParser parser;
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	@Autowired
	private RefreshTokenDaoRepository refreshTokenDAO;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private EmailHelpers mailSender;

	@Value("${jwt.access-token-expiration}")
	private long accessTokenExpiration;

	@Value("${jwt.refresh-token-expiration}")
	private long refreshTokenExpiration;

	private static final TokenUtil tokenUtil = new TokenUtil();

	public ResponseEntity<ApiResponse<RegisterStudentsResponse>> importStudents(MultipartFile file,
			HttpServletRequest request) {

		List<StudentImportDTO> students = null;
		Cookie[] cookies = request.getCookies();
		String accessToken = null;
		for (Cookie c : cookies) {
			if (c.getName().equals("accessToken")) {
				accessToken = c.getValue();
				break;
			}
		}
		String email = jwtService.extractEmail(accessToken);
		Optional<Admin> adminObj = adminDAO.findByEmail(email);
		Admin admin = adminObj.isPresent() ? adminObj.get() : null;

		try {
			students = parser.parse(file);
		} catch (Exception e) {

			FileUploadHistory failedFileDetails = new FileUploadHistory();

			failedFileDetails.setFileName(file.getOriginalFilename());
			failedFileDetails.setTotalRows(0);
			failedFileDetails.setRegisteredRows(0);
			failedFileDetails.setFailedRows(0);
			failedFileDetails.setStatus(UploadStatus.Failed);
			failedFileDetails.setAdmin(admin);

			FileUploadHistory savedFile = fileUploadDAO.save(failedFileDetails);
			FileDetails respFile = new FileDetails(savedFile.getId(), savedFile.getFileName(), savedFile.getTotalRows(),
					savedFile.getRegisteredRows(), savedFile.getFailedRows(), savedFile.getStatus(),
					savedFile.getUpdatedAt());
			return ResponseEntity.badRequest().body(new ApiResponse<>(false, new RegisterStudentsResponse(
					"Unable to read Excel file. Please upload a valid .xlsx or .xls file.", "", respFile)));
		}

		List<String> errors = new ArrayList<>();

		int successCount = 0;
		int failedCount = 0;

		for (int i = 0; i < students.size(); i++) {

			StudentImportDTO dto = students.get(i);

			try {

				if (studentDAO.existsByRollNumber(dto.rollNumber())) {
					failedCount++;
					errors.add("Row " + (i + 2) + " : Roll Number already exists.");
					continue;
				}

				if (studentDAO.existsByEmail(dto.email())) {
					failedCount++;
					errors.add("Row " + (i + 2) + " : Email already exists.");
					continue;
				}

				Optional<Institute> instituteObj = instituteDAO.findById(dto.institueCode());

				if (instituteObj.isEmpty()) {
					failedCount++;
					errors.add("Row " + (i + 2) + " : Invalid Institute Code.");
					continue;
				}

				Optional<Course> courseObj = courseDAO.findById(dto.courseCode());

				if (courseObj.isEmpty()) {
					failedCount++;
					errors.add("Row " + (i + 2) + " : Invalid Course Code.");
					continue;
				}

				Student student = new Student();

				student.setRollNumber(dto.rollNumber());

				student.setFirstName(dto.firstName());

				student.setLastName(dto.lastName());

				student.setEmail(dto.email());

				student.setPassword(passwordEncoder.encode(dto.rollNumber() + "@123"));

				student.setInstitute(instituteObj.get());

				student.setCourse(courseObj.get());

				student.setBatch(dto.batch());

				student.setSection(dto.section());

				student.setParentName(dto.parentName());

				student.setParentMobileNumber(dto.parentMobileNumber());

				student.setParentEmail(dto.parentEmail());

				student.setHasEmbeddings(false);

				student.setPasswordUpdated(false);

				student.setLoginCount(0);

				studentDAO.save(student);

				successCount++;

			} catch (Exception ex) {

				failedCount++;

				errors.add("Row " + (i + 2) + " : " + ex.getMessage());
			}

		}

		StringBuilder details = new StringBuilder();

		details.append("Student Import Completed.\n");
		details.append("Total : ").append(students.size()).append("\n");
		details.append("Success : ").append(successCount).append("\n");
		details.append("Failed : ").append(failedCount);

		if (!errors.isEmpty()) {
			details.append("\n\nErrors:\n");

			for (String error : errors) {
				details.append(error).append("\n");
			}
		}

		FileUploadHistory fileDetails = new FileUploadHistory();

		fileDetails.setFileName(file.getOriginalFilename());
		fileDetails.setTotalRows(students.size());
		fileDetails.setRegisteredRows(successCount);
		fileDetails.setFailedRows(failedCount);
		fileDetails.setStatus(UploadStatus.Completed);
		fileDetails.setAdmin(admin);

		FileUploadHistory savedFile = fileUploadDAO.save(fileDetails);
		FileDetails respFile = new FileDetails(savedFile.getId(), savedFile.getFileName(), savedFile.getTotalRows(),
				savedFile.getRegisteredRows(), savedFile.getFailedRows(), savedFile.getStatus(),
				savedFile.getUpdatedAt());

		return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(true,
				new RegisterStudentsResponse("Registration Of Successful.", details.toString(), respFile)));
	}

	public ResponseEntity<ApiResponse<UpdatePasswordResponse>> updatePassword(@Valid UpdatePasswordRequest request) {

		Optional<Student> studentOpt = studentDAO.findByEmail(request.email());

		if (studentOpt.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(new ApiResponse<>(false, new UpdatePasswordResponse("No account found with this email.")));
		}

		Student student = studentOpt.get();

		if (student.getIsPasswordUpdated()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(false,
					new UpdatePasswordResponse("Password has already been updated. Please log in.")));
		}

		student.setPassword(passwordEncoder.encode(request.password()));
		student.setPasswordUpdated(true);
		studentDAO.save(student);

		return ResponseEntity.ok(
				new ApiResponse<>(true, new UpdatePasswordResponse("Password updated successfully. Please log in.")));
	}

	public ResponseEntity<ApiResponse<StudentLoginResponse>> login(@Valid StudentLoginRequest studentLoginRequest) {
		String email = studentLoginRequest.email();
		String password = studentLoginRequest.password();

		Optional<Student> studentObj = studentDAO.findByEmail(email);
		if (studentObj.isPresent()) {
			Student student = studentObj.get();
			if (student.getIsPasswordUpdated() == false) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false,
						new StudentLoginResponse(null, "Please Update Your Password, Before Login!")));
			}
			// For Verification
			boolean isValid = passwordEncoder.matches(password, student.getPassword());

			if (isValid) {

				StudentDetailsResponse studentDetails = new StudentDetailsResponse(student.getId(),
						student.getRollNumber(), student.getFirstName(), student.getLastName(), student.getEmail(),
						student.getBatch(), student.getSection(), student.getCourse().getName(),
						student.getCourse().getId(), student.getInstitute().getName(), student.getInstitute().getId(),
						student.isHasEmbeddings(), student.getParentName(), student.getParentMobileNumber(),
						student.getParentEmail(), student.getRole().name());

				JwtUser user = new JwtUser(student.getId(), student.getEmail(), student.getRole());
				String accessToken = jwtService.generateAccessToken(user);
				String refreshToken = jwtService.generateRefreshToken(user);

				ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken).httpOnly(true)
						.secure(true).sameSite("Strict").path("/").maxAge(Duration.ofMillis(accessTokenExpiration))
						.build();

				ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken).httpOnly(true)
						.secure(true).sameSite("Strict").path("/auth").maxAge(Duration.ofMillis(refreshTokenExpiration))
						.build();

				String hashedRefreshToken = HashUtil.sha256(refreshToken);

				refreshTokenDAO.save(new RefreshToken(student.getEmail(), hashedRefreshToken, Instant.now()));

				return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, accessCookie.toString())
						.header(HttpHeaders.SET_COOKIE, refreshCookie.toString()).body(new ApiResponse<>(true,
								new StudentLoginResponse(studentDetails, "Login Succussfull, Welcome!")));
			}

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false,
					new StudentLoginResponse(null, "Wrong Password, Enter Correct Password.")));
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse<>(false, new StudentLoginResponse(null, "Email Does Not Exist")));
	}

	public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(
			@Valid ForgotPasswordRequest forgotPasswordRequest) {
		String email = forgotPasswordRequest.email();
		Optional<Student> studentObj = studentDAO.findByEmail(email);

		if (studentObj.isPresent()) {
			Student student = studentObj.get();
			refreshTokenDAO.deleteById(email);
			String OTP = tokenUtil.getOTP();
			System.out.println("Generated OTP: " + OTP);
			ForgotPasswordOTP otpObj = new ForgotPasswordOTP(OTP, email, Instant.now());
			forgotPasswordOtpDAO.save(otpObj);

			String mailResp = mailSender.sendForgotPasswordOtpEmail(student.getEmail(),
					student.getFirstName() + " " + student.getLastName(), OTP);
			System.out.println("OTP Email response: " + mailResp);

			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(true,
					new ForgotPasswordResponse("OTP has been sent successfully. Please check your email.")));
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
				new ApiResponse<>(false, new ForgotPasswordResponse("No account found with this email address.")));
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

	public ResponseEntity<ApiResponse<UpdateForgotPasswordResponse>> updateForgotPassword(
			@Valid UpdateForgotPasswordRequest updatePasswordRequest) {
		String email = updatePasswordRequest.email();
		String otp = updatePasswordRequest.OTP();
		String password = updatePasswordRequest.password();
		Optional<ForgotPasswordOTP> otpObj = forgotPasswordOtpDAO.findById(otp);
		if (otpObj.isPresent()) {
			ForgotPasswordOTP responseOtp = otpObj.get();
			if (responseOtp.getUserId().equals(email)) {
				Optional<Student> studentObj = studentDAO.findByEmail(email);
				if (studentObj.isPresent()) {
					Student student = studentObj.get();
					if (passwordEncoder.matches(password, student.getPassword())) {
						return ResponseEntity.status(HttpStatus.BAD_REQUEST)
								.body(new ApiResponse<>(false, new UpdateForgotPasswordResponse(
										"New password cannot be the same as the old password.")));
					}
					String hashedPassword = passwordEncoder.encode(password);

					student.setPassword(hashedPassword);
					studentDAO.save(student);
					forgotPasswordOtpDAO.deleteById(otp);
					return ResponseEntity.status(HttpStatus.OK).body(
							new ApiResponse<>(true, new UpdateForgotPasswordResponse("Password Updation Successful.")));
				}
			}
		}

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse<>(false, new UpdateForgotPasswordResponse("Invalid or expired OTP.")));
	}

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

	public ResponseEntity<ApiResponse<RegisterSingleStudentResponse>> registerSingleStudent(
			@Valid RegisterSingleStudentRequest request) {

		if (studentDAO.existsByRollNumber(request.rollNumber())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(
					new ApiResponse<>(false, new RegisterSingleStudentResponse("Roll Number already exists.", null)));
		}

		if (studentDAO.existsByEmail(request.email())) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(new ApiResponse<>(false, new RegisterSingleStudentResponse("Email already exists.", null)));
		}

		Institute institute = instituteDAO.findById(request.institueCode()).orElse(null);

		if (institute == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ApiResponse<>(false, new RegisterSingleStudentResponse("Invalid Institute Code.", null)));
		}

		Course course = courseDAO.findById(request.courseCode()).orElse(null);

		if (course == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ApiResponse<>(false, new RegisterSingleStudentResponse("Invalid Course Code.", null)));
		}

		Student student = new Student();

		student.setRollNumber(request.rollNumber());
		student.setFirstName(request.firstName());
		student.setLastName(request.lastName());
		student.setEmail(request.email());
		student.setPassword(passwordEncoder.encode(request.rollNumber() + "@123"));
		student.setInstitute(institute);
		student.setCourse(course);
		student.setBatch(request.batch());
		student.setSection(request.section());
		student.setParentName(request.parentName());
		student.setParentMobileNumber(request.parentMobileNumber());
		student.setParentEmail(request.parentEmail());
		student.setHasEmbeddings(false);
		student.setPasswordUpdated(false);
		student.setLoginCount(0);

		Student savedStudent = studentDAO.save(student);

		StudentDetailsResponse studentResponse = new StudentDetailsResponse(savedStudent.getId(),
				savedStudent.getRollNumber(), savedStudent.getFirstName(), savedStudent.getLastName(),
				savedStudent.getEmail(), savedStudent.getBatch(), savedStudent.getSection(),
				savedStudent.getCourse().getName(), savedStudent.getCourse().getId(),
				savedStudent.getInstitute().getName(), savedStudent.getInstitute().getId(),
				savedStudent.isHasEmbeddings(), savedStudent.getParentName(), savedStudent.getParentMobileNumber(),
				savedStudent.getParentEmail(), savedStudent.getRole().name());

		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true,
				new RegisterSingleStudentResponse("Student registered successfully.", studentResponse)));
	}

	public ResponseEntity<ApiResponse<ChangePasswordResponse>> changePassword(@Valid ChangePasswordRequest request,
			HttpServletRequest httpRequest) {

		String accessToken = null;

		Cookie[] cookies = httpRequest.getCookies();

		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if ("accessToken".equals(cookie.getName())) {
					accessToken = cookie.getValue();
					break;
				}
			}
		}

		if (accessToken == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new ApiResponse<>(false, new ChangePasswordResponse("Access token not found.")));
		}

		String email = jwtService.extractEmail(accessToken);

		if (!jwtService.validateAccessToken(accessToken, email)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new ApiResponse<>(false, new ChangePasswordResponse("Invalid access token.")));
		}

		Optional<Student> studentObj = studentDAO.findByEmail(email);

		if (studentObj.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(new ApiResponse<>(false, new ChangePasswordResponse("Student not found.")));
		}

		Student student = studentObj.get();

		if (!passwordEncoder.matches(request.oldPassword(), student.getPassword())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ApiResponse<>(false, new ChangePasswordResponse("Current password is incorrect.")));
		}

		if (passwordEncoder.matches(request.newPassword(), student.getPassword())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false,
					new ChangePasswordResponse("New password cannot be the same as the current password.")));
		}

		student.setPassword(passwordEncoder.encode(request.newPassword()));
		studentDAO.save(student);

		return ResponseEntity.ok(new ApiResponse<>(true, new ChangePasswordResponse("Password changed successfully.")));
	}
}
