# Smart Attendance Management System

An AI-powered, microservices-based attendance management system that uses facial recognition to automate attendance tracking. The project is built using a modern distributed architecture with React, Spring Boot, and FastAPI.

## 🚀 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Spring Boot
* Spring Security
* Spring Cloud Gateway
* Spring Cloud Netflix Eureka
* Spring Data JPA
* JWT Authentication

### AI Service

* FastAPI
* InsightFace
* ONNX Runtime

### Database & Cache

* PostgreSQL
* Redis

### DevOps

* Docker
* Docker Compose

---

## 🏗️ Project Structure

```text
smart-attendance-system
│
├── frontend
│
├── backend
│   ├── auth-service
│   ├── student-service
│   ├── attendance-service
│   ├── api-gateway
│   ├── service-registry
│   └── ai-service
│
├── docs
│
├── docker-compose.yml
│
└── README.md
```

---

## 📦 Services

| Service                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| Authentication Service | User authentication, JWT, authorization                    |
| Student Service        | Student management and profile operations                  |
| Attendance Service     | Attendance tracking and reporting                          |
| API Gateway            | Single entry point for all client requests                 |
| Service Registry       | Eureka server for service discovery                        |
| AI Service             | Face detection, face recognition, and embedding generation |

---

## ✨ Features

* Face Recognition Based Attendance
* JWT Authentication & Authorization
* Role-Based Access Control
* Microservices Architecture
* RESTful APIs
* Service Discovery
* API Gateway
* Attendance Reports
* Dockerized Deployment

---

## 🚧 Project Status

> 🚀 Currently under active development.

---

## 📄 License

This project is licensed under the MIT License.
