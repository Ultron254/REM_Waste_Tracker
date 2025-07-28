# Waste Collection Tracking Tool - By Allan Matano 

A simple web application to track waste collection pickups, with a **React** frontend and a **Node.js/Express** backend using a flat-file JSON database via **Lowdb**. It includes automated tests for both:
- **API** (Jest + SuperTest)
- **UI** (Selenium + Python)

## 1) Prerequisitess

- **Node.js** (18+) and **npm**
- **Python 3** and **pip**
- **Google Chrome** and **ChromeDriver** (matching versions)
- (Optional) **Git**

## 2) Project Structure

```
waste-tracker/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── db.json
│   ├── package.json
│   └── tests/
│       └── api.test.js
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── Dashboard.js
│       ├── Login.js
│       └── index.js
├── ui_tests.py
├── TEST_PLAN.md
└── .github/workflows/ci.yml
```

## 3) How to Run (Dev)

**Backend**

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

**Frontend**

```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

Open `http://localhost:3000` and log in using **admin/password**.

## 4) Run Automated Tests

### API (Jest + SuperTest)

> Make sure the backend server is **NOT** running.

```bash
cd backend
npm install
npm test
```

### UI (Selenium, Python)

> Make sure both **backend** (5000) and **frontend** (3000) are running.

```bash
pip install selenium
python -m unittest ui_tests.py
```

If ChromeDriver isn't on your `PATH`, edit `ui_tests.py` and pass the path to the `ChromeService` constructor..

## 5) CI (Optional)

A minimal GitHub Actions workflow is provided at `.github/workflows/ci.yml` to run backend API tests & upload coverage.

## 6) My Notes

- This app is for demo/testing only: no production-grade auth, validation, or security.
- You can extend it with JWT auth, a real database, role-based access, etc..
