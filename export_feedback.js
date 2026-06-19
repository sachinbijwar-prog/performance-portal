const fs = require('fs');

// Templates defined exactly as in performance-app.js
const KRA_TEMPLATE = [
    { id: 'kra-1',  title: 'Code Quality, Standards & Best Practices',       weightage: 15 },
    { id: 'kra-2',  title: 'Process Discipline',                              weightage: 15 },
    { id: 'kra-3',  title: 'Delivery Excellence',                             weightage: 15 },
    { id: 'kra-4',  title: 'Data Pipeline Reliability',                       weightage: 10 },
    { id: 'kra-5',  title: 'Technical Expertise (Architecture Contribution)', weightage: 10 },
    { id: 'kra-6',  title: 'Collaboration',                                   weightage:  5 },
    { id: 'kra-7',  title: 'Planning & Utilization',                          weightage: 10 },
    { id: 'kra-8',  title: 'Escalation Management & Risk Mitigation',         weightage: 10 },
    { id: 'kra-9',  title: 'Continuous Improvement',                          weightage:  5 },
    { id: 'kra-10', title: 'Team Contribution',                               weightage:  5 }
];

const KSA_TEMPLATE_KEYS = [
    { key: 'dataEngPlatforms', label: 'Technical Proficiency in Data Engineering Platforms', weightage: 20 },
    { key: 'toolsExpertise',    label: 'Tools & Software Expertise',                          weightage: 20 },
    { key: 'codingProficiency', label: 'Coding & Scripting Proficiency',                      weightage: 20 },
    { key: 'communication',     label: 'Communication Skills',                                weightage: 10 },
    { key: 'timeManagement',    label: 'Time Management (Discipline)',                        weightage: 10 },
    { key: 'learningAgility',   label: 'Learning Agility',                                    weightage: 10 },
    { key: 'analyticalThinking',label: 'Analytical Thinking',                                 weightage:  5 },
    { key: 'certifications',    label: 'Professional Certifications',                         weightage:  5 }
];

// Firestore parsing helper
function parseValue(val) {
    if (!val) return null;
    if ('stringValue' in val) return val.stringValue;
    if ('integerValue' in val) return parseInt(val.integerValue, 10);
    if ('doubleValue' in val) return parseFloat(val.doubleValue);
    if ('booleanValue' in val) return val.booleanValue;
    if ('arrayValue' in val) {
        return (val.arrayValue.values || []).map(v => parseValue(v));
    }
    if ('mapValue' in val) {
        const res = {};
        const fields = val.mapValue.fields || {};
        for (const key in fields) {
            res[key] = parseValue(fields[key]);
        }
        return res;
    }
    return null;
}

// Calculate scores using active logic
function calculateScores(emp) {
    const averageCompletedManagerRatings = (l1Rating = 0, l2Rating = 0) => {
        const completedRatings = [Number(l1Rating) || 0, Number(l2Rating) || 0].filter(rating => rating > 0);
        if (!completedRatings.length) return 0;
        return completedRatings.reduce((sum, rating) => sum + rating, 0) / completedRatings.length;
    };

    let kraSum = 0;
    (emp.kras || []).forEach(k => {
        const l1Rating = k.l1 ? k.l1.rating : 0;
        const l2Rating = k.l2 ? k.l2.rating : 0;
        const r = averageCompletedManagerRatings(l1Rating, l2Rating);
        kraSum += r * (k.weightage / 100);
    });

    let ksaWeightedSum = 0;
    let ksaTotalWeight = 0;
    Object.keys(emp.ksa || {}).forEach(key => {
        const k = emp.ksa[key];
        const w = k.weightage || 0;
        const l1Rating = k.l1 ? k.l1.rating : 0;
        const l2Rating = k.l2 ? k.l2.rating : 0;
        const r = averageCompletedManagerRatings(l1Rating, l2Rating);
        ksaWeightedSum += r * (w / 100);
        ksaTotalWeight += w;
    });

    const avgKsa = ksaTotalWeight > 0 ? (ksaWeightedSum / ksaTotalWeight) * 100 : 0;
    const final = (kraSum * 0.7) + (avgKsa * 0.3);
    return {
        kra: kraSum.toFixed(2),
        ksa: avgKsa.toFixed(2),
        final: final.toFixed(2)
    };
}

