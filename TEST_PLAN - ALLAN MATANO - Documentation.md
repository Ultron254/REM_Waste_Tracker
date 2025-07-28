# Test Plan – Waste Collection Tracking Tool

## 1. Introduction & Scope
Functional verification of the Node.js backend (API) and React frontend (UI), with integration testing. Automation via Selenium (UI) and Jest/SuperTest (API).

## 2. Objectives
- Validate login (valid vs invalid)
- Confirm CRUD on waste pickups via UI & API
- Ensure proper HTTP status codes & error handling
- Verify end-to-end integration

## 3. Test Items
- Frontend (Login, Dashboard)
- Backend (Express API: /login, /api/pickups CRUD)
- Lowdb JSON persistence

## 4. Approach
- **Functional tests** for each requirement
- **Automated UI tests** with Selenium
- **Automated API tests** with Jest/SuperTest
- **Regression** via CI (GitHub Actions)
- **Exploratory manual testing** for UX/edge cases

## 5. Environment
- Windows 10/11 with Chrome + ChromeDriver
- Node.js 18+, Python 3
- Backend at http://localhost:5000, Frontend at http://localhost:3000

## 6. Test Data
- Default user: admin/password
- Sample pickups: "Test Waste Item" / 123 kg, etc.

## 7. Scenarios (Summary)
### Login
- Valid login -> dashboard
- Invalid login -> error

### UI (Selenium)
- Add pickup -> appears in list
- Edit pickup -> updated in list
- Delete pickup -> removed from list
- Empty description -> rejected

### API (SuperTest)
- GET empty list
- POST create, GET contains item
- PUT update item
- DELETE item, verify 404 on non-existent

## 8. Responsibilities
- Dev: write + run unit/integration tests
- QA: build Selenium UI tests + exploratory

## 9. Schedule
- Tests written alongside code
- CI on each push
- Full regression pre-release

## 10. Exit Criteria
- All tests pass
- No high-severity defects
- Critical flows automated
- Backend coverage >= 80%
