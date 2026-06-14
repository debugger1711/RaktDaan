# ❤️ RaktDaan

RaktDaan is a modern, life-saving web application built on the MERN stack (MongoDB, Express.js, React, Node.js) that connects blood donors with patients in urgent need.

## ✨ Features

- **Blood Request & Matching**: Easily create urgent blood requests. The system automatically finds and notifies nearby eligible donors with the matching blood type.
- **In-App Notifications**: Real-time bell notifications within the dashboard for new requests, donor acceptances, and status updates.
- **Email Notifications**: Automated email alerts powered by Nodemailer. Donors receive urgent emails when a nearby match is found, and requesters receive updates when a donor accepts their request.
- **Downloadable Certificates**: Donors receive a beautifully designed, personalized SVG "Certificate of Appreciation" for their life-saving contributions.
- **Interactive Maps**: View active blood requests in your city on an interactive map (powered by Leaflet).
- **User Authentication**: Secure JWT-based registration and login system with user profiles.
- **Donation History & Stats**: Track your total donations, units donated, and calculate "Potential Lives Saved" based on your donation history.
- **Modern UI**: A fully responsive, beautiful, and intuitive user interface built with Tailwind CSS.

## 🚀 Technologies Used

- **Frontend**: React, React Router, Tailwind CSS, Lucide React (Icons), Leaflet (Maps)
- **Backend**: Node.js, Express.js, Nodemailer (Email service)
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcrypt

## 📦 How to Run Locally

1. Clone the repository
2. Install backend dependencies: `cd backend` -> `npm install`
3. Install frontend dependencies: `cd frontend` -> `npm install`
4. Create a `.env` file in the `backend` folder with your MongoDB URI and SMTP credentials for emails.
5. Start the backend: `npm run dev`
6. Start the frontend: `npm run dev` in the `frontend` folder.