function getStatus(emp) {
    if (emp.statusOverride) return emp.statusOverride;
    const kras = emp.kras || [];
    const ksa = Object.values(emp.ksa || {});
    if (kras.length === 0 || ksa.length === 0) return 'Draft';
    
    const selfDone = kras.every(k => k.self && k.self.rating > 0 && (k.self.justification || '').trim().length > 0) &&
        ksa.every(k => k.self && k.self.rating > 0 && (k.self.justification || '').trim().length > 0);
    const l1Done = kras.every(k => k.l1 && k.l1.rating > 0) && ksa.every(k => k.l1 && k.l1.rating > 0);
    const l2Done = kras.every(k => k.l2 && k.l2.rating > 0) && ksa.every(k => k.l2 && k.l2.rating > 0);
    
    if (l2Done) return 'L2 Completed';
    if (l1Done) return 'L1 Completed';
    if (selfDone) return 'Self Done';
    return 'Draft';
}

function escapeCsvCell(val) {
    if (val === null || val === undefined) return '';
    let formatted = String(val);
    formatted = formatted.replace(/\r?\n|\r/g, ' '); // Replace newlines with space
    if (formatted.includes('"') || formatted.includes(',') || formatted.includes(';') || formatted.includes('\n')) {
        formatted = '"' + formatted.replace(/"/g, '""') + '"';
    }
    return formatted;
}

async function runExport() {
    try {
        console.log("Fetching active evaluation data from Firestore...");
        const res = await fetch("https://firestore.googleapis.com/v1/projects/sa-review-app/databases/(default)/documents/appraisals/company_wide");
        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
        }
        
        const rawDoc = await res.json();
        const fields = rawDoc.fields || {};
        const store = {};
        for (const key in fields) {
            store[key] = parseValue(fields[key]);
        }
        
        if (!store.employees) {
            throw new Error("No employees found in loaded store.");
        }
        
        console.log(`Processing evaluation data for ${Object.keys(store.employees).length} users...`);
        
        // Build Headers
        const headers = [
            'Employee ID', 'Name', 'Role', 'Status', 
            'L1 Reviewer Name', 'L2 Reviewer Name', 
            'KRA Manager Score', 'KSA Manager Score', 'Final Manager Rating'
        ];
        
        // Add headers for each KRA
        KRA_TEMPLATE.forEach(k => {
            headers.push(`KRA: ${k.title} (Self Rating)`);
            headers.push(`KRA: ${k.title} (Self Justification)`);
            headers.push(`KRA: ${k.title} (L1 Rating)`);
            headers.push(`KRA: ${k.title} (L1 Comment)`);
            headers.push(`KRA: ${k.title} (L2 Rating)`);
        });
        
        // Add headers for each KSA
        KSA_TEMPLATE_KEYS.forEach(k => {
            headers.push(`KSA: ${k.label} (Self Rating)`);
            headers.push(`KSA: ${k.label} (Self Justification)`);
            headers.push(`KSA: ${k.label} (L1 Rating)`);
            headers.push(`KSA: ${k.label} (L1 Comment)`);
            headers.push(`KSA: ${k.label} (L2 Rating)`);
        });
        
        const rows = [headers];
        
        Object.entries(store.employees).forEach(([id, u]) => {
            if (u.role === 'admin') return;
            const scores = calculateScores(u);
            
            const row = [
                id,
                u.name,
                u.role,
                getStatus(u),
                u.l1_reviewer || 'N/A',
                u.l2_reviewer || 'N/A',
                scores.kra,
                scores.ksa,
                scores.final
            ];
            
            // Map KRAs
            KRA_TEMPLATE.forEach(tpl => {
                const k = (u.kras || []).find(item => item.id === tpl.id) || {};
                row.push(k.self?.rating || 0);
                row.push(k.self?.justification || '');
                row.push(k.l1?.rating || 0);
                row.push(k.l1?.comments || '');
                row.push(k.l2?.rating || 0);
            });
            
            // Map KSAs
            KSA_TEMPLATE_KEYS.forEach(tpl => {
                const k = (u.ksa && u.ksa[tpl.key]) || {};
                row.push(k.self?.rating || 0);
                row.push(k.self?.justification || '');
                row.push(k.l1?.rating || 0);
                row.push(k.l1?.comments || '');
                row.push(k.l2?.rating || 0);
            });
            
            rows.push(row);
        });
        
        const csvContent = "\ufeff" + rows.map(r => r.map(escapeCsvCell).join(",")).join("\n");
        const filename = "detailed_performance_dump_2026.csv";
        fs.writeFileSync(filename, csvContent, 'utf8');
        
        console.log(`\nSuccess! Extracted full performance feedback details.`);
        console.log(`Saved output file to: ${filename}`);
        console.log(`You can now open this file directly in Excel.`);
        
    } catch (e) {
        console.error("Export script failed:", e);
    }
}

runExport();
