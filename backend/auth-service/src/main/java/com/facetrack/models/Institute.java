package com.facetrack.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "institutes")
public class Institute extends BaseEntity {

	@Column(nullable = false, unique = true)
	private String name;

	@Column(nullable = false, unique = true)
	private Integer instituteCode;

	@Column(nullable = false, unique = true, length = 150)
	private String email;

	@Column(nullable = false, length = 15)
	private String mobileNumber;

	@Column(nullable = false, length = 500)
	private String address;

	public Institute() {
		super();
	}

	public Institute(String name, Integer instituteCode, String email, String mobileNumber, String address) {
		super();
		this.name = name;
		this.instituteCode = instituteCode;
		this.email = email;
		this.mobileNumber = mobileNumber;
		this.address = address;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getInstituteCode() {
		return instituteCode;
	}

	public void setInstituteCode(Integer instituteCode) {
		this.instituteCode = instituteCode;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Override
	public String toString() {
		return "Institute [name=" + name + ", instituteCode=" + instituteCode + ", email=" + email + ", mobileNumber="
				+ mobileNumber + ", address=" + address + "]";
	}

	

}
