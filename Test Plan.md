# Test Plan - Waste Collection Tracking Tool

## Objectives
- Validate login and CRUD functionality through frontend and API.
- Automate regressions with Jest and Selenium.

## Test Types
- UI Tests: Selenium
- API Tests: Jest + SuperTest

## Environments
- Chrome browser
- Node.js v18+, Python 3.x
- React frontend (localhost:3000), Express backend (localhost:5000)

## Key Scenarios
- Login (valid/invalid)
- Add/Edit/Delete pickups
- Response validations (status codes and content)

## Exit Criteria
- All test cases pass
- Code coverage > 80%