# 🏥 ClearMed - India’s first crowdsourced treatment outcome intelligence platform.

A full-stack web application for managing medical records, prescriptions, and hospital data with OCR (Optical Character Recognition) capabilities for digitizing paper-based medical documents.

## 🎯 Project Overview

ClearMed is designed to streamline medical record management by providing:
- **Digital Prescription Processing** - Upload and extract data from prescription images
- **Hospital Directory** - Browse and manage hospital information
- **Medical Records** - Centralized storage for patient health documents
- **Symptom Checker** - Intelligent symptom analysis
- **OCR Technology** - Automatic text extraction from medical documents

---

## ✨ Key Features

### Backend (Express.js)
- 🔐 **Authentication** - JWT-based user authentication with bcrypt password hashing
- 🏥 **Hospital Management** - API endpoints for hospital data
- 💊 **Prescription Processing** - Image upload and OCR text extraction
- 🔍 **Symptom Analysis** - Advanced symptom tracking and analysis
- 📋 **Bill Management** - Medical bill organization and tracking
- 🖼️ **Image Processing** - Multer-based file uploads
- 📚 **Tesseract OCR** - Accurate text extraction from medical documents

### Frontend (Next.js)
- ⚡ **Modern UI** - Next.js 15+ with App Router
- 🎨 **Styling** - Tailwind CSS for responsive design
- 📱 **Responsive Layout** - Mobile-first approach
- 🔤 **Font Optimization** - Next.js font optimization with Geist
- ✅ **Code Quality** - ESLint configuration for code standards

### Additional Features
- 🐳 **Docker Support** - Containerized deployment ready
- 🗄️ **Database** - Prisma ORM integration
- 🌐 **CORS** - Cross-origin resource sharing enabled
- 📦 **Modular Routes** - Organized API route structure

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm/yarn

### Backend
- **Framework**: Express.js 5.2.1
- **Language**: JavaScript (ES Modules)
- **OCR**: Tesseract.js 7.0.0
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer 2.1.1
- **CORS**: 2.8.6

### Database & ORM
- **ORM**: Prisma (configured)
- **Support**: PostgreSQL/MySQL ready

### Testing
- **Framework**: Jest 30.3.0
- **HTTP Testing**: Supertest 7.2.2

---

## 📥 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Docker (optional, for containerized deployment)

### Clone Repository
```bash
git clone https://github.com/ajay-kushwaha-aj/ClearMed.git
cd ClearMed
