# ShareNest 🏠

**ShareNest** is a roommate-finding web application built to help people—especially recent graduates—find flatmates that match their preferences, location, and lifestyle. Moving to a new city is hard, and finding the right person to share a space with shouldn't add to the stress.

> 🚧 This Project is currently under development.

---

## 🔥 Core Idea & Inspiration

When students graduate and move to new cities for work or higher education, finding a compatible flatmate can be a difficult and time-consuming task. ShareNest aims to solve that problem by enabling users to:
- Enter their preferences and location.
- Discover and connect with potential flatmates that match their criteria.
- Manage connection requests and build trust through profile interactions.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM

---

## 📌 Features Implemented (Backend)

- **Authentication:**
  - ✅ Signup API
  - ✅ Login API
  - ✅ Logout API

- **User Profile:**
  - ✅ View your profile
  - ✅ Edit your profile

- **Connection Requests:**
  - ✅ Send connection request (interested / ignore)
  - ✅ Receive request (accept / reject)
  - ✅ View profiles of connections
 
- **Connections:**
  - ✅ view your connections
  - ✅ View profiles of connections

- **Feed System:**
  - ✅ Feed API that shows user cards of all the new users.
    - new users means: you don't have connection with them & neither you nor them had already sent a connection request (interested, ignore)

---

## 🚀 Getting Started

Follow these steps to run the backend server locally:

### 1. Clone the Repository

```bash
git clone https://github.com/official-tushar/ShareNest.git
cd sharenest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
PORT=enter_the_port_number_on_which_you_want_to_run_your_server
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the server

```bash
npm run dev
```

---

## 👤 Author

Created by Tushar Srivastava (https://github.com/official-tushar)
