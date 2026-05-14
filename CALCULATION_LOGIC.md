# Performance Scoring & Rating Calculation Logic

This document outlines how final performance scores and ratings are calculated within the Smartavya Analytica Performance Portal.

## 1. Component Weightage
The final rating is a weighted average of two primary pillars:

| Pillar | Weightage | Description |
| :--- | :--- | :--- |
| **KRA (Key Result Areas)** | **70%** | Objective-based performance (Technical, Team, Delivery). |
| **KSA (Competencies)** | **30%** | Behavior and soft-skill competencies (Communication, Collaboration, etc.). |

## 2. KRA Scoring
Each KRA has an assigned **Weightage** (e.g., 40%, 30%, 30%). The score for each KRA is the average of the L1 and L2 ratings.

**KRA Weighted Score** = `Σ ( (L1_Rating + L2_Rating) / 2 * (KRA_Weightage / 100) )`

## 3. KSA Scoring
KSAs are rated on a scale of 1-5 across 5 categories.
1. Technical Skills
2. Problem Solving
3. Communication
4. Collaboration
5. Ownership

**KSA Average Score** = `Σ ( (L1_Rating + L2_Rating) / 2 ) / 5`

## 4. Final Rating Calculation
The final score is calculated by combining the KRA and KSA scores based on their overall weightage.

**Final Score** = `(KRA_Weighted_Score * 0.7) + (KSA_Average_Score * 0.3)`

## 5. Performance Rating Scale
The final numeric score is mapped to the following performance buckets (typical):

*   **4.50 - 5.00**: Outstanding (O)
*   **4.00 - 4.49**: Exceeds Expectations (EE)
*   **3.00 - 3.99**: Meets Expectations (ME)
*   **2.00 - 2.99**: Needs Improvement (NI)
*   **Below 2.00**: Unsatisfactory (U)

---
*Note: The L2 Manager has the final authority to adjust ratings based on CoE contributions and Certifications which act as qualitative multipliers.*
