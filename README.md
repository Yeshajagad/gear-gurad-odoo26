Perfect 👍
I’ve rewritten your setup into a **clean, copy-paste friendly, well-structured markdown format** that you can directly put into:

* `README.md`
* Notion
* Google Docs
* Hackathon submission

No extra explanations — just **clear steps + commands**.

---

# 🚀 GearGuard – Step-by-Step Setup Guide

---

## 📁 STEP 1: Create Project Root Folder

```bash
mkdir gearguard
cd gearguard
```

---

## 🧠 BACKEND SETUP (Django + DRF)

---

### 📁 STEP 2: Create Backend Folder & Virtual Environment

```bash
mkdir backend
cd backend
```

#### Create virtual environment

```bash
python -m venv venv
```

#### Activate virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

---

### 📄 STEP 3: Create `requirements.txt`

Create file: `backend/requirements.txt`

```txt
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
python-decouple==3.8
Pillow==10.1.0
```

---

### 📦 STEP 4: Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

### 🏗️ STEP 5: Create Django Project & App

```bash
django-admin startproject gearguard .
python manage.py startapp maintenance
```

---

### 🔄 STEP 6: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 👤 STEP 7: Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

Follow the prompts to create admin credentials.

---

### ▶️ STEP 8: Run Backend Server

```bash
python manage.py runserver
```

Backend running at:
👉 **[http://localhost:8000](http://localhost:8000)**

⚠️ Keep this terminal open

---

## 🎨 FRONTEND SETUP (React)

---

### 📁 STEP 9: Create Frontend Folder (New Terminal)

```bash
cd gearguard
npx create-react-app frontend
cd frontend
```

---

### 📦 STEP 10: Install Frontend Dependencies

```bash
npm install axios react-router-dom
```

---

### ▶️ STEP 11: Run Frontend Server

```bash
npm start
```

Frontend running at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## ✅ COMPLETE SETUP SUMMARY

---

### 🖥️ Backend (Terminal 1)

```bash
cd gearguard/backend
source venv/bin/activate
python manage.py runserver
```

* Backend API: `http://localhost:8000`
* Admin Panel: `http://localhost:8000/admin`

---

### 🌐 Frontend (Terminal 2)

```bash
cd gearguard/frontend
npm start
```

* Frontend App: `http://localhost:3000`

---

## 📌 FINAL PROJECT STRUCTURE

```text
gearguard/
├── backend/
│   ├── gearguard/
│   ├── maintenance/
│   ├── venv/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

If you want next:

* 🔗 React ↔ Django API connection
* 🐘 PostgreSQL configuration
* 🔐 JWT Authentication
* 📦 Docker setup
* 🚀 Deployment steps

Just tell me what you want next 👍