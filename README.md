
# CampusFlow

**CampusFlow** is a smart campus management and navigation platform built using **Google technologies**. It helps students and visitors easily navigate the campus, access real-time information, and get AI-powered assistance for queries related to locations, events, and services.

---

## Features

- **User Authentication:** Secure login and signup using Firebase Authentication.
- **Campus Dashboard:** Centralized dashboard providing access to campus events and mentor assistance.
- **Pulse Events:** View and register for campus and off-campus events. All event data is stored in **Firestore DB**.
- **Mentor (AI) Assistance:** Get guidance and answers using AI-powered **Gemini API**.
- **Campus Map:** Interactive campus navigation using **Google Maps API**.
- **Issue Reporting:** Report campus-related issues directly through the app.
- **Admin Dashboard:** Admins can monitor, manage, and resolve reported issues.
- **Resolution Updates:** Real-time updates on issue resolution.

---

## System Architecture
<img width="1776" height="481" alt="Screenshot 2025-12-24 223153" src="https://github.com/user-attachments/assets/75b2ec0d-9ad8-4167-94c8-551fc9eb105d" />



- **Student/User:** Starts by logging in or signing up.
- **CampusFlow Dashboard:** Central hub for accessing events and AI mentor.
- **Pulse Events:** Connects to Firestore DB → Campus Map → Issue Reporting → Admin Dashboard → Resolution/Update.
- **Mentor (AI):** Provides guidance via Gemini AI API.

---

## Tech Stack

- **Frontend:**  React 
- **Backend:** Firebase (Authentication, Firestore DB)
- **AI:** Gemini AI API for mentor guidance
- **Maps & Navigation:** Google Maps API
- **Hosting:** Firebase Hosting / Google Cloud

---

## Installation & Setup

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/campusflow.git
