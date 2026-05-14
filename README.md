# ARV Royale Society Management Portal

A lightweight, mobile-first, serverless web application designed to streamline the operations of the ARV Royale Housing Society. Built as a single-file React application, this portal eliminates the need for complex build pipelines while delivering a premium, modern dark-mode user experience.

## 🚀 Architecture
- **Frontend**: React 18, Babel (Standalone), HTML5, Vanilla CSS
- **Backend/Database**: Firebase Firestore (Real-time NoSQL)
- **Deployment**: Zero-build required. Can be hosted statically anywhere (GitHub Pages, Vercel, Netlify) or run directly via `index.html`.
- **Design System**: Mobile-first, responsive dark theme with CSS variables for dynamic styling.

---

## 📅 Module 1: MOM (Minutes of Meeting) Portal
Designed to digitize the monthly society committee meetings, ensuring transparency, compliance, and easy record-keeping.

### Key Features
* **Drafting & Publishing**: The Society Manager drafts the MOM. Once finalized, it is published for visibility.
* **Digital Signatures**: Committee Members can digitally sign the MOM using an integrated HTML5 canvas signature pad.
* **Granular Permissions**:
  * *Society Manager*: Can create, edit, and publish MOMs.
  * *Committee Members*: Can review, comment, and sign.
  * *Residents*: Have read-only access to published MOMs.
* **Discussion Threads**: Dedicated comment sections for every MOM to discuss specific points before final approval.
* **PDF Export**: Instantly export a fully formatted PDF of the MOM, complete with all captured digital signatures.
* **Audit Trail**: A strict, chronological log of when a MOM was created, edited, signed, or published.

---

## ✅ Module 2: Task Tracker
A highly practical, operational module built to log, assign, and track society maintenance work without the bloat of enterprise project management tools.

### Key Features
* **Status Workflows**: Track tasks through intuitive stages (`Pending` → `In Progress` → `Completed`).
* **Categorization & Priority**: Tag issues by category (Plumbing, Electrical, Garden) and priority (Critical, High, Medium, Low).
* **Role-Based Assignment**: Committee members can log issues ("Reported By"), and Society Managers can assign them to specific personnel ("Assigned To").
* **File Uploads**: Attach up to 5MB files (Invoices, Quotations, Before/After photos) directly to a task using Base64 Firestore storage.
* **Discussion Threads**: Inline commenting to provide updates on delayed tasks or vendor responses.
* **CSV Export**: Instantly download a comprehensive Excel-friendly CSV report of all operational tasks directly from the Dashboard.
* **Audit Trail**: Complete transparency into when a task status was changed, assigned, or a document was uploaded.

---

## ⚙️ Setup & Installation

### 1. Local Development
Because the application is built using standalone Babel and React scripts, no `npm install` or `npm run dev` is required.
1. Simply double-click `index.html` to open it in your browser.
2. If you are making code changes, it is recommended to run a lightweight local server to avoid CORS issues:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000/index.html
   ```

### 2. Firebase Configuration
The application relies on Firebase Firestore for real-time data persistence. 
1. Create a Firebase Project at [console.firebase.google.com](https://console.firebase.google.com/).
2. Enable **Firestore Database**.
3. Create a Web App in Firebase and copy your `firebaseConfig` object.
4. Replace the placeholder `firebaseConfig` inside `index.html` (around Line 60):
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       // ...
   };
   ```

### 3. Firestore Security Rules (Production)
For production deployment, ensure your Firestore rules protect the data. A basic secure structure:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if false; // Only admins can manage users
    }
    match /moms/{momId} {
      allow read: if true;
      allow write: if true; // Restrict to Managers/Committee in production
    }
    match /tasks/{taskId} {
      allow read: if true;
      allow write: if true; // Restrict to Managers/Committee in production
    }
  }
}
```

---

## 🎨 Design Customization
The entire visual aesthetic is controlled via CSS variables at the top of the `<style>` block in `index.html`. 
To modify the theme, simply adjust the variables:
```css
:root {
    --bg-main: #0f172a;      /* Main Background */
    --bg-card: #1e293b;      /* Card Background */
    --accent: #D4AF37;       /* Gold Accent Color */
    --text-main: #f8fafc;    /* Primary Text */
}
```
