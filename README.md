# 🏥 ClearMed
### Transparent Healthcare Decisions

![Status](https://img.shields.io/badge/status-active-success)
![Node](https://img.shields.io/badge/backend-Node.js-green)
![Next.js](https://img.shields.io/badge/frontend-Next.js-black)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Hackathon](https://img.shields.io/badge/Hackathon-India%20Innovates%202026-orange)

ClearMed is a **Healthcare Intelligence Platform** designed to help patients make **data-driven medical decisions** by providing hospital comparisons, treatment cost transparency, and treatment outcome insights.

The platform aggregates **anonymized hospital bill data**, hospital information, and patient feedback to generate **transparent healthcare insights**.

---

# 🚨 Problem

Healthcare decision-making is extremely difficult for patients.

Major challenges include:

- ❌ Patients don't know **which hospital is best for a treatment**
- ❌ Medical costs vary significantly between hospitals
- ❌ Healthcare pricing lacks transparency
- ❌ Existing platforms focus on **reviews instead of outcomes**
- ❌ Patients often know **symptoms but not diseases**

These issues lead to **unexpected medical expenses and poor treatment decisions**.

---

# 💡 Solution

ClearMed provides a **healthcare intelligence platform** that allows users to:

✔ Search hospitals by **symptoms, disease, or treatment**  
✔ Compare hospitals using **real treatment cost data**  
✔ View **doctor expertise and hospital metrics**  
✔ Upload **hospital bills for cost transparency**

The platform transforms fragmented healthcare data into **actionable insights for patients**.

---

# ✨ Key Features

## 🔎 Symptom Based Search

Users can enter symptoms and receive possible conditions and specialists.

Example:

```

Input: knee pain while walking
Output: arthritis, ligament injury
Specialist: orthopedic surgeon

```

---

## 🏥 Treatment Based Hospital Discovery

Users can search hospitals for treatments.

Example:

```

Search: Knee Replacement Surgery

```

Results include:

- hospital list
- doctor expertise
- average treatment cost
- hospital rating

---

## 📊 Hospital Comparison

Users can compare hospitals using:

- treatment cost
- doctor experience
- hospital rating
- recovery outcomes
- distance

---

## 📄 Bill Upload System

Patients can upload hospital bills.

Accepted formats:

- PDF
- Image

The system extracts:

- hospital name
- treatment
- cost
- cost breakdown

All **personal information is automatically anonymized**.

---

# 📈 Cost Intelligence Dashboard

ClearMed aggregates bill data to generate treatment cost insights.

Example:

```

Knee Replacement Surgery Cost in Delhi

Average Cost: ₹2,10,000
Minimum Cost: ₹1,40,000
Maximum Cost: ₹3,20,000

```

---

# 🏗 System Architecture

```

User
↓
Frontend (Next.js)
↓
API Gateway (Node.js)
↓
Services
├ Hospital Search Service
├ Bill Intelligence Service
├ Symptom Analysis Service
↓
PostgreSQL Database

```

---

# ⚙ Technology Stack

## Frontend
- Next.js
- React
- Tailwind CSS

## Backend
- Node.js
- Express.js
- TypeScript

## Database
- PostgreSQL
- Prisma ORM

## AI / Data Processing
- Tesseract OCR
- spaCy NLP
- Python Microservices

## Deployment
Frontend: Vercel  
Backend: Docker + AWS  
Database: AWS RDS

---

# 📂 Project Structure

```

clearmed
│
├ frontend
│   ├ pages
│   ├ components
│   ├ styles
│
├ backend
│   ├ routes
│   ├ controllers
│   ├ services
│   ├ utils
│
├ database
│   ├ prisma
│
├ ai
│   ├ symptom_engine.py
│   ├ bill_parser.py
│
├ docs
│   ├ architecture.md
│   ├ api_spec.md
│
└ README.md

```

---

# 🔗 API Endpoints

Base URL

```

/api/v1

```

### Get Hospitals

```

GET /api/v1/hospitals

```

### Upload Bill

```

POST /api/v1/bills

```

### Symptom Analysis

```

POST /api/v1/symptoms/analyze

```

---

# 🗄 Data Models

## Hospital

```

id
name
city
type
beds
accreditation
rating

```

## Doctor

```

id
name
specialization
experience_years
hospital_id

```

## Treatment

```

id
name
specialization
avg_cost

```

## Bill

```

id
hospital_id
treatment_id
total_cost
implant_cost
room_charges
date

```

---

# 🚀 Getting Started

## Clone Repository

```

git clone [https://github.com/yourusername/clearmed.git](https://github.com/yourusername/clearmed.git)
cd clearmed

```

---

## Install Dependencies

```

npm install

```

---

## Setup Environment

Create `.env` file

```

DATABASE_URL=postgresql://user:password@localhost:5432/clearmed
JWT_SECRET=your_secret

```

---

## Run Database

```

npx prisma migrate dev

```

---

## Start Backend

```

cd backend
npm run dev

```

---

## Start Frontend

```

cd frontend
npm run dev

```

Open browser:

```

[http://localhost:3000](http://localhost:3000)

```

---

# 🧪 Testing

## Unit Tests

```

npm run test

```

Framework: **Jest**

---

## Integration Tests

Framework: **Supertest**

---

## End-to-End Tests

Framework: **Cypress**

---

# 🔐 Security and Privacy

ClearMed follows strict privacy practices.

Sensitive data removed from uploaded bills:

- patient name
- phone number
- address
- insurance ID
- patient ID

Only **anonymized medical cost data** is stored.

---

# 🛣 Future Roadmap

Upcoming features:

- 🤖 AI recovery prediction
- 📊 doctor performance analytics
- 🏥 insurance integration
- 💬 telemedicine
- 🌍 national treatment cost intelligence network

---

# 🤝 Contribution

Contributions are welcome.

Steps:

```

Fork repository
Create feature branch
Commit changes
Submit pull request

```

---

# 📜 License

MIT License

---

# 🙏 Acknowledgments

Healthcare transparency research sources:

- WHO healthcare data
- Ayushman Bharat hospital datasets

---

# 📬 Contact

Project: **ClearMed**

For collaboration or queries:

ajaykushwahaa.aj@gmail.com

---

⭐ If you find this project useful, consider **starring the repository**!
```
