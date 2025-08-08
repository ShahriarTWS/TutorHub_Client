# 🎯 TutorHub

**Live URL:** [https://tutorhub-pro.web.app/](https://tutorhub-pro.web.app/)

---

## 🚀 Project Purpose

**TutorHub** is a collaborative study platform designed to connect students, tutors, and admins under one digital roof. It enables tutors to host study sessions, students to enroll, review, and interact, and admins to manage users, materials, and sessions efficiently. The platform enhances personalized learning, improves session engagement, and promotes academic collaboration in a secure and intuitive environment.

---

## 🖼️ Screenshot

![TutorHub Screenshot](https://res.cloudinary.com/dwgj5fypm/image/upload/v1754628467/Screenshot_2025-08-08_104503_ddzqnd.png)

---

## 🔑 Key Features

- 🔐 **Firebase Authentication**: Secure login/signup with email-password and Google sign-in support.
- 🧠 **Role-Based Dashboards**: Distinct interfaces for Admin, Tutor, and Student with protected route access.
- 📚 **Study Session Management**: Tutors can create, update, or resend rejected study session requests.
- 📝 **Session Booking & Review**: Students can book sessions (free/paid), submit reviews and ratings.
- 💳 **Stripe Payment Integration**: Secure session enrollment with fee-based booking and Stripe checkout.
- 📂 **Material Upload & Access**: Tutors upload images/links for session materials; students can view/download only if booked.
- 🧾 **Note-Taking System**: Students can create, manage, and delete personal study notes.
- 🔎 **Search & Pagination**: Optimized listing of users, tutors, sessions, and materials with backend-powered search.
- 🔔 **SweetAlert2 Feedback**: Beautiful toast and modal alerts for all CRUD actions and auth flows.
- 🔐 **JWT-Protected APIs**: Firebase token verification used for role validation and securing endpoints.
- 📱 **Fully Responsive**: Seamless design for mobile, tablet, and desktop experiences using Tailwind & DaisyUI.

---


## 🛠️ Technologies Used

### Frontend


- [`@tanstack/react-query`](https://www.npmjs.com/package/@tanstack/react-query)
- [`axios`](https://www.npmjs.com/package/axios)
- [`dotenv`](https://www.npmjs.com/package/dotenv)
- [`firebase`](https://www.npmjs.com/package/firebase)
- [`lucide-react`](https://www.npmjs.com/package/lucide-react)
- [`react`](https://www.npmjs.com/package/react)
- [`react-dom`](https://www.npmjs.com/package/react-dom)
- [`react-hook-form`](https://www.npmjs.com/package/react-hook-form)
- [`react-icons`](https://www.npmjs.com/package/react-icons)
- [`react-router-dom`](https://www.npmjs.com/package/react-router-dom)
- [`sweetalert2`](https://www.npmjs.com/package/sweetalert2)
- [`tailwindcss`](https://www.npmjs.com/package/tailwindcss)
- [`daisyui`](https://www.npmjs.com/package/daisyui)


### Backend
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Token)
- Stripe Payment API
- CORS & Dotenv

---

## ⚙️ How to Run the Project Locally

### Prerequisites:
- Node.js, nodemon & npm installed
- MongoDB URI
- Firebase project setup

### Client Setup:
```bash
git clone https://github.com/ShahriarTWS/TutorHub_Client.git
cd TutorHub_Client
npm install
# Create a .env file and add your Firebase config keys
npm run dev

```
### Client Setup:

```bash
git https://github.com/ShahriarTWS/TutorHub_Server.git
cd TutorHub_Server
npm install
# Create a .env file and add your MongoDB URI, JWT secret, Stripe keys
nodemon index.js

```

### 👤 Admin Credentials
- **Email:** `admin@tutorhub.com`  
- **Password:** `@Admin00`

---

### 📁 Repositories
- **Client:** [https://github.com/ShahriarTWS/TutorHub_Client.git](https://github.com/ShahriarTWS/TutorHub_Client.git)

- **Client:** [https://github.com/ShahriarTWS/TutorHub_Server.git](https://github.com/ShahriarTWS/TutorHub_Server.git)

---

### 📌 Note
This project was developed as part of my MERN stack learning journey. TutorHub gave me hands-on experience building a production-ready, full-featured app from scratch. Feedback is welcome!

### 🧑‍💻 Author

**Shahriar Nazim Joy**
MERN Stack Developer (in learning stage)
[`LinkedIn`](https://www.linkedin.com/in/snjoy420/) | [`Portfolio`](https://shahriar-dev.web.app/)

---

Let me know if you want:
- A Markdown file download  
- A Bengali version  
- An additional section for future improvements or challenges faced during development.