# SecureFileShare

SecureFileShare is a secure and user-friendly file-sharing platform that ensures data integrity and privacy. This project provides encrypted file uploads, role-based access control, and seamless authentication and authorization features to protect user information and facilitate secure file sharing.

## Demo Video
Watch the demo video to see SecureFileShare in action:  
<video src="./SecureFileShare/demo.mp4" controls width="600"></video>

## Features

### Frontend:
- **Framework:** Built using React for a dynamic and responsive UI.
- **State Management:** Integrated Redux for efficient state handling.
- **File Uploads:** Files are encrypted on the client side using the Crypto library before upload.
- **Authentication:** Supports email-based login and Google SSO.
- **Authorization:** Utilizes JSON Web Tokens (JWT) for authorization and session management.

### Backend:
- **Framework:** Developed using Python and Django for a robust and scalable backend.
- **Database:** SQLite for lightweight and efficient data storage.
- **Role-Based Access Control:** Provides different levels of access based on user roles.
- **RESTful APIs:**
  - User registration
  - Login
  - File upload
  - File view
  - File sharing
  - File download

### Security:
- **Password Security:** Bcrypt.js for hashing passwords before storing them in the database.
- **Session Management:** JWT with secure expiration for session control.

## Technology Stack
- **Frontend:** React, Redux, Crypto library
- **Backend:** Python, Django
- **Database:** SQLite
- **Authentication:** Google SSO, JWT
- **Password Security:** Bcrypt.js

## Getting Started

Follow these steps to set up and run SecureFileShare on your local machine.

### Prerequisites
- Node.js and npm installed
- Python installed

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abhishekkg-in/SecureFileShare.git
   cd SecureFileShare
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

4. **Environment Variables**:
   - Create a `.env` file in both `frontend` and `backend` directories.
   - Configure the required variables (e.g., API keys, database URLs, etc.).

### Usage
1. Navigate to the frontend app at `http://localhost:3000`.
2. Register a new user or log in using email or Google SSO.
3. Upload, share, and manage files securely.

## Database Schema
You can view the database schema [here](https://dbdiagram.io/d/67664e44fc29fb2b3b06d927).

<!-- ## Demo Video
Watch the demo video to see SecureFileShare in action: [Demo Video](https://drive.google.com/file/d/1lM5JFarFbUDRv-tQzHdFrtiOk_w2aHrB/view?usp=sharing) -->

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

---

For more information, visit the [GitHub repository](https://github.com/abhishekkg-in/SecureFileShare).
