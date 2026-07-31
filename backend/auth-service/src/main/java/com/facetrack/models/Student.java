package com.facetrack.models;

import com.facetrack.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "students", indexes = { @Index(name = "idx_student_rollNumber", columnList = "rollNumber") })
public class Student extends BaseEntity {

	@Column(nullable = false, unique = true, length = 20)
	private String rollNumber;

	@Column(nullable = false, length = 100)
	private String firstName;

	@Column(nullable = false, length = 100)
	private String lastName;

	@Column(nullable = false, unique = true, length = 150)
	private String email;

	@Column(nullable = false, length = 255)
	private String password;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role = Role.STUDENT;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "institute_id", nullable = false)
	private Institute institute;

	@Column(nullable = false, length = 7)
	private String batch;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_id", nullable = false)
	private Course course;

	@Column(nullable = false, length = 10)
	private String section;

	@Column(nullable = false)
	private boolean hasEmbeddings = false;

	@Column(nullable = false)
	private boolean isPasswordUpdated = false;

	@Column(nullable = false)
	private int loginCount = 0;

	@Column(nullable = false, length = 100)
	private String parentName;

	@Column(nullable = false, length = 15)
	private String parentMobileNumber;

	@Column(nullable = false, length = 150)
	private String parentEmail;

	public Student() {
		super();
	}

	public Student(String rollNumber, String firstName, String lastName, String email, String password, Role role,
			Institute institute, String batch, Course course, String section, boolean hasEmbeddings,
			boolean isPasswordUpdated, int loginCount, String parentName, String parentMobileNumber,
			String parentEmail) {
		super();
		this.rollNumber = rollNumber;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.role = role;
		this.institute = institute;
		this.batch = batch;
		this.course = course;
		this.section = section;
		this.hasEmbeddings = hasEmbeddings;
		this.isPasswordUpdated = isPasswordUpdated;
		this.loginCount = loginCount;
		this.parentName = parentName;
		this.parentMobileNumber = parentMobileNumber;
		this.parentEmail = parentEmail;
	}

	public String getRollNumber() {
		return rollNumber;
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

	public int getLoginCount() {
		return loginCount;
	}

	public void setLoginCount(int loginCount) {
		this.loginCount = loginCount;
	}

	public void setRollNumber(String rollNumber) {
		this.rollNumber = rollNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Institute getInstitute() {
		return institute;
	}

	public void setInstitute(Institute institute) {
		this.institute = institute;
	}

	public String getBatch() {
		return batch;
	}

	public void setBatch(String batch) {
		this.batch = batch;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	public String getSection() {
		return section;
	}

	public void setSection(String section) {
		this.section = section;
	}

	public boolean isHasEmbeddings() {
		return hasEmbeddings;
	}

	public void setHasEmbeddings(boolean hasEmbeddings) {
		this.hasEmbeddings = hasEmbeddings;
	}

	public boolean getIsPasswordUpdated() {
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

	@Override
	public String toString() {
		return "Student [rollNumber=" + rollNumber + ", firstName=" + firstName + ", lastName=" + lastName + ", email="
				+ email + ", password=" + password + ", role=" + role + ", institute=" + institute + ", batch=" + batch
				+ ", course=" + course + ", section=" + section + ", hasEmbeddings=" + hasEmbeddings
				+ ", isPasswordUpdated=" + isPasswordUpdated + ", loginCount=" + loginCount + ", parentName="
				+ parentName + ", parentMobileNumber=" + parentMobileNumber + ", parentEmail=" + parentEmail + "]";
	}

}
