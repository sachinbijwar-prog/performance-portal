# Smartavya Analytica Performance Portal (2026) - Technical Specification

This document outlines the core architecture, workflow rules, and security restrictions for the NexGen Performance Portal.

---

## 1. Roles and Access Control (RBAC)

The portal enforces strict Role-Based Access Control to ensure data integrity and confidentiality.

### Employee
*   **Access Scope:** Can only view and edit their own appraisal data.
*   **Permissions:**
    *   Can update Self-Evaluation fields (KRAs, KSAs, CoE, Certifications).
    *   Can update their login password.
*   **Restrictions:**
    *   Cannot edit L1 Manager or L2 Manager evaluation fields.
    *   Cannot view other employees' data.
    *   Cannot submit their evaluation until **all** KRA and KSA ratings and justifications are completely filled out.

### L1 Manager
*   **Access Scope:** Can view their own appraisal (if applicable) AND the appraisals of all employees mapped to them via the `RESOURCE_MANAGER_MAPPING`.
*   **Permissions:**
    *   Can update L1 Evaluation fields for their mapped employees.
*   **Restrictions:**
    *   Cannot edit Employee Self-Evaluation fields.
    *   Cannot edit L2 Manager fields.
    *   **Workflow Lock:** Cannot submit an L1 review until the Employee has officially submitted their Self-Evaluation (status must be `Self-Completed`).

### L2 Manager (Director)
*   **Access Scope:** Can view all employees mapped to them in the hierarchy.
*   **Permissions:**
    *   Can update L2 Evaluation fields (Final Sign-off).
    *   L2 scores are the ultimate decider for the final percentage.
*   **Restrictions:**
    *   Cannot edit Employee Self or L1 Manager fields.
    *   **Workflow Lock:** Cannot submit an L2 review until the L1 Manager has officially submitted their review (status must be `L1-Approved`).

### System Administrator (admin)
*   **Access Scope:** Has global visibility over all users in the system via the Admin Dashboard.
*   **Permissions:**
    *   Can export evaluation data to CSV.
    *   Can temporarily Lock/Unlock (Revoke Access) an employee's account.
    *   Can **Reset Evaluation** (wipes all appraisal data for a specific user back to a blank template).
    *   Can Delete a user entirely from the system.
*   **Restrictions:**
    *   Cannot submit, edit, or tamper with appraisal ratings (Self, L1, or L2).

---

## 2. Appraisal Workflow & Status Lifecycle

An appraisal strictly follows this sequential lifecycle. Bypassing phases is restricted by the UI.

1.  **Draft:** The initial state. The employee is filling out their self-evaluation.
2.  **Self-Completed:** The employee has finalized and submitted their review. The form is now locked for the employee.
3.  **L1-Approved:** The L1 Manager has completed their assessment and submitted it. The L1 section is now locked.
4.  **L2-Finalized:** The L2 Manager provides the final sign-off. The entire appraisal is locked and scores are finalized.

---

## 3. Data Storage & Sync Mechanism

The application operates as a single-page application (SPA) with a real-time Cloud backend.

*   **Primary Database:** Firebase Firestore. All live data is stored in the `appraisals/company_wide` document.
*   **Sync Logic:** Any modification (rating change, text input blur) automatically triggers a save to the cloud to prevent data loss.
*   **Local Fallback:** A copy of the state is maintained in the browser's `localStorage` (`nexgen_v5_local`). If the cloud fetch fails on load, the app gracefully degrades to the local copy.
*   **Canonical Mapping:** The user list is strictly defined by `RAW_EMPLOYEE_DATA`. The system automatically generates new accounts on load if a user is added to the script, but will **never** overwrite existing evaluation data.

---

## 4. Auditing and Backups

To ensure data compliance and recovery:

*   **Audit Trails:** Every successful save to the database generates an immutable log entry in the `audit_logs` Firestore collection, tracking the User ID, Action, and Timestamp.
*   **Daily Snapshots:** The system takes an automated daily backup of the entire company state. The first user to load the app on a new day triggers a snapshot which is saved to `appraisals_backup/YYYY-MM-DD`.

---

## 5. Security & Account Rules

*   **Default Credentials:** Accounts are provisioned with a default password format (`firstname@2026`).
*   **Revocation:** If an admin flags an account as `isRevoked`, the user is immediately blocked at the login screen, regardless of correct credentials.
*   **Password Protection:** Migration scripts and data-sync functions are strictly hardcoded to never overwrite or reset a user's customized password during backend refreshes.
