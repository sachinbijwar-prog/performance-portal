# Smartavya Analytica: Performance Portal Design Principles

This document defines the core technical and aesthetic standards for the **2026 Evaluation Portal**. Every future feature, bug fix, or UI modification **MUST** adhere to these principles. Any proposed change that violates these standards should be rejected or flagged for a design review.

---

## 1. Visual Identity & Aesthetics
*   **Core Palette**: 
    *   **Primary (Corporate)**: Smart Blue (`#0072bc` / Indigo-600) and Smart Orange (`#f58220` / Orange-600).
    *   **Background**: High-contrast dark mode for login (`Slate-900`) and clean enterprise-white (`#f8fafc`) for dashboards.
*   **Design Language**: **Glassmorphism**. Use subtle backdrops, `backdrop-blur-md`, and thin borders (`border-white/10`) to create a premium, layered feel.
*   **Iconography**: Exclusively use **Lucide Icons**. Maintain a consistent stroke width and size (`w-5 h-5` for nav, `w-4 h-4` for inline actions).
*   **Typography**: Clean, sans-serif fonts (Inter/sans-serif). Use `font-black` for headers and `font-bold uppercase tracking-widest` for status badges.

## 2. Architectural Standards
*   **Unified Application Logic**: All core logic must reside in `js/performance-app.js`. Do not fragment logic across multiple scripts unless creating a dedicated library.
*   **Reactive State Management**: The UI must be driven by the global `store` object. Changes to the data must trigger a `render()` call to ensure the interface is always a reflection of the truth.
*   **Surgical Rendering**: For high-frequency interactions (like Search), use surgical DOM updates (updating specific containers) rather than full-page re-renders to maintain input focus and performance.
*   **Mobile-First Resilience**: All layouts must use Tailwind's responsive prefixes (`md:`, `lg:`) to ensure perfect usability on tablets and desktops.

## 3. Security, Authentication & Access Control
*   **Authentication Standard**: Use Name-Based Usernames (`firstname.lastname`) and Employee IDs. 
    *   *Credential Logic*: Default passwords follow the `firstname@2026` pattern.
*   **Access Validation**: The system must verify the `isRevoked` status at every login attempt. Access suspension must be instantaneous organizational-wide.
*   **Role-Based Access Control (RBAC)**: Enforce strict boundaries between roles:
    *   **Employee**: Can only view/edit their own self-evaluation.
    *   **L1 Manager**: Can view team dashboards and provide L1-level ratings/comments.
    *   **L2 Manager**: Can finalize scores and view organization-wide performance analytics.
    *   **Admin**: Total system control (User management, access toggles, and data export).

## 4. Button Workflows & Actions
*   **Single Source of Action (SSOA)**: To prevent UI clutter, global workflow actions (Save Draft, Submit Review) must reside **ONLY** in the persistent header. 
    *   *Action Mapping*: 
        *   `Save Draft`: Triggers a full cloud synchronization to Firestore.
        *   `Submit Review`: Transitions the evaluation status (Self-Done → L1-Done → L2-Finalized).
*   **Safety Interlocks**: Destructive actions (Delete User) and final submissions (Submit Review) **MUST** trigger a confirmation dialog (`confirm()`) before execution.

## 5. Evaluation & Calculation Logic
*   **Weighted Scoring**: Strictly adhere to the **70% KRA / 30% KSA** weighting. 
    *   *Formula*: `(KRA_Avg * 0.7) + (KSA_Avg * 0.3) = Final Score`.
*   **Review Audit Trail**: Every management submission MUST capture the `reviewer_name` (e.g., `l1_reviewer`). Anonymous ratings are prohibited.

## 6. Reporting & Export Actions
*   **Data Portability**: The Admin dashboard must provide a "Full Detailed Dump" capability.
*   **Export Standards**: 
    *   Format: **CSV**.
    *   Content: Must include all granular ratings, reviewer identities, and justification comments for the entire resource pool.
    *   Accessibility: Restricted to `admin` roles only.

## 7. User Experience (UX) Standards
*   **Zero Latency Search**: Dashboards with 150+ resources must use **Surgical Rendering** (updating only the results container) to ensure the search bar never loses focus.
*   **Keyboard Efficiency**: All forms and logins must support the **Enter Key** for instant submission.
*   **Visual Feedback**: Every cloud action must trigger a professional toast notification (`showNote`).

---

## Compliance Checklist for Future Changes
Before implementing a new change, ask:
1. `[ ]` **Roles**: Is this action restricted to the correct user role?
2. `[ ]` **Auth**: Does it respect the Name-Based username standard?
3. `[ ]` **Buttons**: Does it avoid duplicating buttons from the header?
4. `[ ]` **Export**: Does it maintain data privacy for sensitive ratings?
5. `[ ]` **Weights**: Does it preserve the 70/30 calculation logic?

**If any answer is "No", the implementation is in violation of the Portal Design Principles.**
