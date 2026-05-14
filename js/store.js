/**
 * Store.js - Central State Management
 */

export const store = {
    user: {
        id: 'EMP-2024-001',
        name: 'Sachin Bijwar',
        designation: 'Senior Solutions Architect',
        department: 'Cloud & AI Engineering',
        reviewPeriod: 'FY 2023-24 (Annual Review)',
        reportingManager: 'Arjun Mehta',
        reviewManager: 'Deepa Krishnan',
        role: 'employee', // 'employee' | 'manager' | 'admin'
        avatar: 'https://ui-avatars.com/api/?name=Sachin+B&background=6366f1&color=fff'
    },

    status: 'Draft', // 'Draft' | 'Submitted' | 'Locked'
    
    // KRA Data
    kras: [
        {
            id: 'kra-1',
            title: 'Technical Excellence & Architecture',
            description: 'Design and deliver scalable cloud-native architectures for enterprise clients.',
            weightage: 30,
            activities: [
                'Architecture Review Board participation',
                'Design Document ownership'
            ],
            self: { rating: 4, justification: 'Successfully architected 3 major migration projects with zero downtime.' },
            reporting: { rating: 4, comments: 'Good technical depth shown in the Phoenix project.' },
            review: { rating: 0, comments: '' }
        },
        {
            id: 'kra-2',
            title: 'Team Mentorship & Growth',
            description: 'Foster a culture of learning and mentor junior developers.',
            weightage: 20,
            activities: [
                'Weekly technical sessions',
                'Code review quality'
            ],
            self: { rating: 5, justification: 'Mentored 2 associates to Senior Developer role this year.' },
            reporting: { rating: 4, comments: 'Impact on team morale is visible.' },
            review: { rating: 0, comments: '' }
        },
        {
            id: 'kra-3',
            title: 'Product Delivery & Timelines',
            description: 'Ensure on-time delivery of high-quality code features.',
            weightage: 50,
            activities: [
                'Feature completion rate',
                'Deployment success'
            ],
            self: { rating: 3, justification: 'Met most deadlines, but had slight delays in Q3 due to scope creep.' },
            reporting: { rating: 3, comments: 'Needs to improve on early estimation accuracy.' },
            review: { rating: 0, comments: '' }
        }
    ],

    // KSA Data
    ksa: {
        technical: { rating: 4, comments: 'Expertise in Kubernetes and Distributed Systems.' },
        problemSolving: { rating: 5, comments: 'Exceptional ability to debug production outages.' },
        communication: { rating: 3, comments: 'Proactive, but could improve stakeholder management.' },
        collaboration: { rating: 4, comments: 'Great team player.' },
        ownership: { rating: 5, comments: 'Treats projects as his own.' }
    },

    finalReview: {
        managerComments: '',
        hrComments: '',
        promotion: false,
        salaryHike: 0,
        acknowledged: false,
        signDate: null
    },

    // Getters / Calculators
    calculateScores() {
        // KRA Score
        let totalKraScore = 0;
        this.kras.forEach(kra => {
            // Priority: Reporting Manager Rating > Self Rating
            const rating = kra.reporting.rating || kra.self.rating || 0;
            totalKraScore += rating * (kra.weightage / 100);
        });

        // KSA Score (Average)
        const ksaKeys = Object.keys(this.ksa);
        const ksaSum = ksaKeys.reduce((acc, key) => acc + this.ksa[key].rating, 0);
        const avgKsaRating = ksaSum / ksaKeys.length;

        // Final Score
        const finalScore = (totalKraScore * 0.7) + (avgKsaRating * 0.3);

        return {
            kra: totalKraScore.toFixed(2),
            ksa: avgKsaRating.toFixed(2),
            final: finalScore.toFixed(2),
            band: this.getBand(finalScore)
        };
    },

    getBand(score) {
        if (score >= 4.5) return 'Outstanding';
        if (score >= 3.5) return 'Exceeds Expectations';
        if (score >= 2.5) return 'Meets Expectations';
        if (score >= 1.5) return 'Needs Improvement';
        return 'Unsatisfactory';
    },

    getCompletionPercentage() {
        const totalSteps = 4; // Summary, KRA, KSA, Final
        let completed = 1; // Summary always done
        
        const krasFilled = this.kras.every(k => k.self.rating > 0);
        if (krasFilled) completed++;
        
        const ksaFilled = Object.values(this.ksa).every(k => k.rating > 0);
        if (ksaFilled) completed++;
        
        if (this.finalReview.acknowledged) completed++;
        
        return Math.round((completed / totalSteps) * 100);
    }
};

// Observers (Simple event system)
export const observers = [];
export function notify() {
    observers.forEach(callback => callback());
}
