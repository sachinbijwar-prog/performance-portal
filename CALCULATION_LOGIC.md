# Performance Scoring & Rating Calculation Logic

This document outlines how final performance scores and ratings are calculated within the Smartavya Analytica Performance Portal (2026 Evaluation Cycle).

---

## 1. Overall Weightage Split

| Pillar | Weightage | Description |
| :--- | :--- | :--- |
| **KRA (Key Result Areas)** | **70%** | Objective-based performance across 10 areas. |
| **KSA (Competencies)** | **30%** | Behavioral and technical competencies across 8 areas. |

---

## 2. KRA Scoring — 10 Areas

Each KRA has an individual weightage. The score for each KRA is the average of L1 and L2 ratings.

| # | KRA | Weightage |
| :--- | :--- | :--- |
| 1 | Code Quality, Standards & Best Practices | 15% |
| 2 | Process Discipline | 15% |
| 3 | Delivery Excellence | 15% |
| 4 | Data Pipeline Reliability | 10% |
| 5 | Technical Expertise (Architecture Contribution) | 10% |
| 6 | Collaboration | 5% |
| 7 | Planning & Utilization | 10% |
| 8 | Escalation Management & Risk Mitigation | 10% |
| 9 | Continuous Improvement | 5% |
| 10 | Team Contribution | 5% |

**KRA Weighted Score** = `Σ ( (L1_Rating + L2_Rating) / 2 × (KRA_Weightage / 100) )`

---

## 3. KSA Scoring — 8 Competencies

Each KSA has an individual weightage. The score for each KSA is the average of L1 and L2 ratings, then weighted.

| # | KSA | Weightage |
| :--- | :--- | :--- |
| 1 | Technical Proficiency in Data Engineering Platforms | 20% |
| 2 | Tools & Software Expertise | 20% |
| 3 | Coding & Scripting Proficiency | 20% |
| 4 | Communication Skills | 10% |
| 5 | Time Management (Discipline) | 10% |
| 6 | Learning Agility | 10% |
| 7 | Analytical Thinking | 5% |
| 8 | Professional Certifications | 5% |

**KSA Weighted Score** = `Σ ( (L1_Rating + L2_Rating) / 2 × (KSA_Weightage / 100) )`

---

## 4. Final Rating Calculation

**Final Score** = `(KRA_Weighted_Score × 0.7) + (KSA_Weighted_Score × 0.3)`

---

## 5. Performance Rating Scale

| Score Range | Rating Band |
| :--- | :--- |
| 4.50 – 5.00 | Outstanding (O) |
| 4.00 – 4.49 | Exceeds Expectations (EE) |
| 3.00 – 3.99 | Meets Expectations (ME) |
| 2.00 – 2.99 | Needs Improvement (NI) |
| Below 2.00 | Unsatisfactory (U) |

---

*Note: The L2 Manager has final authority to adjust ratings based on CoE contributions and Certifications, which act as qualitative multipliers.*
