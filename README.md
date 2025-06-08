# ShareNest 🏠

**ShareNest** is a comprehensive roommate-finding web application designed to help people—especially recent graduates—find compatible flatmates that match their preferences, location, and lifestyle. Moving to a new city is challenging, and finding the right person to share a space with shouldn't add to the stress.

---

## 📚 Table of Contents

- [🔥 Core Idea & Inspiration](#-core-idea--inspiration)
- [🛠️ Tech Stack](#️-tech-stack)
- [🌐Live Demo](#-live-demo)
- [✨ Features Implemented](#-features-implemented)
- [📸 Screenshots](#-screenshots)
- [💡 How to Use](#-how-to-use)
- [🔧 Installation & Setup](#-installation--setup)
- [🌱 Future Scope](#-future-scope)
- [👤 Author & Contact](#-author--contact)

---

## 🔥 Core Idea & Inspiration

When students graduate and move to new cities for jobs or higher education, finding a compatible flatmate becomes a crucial but often stressful task. Traditional methods like social media posts or classified ads often lack the depth needed to find truly compatible roommates. **ShareNest** bridges this gap by providing a comprehensive platform where users can:

- Create detailed profiles with preferences and lifestyle choices
- Discover potential flatmates through their feed section
- Build connections through a secure request system
- Communicate seamlessly with matched roommates
- Make informed decisions based on comprehensive profiles

---

## 🛠️ Tech Stack

### 🔹 Frontend
- **React.js** - Component-based UI library
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library
- **React Router** - Client-side routing
- **ReduxToolkit** - Global state management
- **Socket.io Client** - Real-time communication
- **Axios** - Making API calls to the backend

### 🔹 Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcrypt.js** - Secure password hashing
- **JWT** - JSON Web Tokens for authentication
- **Cookie-Parser** - Session management
- **Socket.io** - Real-time bidirectional communication
- **CORS** - Handling cross-origin requests

---

## 🚀 Live Demo

🌐 [Visit ShareNest Live](https://your-deployed-site-link.com) *(Deployed Link coming soon)*

---

## ✨ Features Implemented

### 🔐 Authentication & Security
- **Secure Registration** - Create account with email and password.
- **Login/Logout** - JWT-based authentication with cookie sessions
- **Password Security** - bcrypt hashing for secure password storage
- **Session Management** - Persistent login sessions with secure cookies

### 👤 User Profile Management
- **Comprehensive Profiles** - Add personal details, preferences, and lifestyle choices
- **Profile Editing** - Update information anytime
- **Profile Viewing** - Browse detailed profiles of potential roommates

### 🤝 Connection System
- **Connection Requests** - Send interested/ignore requests to potential roommates
- **Request Management** - Accept or reject incoming connection requests
- **Connections Dashboard** - View all your established connections

### ✅ Feed System
- Displays a curated list of new users you haven't interacted with yet (no existing connection or pending requests).
- Built with a pagination-based UI for smoother navigation and performance.

### 💬 Real-time Chat
- **Instant Messaging** - Chat with connected roommates in real-time
- **Socket.io Integration** - Seamless, fast communication
- **Message History** - Persistent chat history
- **Secure chat** - Allows chat between mutual connections only


### 📱 User Experience

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Intuitive Interface** - Clean, modern UI with DaisyUI components
- **Fast Navigation** - Smooth routing with React Router
- **Global State Management** - Efficient state handling with Redux

---

## 📸 Screenshots

> *(Add your app screenshots in the repo and link them here)*

| Home Feed | Profile Page | Chat Window |
|-----------|--------------|-------------|
| ![Feed](./screenshots/feed.png) | ![Profile](./screenshots/profile.png) | ![Chat](./screenshots/chat.png) |

---

## 💡 How to Use

### Getting Started

1. **Signup** for new account with email and password
2. **Complete Profile** by adding your details, preferences, and lifestyle information
3. **Login** and browse the feed for potential flatmates.
4. To **Discover Roommates** browse through your feed.
5. **Send connection requests** to people you're interested in.
6. **Accept or reject** requests received.
7. **Start chatting** with people you’re connected with to explore compatibility further.


### Finding the Perfect Roommate

1. **Set Preferences** - Specify your location, budget, and lifestyle preferences
2. **Browse Profiles** - View detailed profiles of potential roommates
3. **Make Connections** - Send connection requests to interesting profiles
4. **Chat & Connect** - Use the built-in chat to get to know your matches
5. **Meet in Person** - Arrange to meet your top matches in person

---

## ⚙️ Installation & Setup

### 0. Prerequisites

- Node.js
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/official-tushar/ShareNest.git
cd ShareNest
