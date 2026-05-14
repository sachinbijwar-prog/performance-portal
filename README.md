# Smartavya Analytica - Enterprise Performance Portal 2026

A high-performance, secure, and corporate-branded appraisal system built for Smartavya Analytica. This portal manages the annual performance evaluation for 150+ resources with multi-level role-based access control (RBAC).

## 🚀 Key Features
- **Unified Login**: A single, intelligent entry point for Employees, L1/L2 Managers, and Administrators.
- **Role-Based Dashboards**: 
    - **Employees**: Complete KRA, KSA, CoE contributions, and Certifications.
    - **L1 Managers**: Review team progress and provide initial feedback.
    - **L2 Managers**: Provide final ratings and view comprehensive team analytics.
    - **Admins**: Manage users, reset passwords, and export full performance data.
- **Persistence**: Real-time synchronization with Firebase Firestore and session persistence across browser refreshes.
- **Reporting**: One-click CSV export of the entire organization's performance metrics.
- **Security**: Unique default passwords for all resources and internal password change functionality.

## 🛠 Tech Stack
- **Frontend**: HTML5, Tailwind CSS, Lucide Icons, Chart.js.
- **Backend**: Firebase Firestore (NoSQL).
- **State Management**: Reactive local store with cloud-sync hooks.

## 📂 Project Structure
- `index.html`: Main application shell and UI components.
- `js/performance-app.js`: Core application logic, database synchronization, and rendering engine.
- `README_EMPLOYEE.md`: Quick-start guide for staff members.
- `CALCULATION_LOGIC.md`: Documentation on scoring weightage and final rating formulas.

## 🌐 Deployment on GitHub Pages
This project is designed for serverless deployment.
1.  **Firebase Setup**: Ensure your Firestore rules are set to `allow read, write: if true;` (or restricted to authorized domains) for the `appraisals` collection.
2.  **Upload**: Push this repository to GitHub.
3.  **Pages**: Go to Settings -> Pages and select the `main` branch to deploy.

## 🔒 Security Note
The initial seed data (bulk users) is currently in the `loadFromCloud` function within `performance-app.js`. Once the first synchronization is successful and the Firestore database is populated, it is recommended to remove the bulk user list from the production code to protect user identities.

---
*Smart People. Smarter Solutions.*
