# 🚀 GearGuard – The Ultimate Maintenance Tracker

## 📌 Overview

**GearGuard** is a full-stack maintenance management system designed to help organizations **track equipment**, **manage maintenance teams**, and **handle maintenance requests** efficiently.

The system follows an **Odoo-like workflow**, connecting:

* **Equipment** (what needs maintenance)
* **Maintenance Teams** (who fixes it)
* **Maintenance Requests** (the work to be done)

Built using **React (Frontend)**, **Django REST Framework (Backend)**, and **PostgreSQL (Database)**.

---

## 🎯 Problem Statement

Organizations often struggle to:

* Track equipment across departments and employees
* Assign the right maintenance team to the right equipment
* Handle breakdowns and preventive maintenance efficiently
* Visualize maintenance work using boards and calendars

**GearGuard solves this by providing a centralized, smart maintenance tracking platform.**

---

## ✅ Solution Summary

GearGuard provides:

* Centralized equipment database
* Team-based maintenance workflow
* Corrective & preventive maintenance handling
* Kanban board and calendar views
* Smart automation similar to Odoo modules

---

## 🧠 Core Functional Modules

---

### 🧩 1. Equipment Management

Stores and manages all company assets.

**Key Features**

* Track equipment by:

  * Department
  * Assigned employee
* Assign a default maintenance team & technician
* Maintain full equipment lifecycle data

**Key Fields**

* Equipment Name
* Serial Number
* Purchase Date
* Warranty Information
* Physical Location
* Assigned Maintenance Team

---

### 👥 2. Maintenance Team Management

Handles technician grouping and responsibility.

**Key Features**

* Create multiple specialized teams:

  * Mechanics
  * Electricians
  * IT Support
* Assign technicians to teams
* Restrict request handling to assigned team members

---

### 🧾 3. Maintenance Requests

Manages the lifecycle of maintenance jobs.

**Request Types**

* 🔧 Corrective – Unplanned breakdowns
* 🔁 Preventive – Scheduled routine maintenance

**Key Fields**

* Subject (Issue description)
* Equipment
* Maintenance Type
* Scheduled Date (for preventive)
* Duration (Hours spent)
* Status (New, In Progress, Repaired, Scrap)

---

## 🔄 Functional Workflow

---

### 🔥 Flow 1: Breakdown (Corrective Maintenance)

1. Any user creates a request
2. Selecting equipment auto-fills:

   * Equipment category
   * Maintenance team
3. Request starts in **New**
4. Technician or manager assigns the request
5. Status moves to **In Progress**
6. Technician completes work:

   * Adds duration
   * Marks as **Repaired**

---

### 🗓️ Flow 2: Routine Checkup (Preventive Maintenance)

1. Manager creates a **Preventive** request
2. Sets a scheduled date
3. Request appears on **Calendar View**
4. Technician completes work on scheduled date

---

## 🖥️ User Interface & Views

---

### 📌 1. Maintenance Kanban Board

Primary workspace for technicians.

**Features**

* Columns:

  * New
  * In Progress
  * Repaired
  * Scrap
* Drag & drop request cards
* Visual indicators:

  * Assigned technician avatar
  * Overdue status highlighting

---

### 📆 2. Calendar View

* Displays all preventive maintenance requests
* Click a date to schedule new maintenance

---

### 📊 3. Reports (Optional / Advanced)

* Requests per team
* Requests per equipment category
* Visual charts & pivot tables

---

## 🤖 Smart Automation Features

---

### 🔘 Smart Buttons

* Equipment page includes **“Maintenance”** button
* Opens all requests related to that equipment
* Badge shows number of open requests

---

### 🗑️ Scrap Logic

* Moving a request to **Scrap**:

  * Marks equipment as unusable
  * Logs system note / status flag

---

## 🧑‍💻 Tech Stack

### Frontend

* React
* Axios
* React Router
* (Optional) Tailwind CSS

### Backend

* Django
* Django REST Framework
* Django CORS Headers

### Database

* PostgreSQL

---

## 📁 Project Structure

```text
gearguard/
├── backend/
│   ├── gearguard/        # Django project
│   ├── maintenance/     # Core app
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

## ⚙️ Setup Instructions

### Backend

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend: `http://localhost:8000`
Admin: `http://localhost:8000/admin`

---

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend: `http://localhost:3000`

---

## 🚀 Future Enhancements

* JWT Authentication
* Role-based access (Admin / Technician / User)
* Email & notification alerts
* Mobile-friendly UI
* Dockerized deployment
* Analytics dashboard

---

## 🏁 Conclusion

**GearGuard** is a scalable, real-world maintenance tracking system inspired by enterprise tools like **Odoo**, designed to demonstrate:

* Clean architecture
* Business logic automation
* Full-stack integration

Perfect for **hackathons, portfolios, and real-world applications**.

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

<img width="1705" height="907" alt="Screenshot 2025-12-27 at 5 42 46 PM" src="https://github.com/user-attachments/assets/8baa3d21-876b-41e8-a284-fe7b2754620b" />
<img width="1705" height="907" alt="Screenshot 2025-12-27 at 5 42 54 PM" src="https://github.com/user-attachments/assets/40540bea-a8b9-4e01-aaf2-6f89d1504028" />
<img width="1705" height="907" alt="Screenshot 2025-12-27 at 5 43 46 PM" src="https://github.com/user-attachments/assets/fea3330a-bf18-490d-a88b-b3d009d34600" />
<img width="1705" height="907" alt="Screenshot 2025-12-27 at 5 43 55 PM" src="https://github.com/user-attachments/assets/7914c5a2-9053-4d02-b82f-417c0e83370d" />
<img width="1705" height="907" alt="Screenshot 2025-12-27 at 5 42 20 PM" src="https://github.com/user-attachments/assets/1db3ffcd-7efb-4806-8d7f-c8259a85bb7d" />


Emails : 
Yesha Jagad : yeshajagad29@gamil.com
kresi Chabhadiya : kresichabhadiya@gmail.com
Khushi Malani : malanikhushi.2594@gmail.com
Kavita Rajput : kavita2310rajput@gmail.com



