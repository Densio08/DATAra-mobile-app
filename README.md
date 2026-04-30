# 📊 DATAra: Mobile Data Usage Tracker

**DATAra** is an intelligent Android application designed for monitoring mobile data consumption. This project integrates a **Django REST Framework** backend with an **Expo (React Native)** frontend to provide a seamless user experience for tracking and managing data.

---

## 📂 Project Architecture

The system follows a **Monorepo** structure, separating the server-side logic from the mobile client.

*   **`backend/`**: Django REST Framework API handling authentication and user data.
*   **`frontend/`**: React Native (Expo) mobile application with file-based routing.
*   **`context/`**: Global state management for user sessions.

---

## 🚀 Getting Started

Follow these steps to synchronize the backend and frontend on your local machine.

### 1️⃣ Backend Setup (Django)
1.  **Navigate to the directory**: `cd backend`
2.  **Initialize Environment**:
    *   Create: `python -m venv venv`
    *   Activate (Windows): `.\venv\Scripts\activate`
3.  **Install Dependencies**:
    ```bash
    pip install django django-rest-framework django-cors-headers
    ```
4.  **Database Setup**: `python manage.py migrate`
5.  **Run Server**: `python manage.py runserver 0.0.0.0:8000`

### 2️⃣ Frontend Setup (Expo)
1.  **Navigate to the directory**: `cd frontend`
2.  **Install Packages**: `npm install`
3.  **Configure Environment**: Create a `.env` file in the `frontend/` folder:
    ```env
    EXPO_PUBLIC_API_URL=http://<your-machine-ip>:8000
    ```
4.  **Launch App**: `npx expo start -c`

---

## 🛠️ Mandatory Configurations

To ensure the system communicates correctly across your local network, verify these settings:

*   **🌐 IP Address**: Your `EXPO_PUBLIC_API_URL` must use your computer's actual IPv4 address (found via `ipconfig`). (Still working to dynamic this)
*   **🛡️ Firewall**: Port **8000** must be allowed through Windows Defender Firewall to permit mobile connections.
*   **📡 CORS**: The `backend/core/settings.py` must include `corsheaders` in both `INSTALLED_APPS` and `MIDDLEWARE`.

---

## 🧪 Technology Stack

*   **Mobile**: React Native & Expo Router (File-based routing)
*   **API**: Django REST Framework (Token Authentication)
*   **Database**: SQLite (Development)
*   **Icons**: FontAwesome5 & MaterialIcons

---



> [!TIP]
> **Pro-tip**: Always restart the Expo server with the `-c` flag after changing your `.env` file to ensure the new IP address is recognized.