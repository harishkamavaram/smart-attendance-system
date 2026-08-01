package com.facetrack.dto;

public class StudentResponseDTO {

	private Long id;
	private String rollNumber;
	private String firstName;
	private String lastName;
	private String email;

	private Long instituteId;
	private String instituteName;

	private Long courseId;
	private String courseName;

	private String batch;
	private String section;

	private boolean hasImages;
	private boolean hasEmbeddings;
	private boolean isPasswordUpdated;

	private String parentName;
	private String parentMobileNumber;
	private String parentEmail;

	private String pointId;

	public StudentResponseDTO() {
	}

	public StudentResponseDTO(Long id, String rollNumber, String firstName, String lastName, String email,
			Long instituteId, String instituteName, Long courseId, String courseName, String batch, String section,
			boolean hasImages, boolean hasEmbeddings, boolean isPasswordUpdated, String parentName,
			String parentMobileNumber, String parentEmail, String pointId) {

		this.id = id;
		this.rollNumber = rollNumber;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.instituteId = instituteId;
		this.instituteName = instituteName;
		this.courseId = courseId;
		this.courseName = courseName;
		this.batch = batch;
		this.section = section;
		this.hasImages = hasImages;
		this.hasEmbeddings = hasEmbeddings;
		this.isPasswordUpdated = isPasswordUpdated;
		this.parentName = parentName;
		this.parentMobileNumber = parentMobileNumber;
		this.parentEmail = parentEmail;
		this.pointId = pointId;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRollNumber() {
		return rollNumber;
	}

	public void setRollNumber(String rollNumber) {
		this.rollNumber = rollNumber;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getInstituteId() {
		return instituteId;
	}

	public void setInstituteId(Long instituteId) {
		this.instituteId = instituteId;
	}

	public String getInstituteName() {
		return instituteName;
	}

	public void setInstituteName(String instituteName) {
		this.instituteName = instituteName;
	}

	public Long getCourseId() {
		return courseId;
	}

	public void setCourseId(Long courseId) {
		this.courseId = courseId;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getBatch() {
		return batch;
	}

	public void setBatch(String batch) {
		this.batch = batch;
	}

	public String getSection() {
		return section;
	}

	public void setSection(String section) {
		this.section = section;
	}

	public boolean isHasImages() {
		return hasImages;
	}

	public void setHasImages(boolean hasImages) {
		this.hasImages = hasImages;
	}

	public boolean isHasEmbeddings() {
		return hasEmbeddings;
	}

	public void setHasEmbeddings(boolean hasEmbeddings) {
		this.hasEmbeddings = hasEmbeddings;
	}

	public boolean isPasswordUpdated() {
		return isPasswordUpdated;
	}

	public void setPasswordUpdated(boolean isPasswordUpdated) {
		this.isPasswordUpdated = isPasswordUpdated;
	}

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	public String getParentMobileNumber() {
		return parentMobileNumber;
	}

	public void setParentMobileNumber(String parentMobileNumber) {
		this.parentMobileNumber = parentMobileNumber;
	}

	public String getParentEmail() {
		return parentEmail;
	}

	public void setParentEmail(String parentEmail) {
		this.parentEmail = parentEmail;
	}

	public String getPointId() {
		return pointId;
	}

	public void setPointId(String pointId) {
		this.pointId = pointId;
	}

}