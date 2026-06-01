/**
 * NexGen Performance Portal - Firebase ACTIVE Sync
 * Enterprise Implementation with Live Cloud Storage.
 */

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
    apiKey: "AIzaSyDf7VZ3n3PJnOZabZjXF5uuvNdqZ6aC3A8",
    authDomain: "sa-review-app.firebaseapp.com",
    projectId: "sa-review-app",
    storageBucket: "sa-review-app.firebasestorage.app",
    messagingSenderId: "3254703472",
    appId: "1:3254703472:web:2512f4f8c38ffd027febb5"
};

// Initialize Firebase App & Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- DATA TEMPLATES ---
const KRA_TEMPLATE = [
    { id: 'kra-1',  title: 'Code Quality, Standards & Best Practices',       weightage: 15, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-2',  title: 'Process Discipline',                              weightage: 15, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-3',  title: 'Delivery Excellence',                             weightage: 15, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-4',  title: 'Data Pipeline Reliability',                       weightage: 10, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-5',  title: 'Technical Expertise (Architecture Contribution)', weightage: 10, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-6',  title: 'Collaboration',                                   weightage:  5, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-7',  title: 'Planning & Utilization',                          weightage: 10, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-8',  title: 'Escalation Management & Risk Mitigation',         weightage: 10, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-9',  title: 'Continuous Improvement',                          weightage:  5, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-10', title: 'Team Contribution',                               weightage:  5, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } }
];

const KSA_TEMPLATE = {
    dataEngPlatforms:  { label: 'Technical Proficiency in Data Engineering Platforms', weightage: 20, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    toolsExpertise:    { label: 'Tools & Software Expertise',                          weightage: 20, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    codingProficiency: { label: 'Coding & Scripting Proficiency',                      weightage: 20, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    communication:     { label: 'Communication Skills',                                weightage: 10, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    timeManagement:    { label: 'Time Management (Discipline)',                        weightage: 10, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    learningAgility:   { label: 'Learning Agility',                                    weightage: 10, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    analyticalThinking:{ label: 'Analytical Thinking',                                 weightage:  5, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    certifications:    { label: 'Professional Certifications',                         weightage:  5, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } }
};

const KRA_TEMPLATE_BY_ID = Object.fromEntries(KRA_TEMPLATE.map(kra => [kra.id, kra]));

const COE_TEMPLATE = [
    { id: 'coe-1', title: 'Knowledge Sharing Session', self: { description: '', link: '' }, l1: { comments: '', rating: 0 } },
    { id: 'coe-2', title: 'Asset / Tool Creation', self: { description: '', link: '' }, l1: { comments: '', rating: 0 } },
    { id: 'coe-3', title: 'Process Improvement', self: { description: '', link: '' }, l1: { comments: '', rating: 0 } }
];

const CERT_TEMPLATE = [
    { id: 'cert-1', title: 'Technical Certification', self: { name: '', date: '', link: '' }, l1: { rating: 0 } },
    { id: 'cert-2', title: 'Leadership / Domain Cert', self: { name: '', date: '', link: '' }, l1: { rating: 0 } }
];

const RAW_EMPLOYEE_DATA = [
    ["Abhishek Rastogi", "Employee"], ["Ganesh Shinde", "Employee"], ["Swapnil Karwa", "L1 Manager"],
    ["Abhinay Rindhe", "Employee"], ["Akshay Rohidas Gaikwad", "Employee"], ["Aniket Bhairu More", "Employee"],
    ["Sailesh Kumar", "L1 Manager"], ["Sudarshan Jadhav", "Employee"], ["Sughosh Prashant Pande", "Employee"],
    ["Vivek Vinchankar", "Employee"], ["Yashwant Bhatane", "Employee"], ["Pravin Devidas Gaddam", "Employee"],
    ["Akshay Shetty", "Employee"], ["Chaitrali Nakhate", "Employee"], ["Dinesh Chandu", "L1 Manager"],
    ["Harshad Vasudev Jadhav", "Employee"], ["Madhuri Sapkal", "L1 Manager"], ["Prajjwal Jain", "Employee"],
    ["Ritwik Parija", "Employee"], ["Sachin Lad", "Employee"], ["Shubham Lokhande", "Employee"],
    ["Sourabh Sanjay Patil", "Employee"], ["Syedabdul Shami", "Employee"], ["Anuja Deokar", "Employee"],
    ["Dharmesh Saraiya", "Employee"], ["Dishant Shinde", "Employee"], ["Kaustubh Alkari", "Employee"],
    ["Kurukuntla Reddy", "Employee"], ["Manishkumar Prajapati", "Employee"], ["Nitin Karche", "Employee"],
    ["Rohit Vishnu Pawar", "Employee"], ["Sakshi Jadhav", "Employee"], ["Sarita Yadav", "Employee"],
    ["Srirum Sridhar", "Employee"], ["Vishal Singh", "Employee"], ["Vishalvanshikumar Patel", "L1 Manager"],
    ["Yashashri Nimje", "Employee"], ["Ajinkya Barge", "Employee"], ["Arjun Tiwari", "Employee"],
    ["Mahammad Thohidh", "Employee"], ["Mohammed Wahab", "Employee"], ["Nitali Gupta", "L1 Manager"],
    ["Pikasa Bagchi", "L1 Manager"], ["Pranay Dafale", "Employee"], ["Rohan Jagtap", "Employee"],
    ["Rudraksh Apte", "Employee"], ["Suraj Shinde", "L1 Manager"], ["Tushar Shirsath", "Employee"],
    ["Saurabh Babasaheb Lengare", "Employee"], ["Sourabh Triveni Singh", "Employee"], ["Abdul Mannan", "Employee"],
    ["Ankeet Rajesh Upadhyay", "Employee"], ["Prajwal Ramchandra Bhogle", "Employee"], ["Girish Patel", "L1 Manager and L2 Manager"],
    ["Navneet Kaur", "L1 Manager and L2 Manager"], ["Sachin Bijwar", "L1 Manager and L2 Manager"], ["Simon Pinto", "L1 Manager and L2 Manager"],
    ["Akshay Lanjewar", "Employee"], ["Mihir Amdekar", "Employee"], ["Omkar Sunil Kamathe", "Employee"],
    ["Deepthi Krishnan Mani Ramakrishnan", "Employee"], ["Punit Shah", "L1 Manager and L2 Manager"], ["Pramod", "L1 Manager and L2 Manager"]
];

const RESOURCE_MANAGER_MAPPING = [
    ["Abhishek Rastogi", "Sailesh Kumar", "Sachin Bijwar"],
    ["Ganesh Shinde", "Swapnil Karwa", "Simon Pinto"],
    ["Swapnil Karwa", "Sachin Bijwar", "Punit Shah"],
    ["Abhinay Rindhe", "Pikasa Bagchi", "Sachin Bijwar"],
    ["Akshay Rohidas Gaikwad", "NA", "Punit Shah"],
    ["Aniket Bhairu More", "Suraj Shinde", "Simon Pinto"],
    ["Sailesh Kumar", "Punit Shah", "Pramod"],
    ["Sudarshan Jadhav", "Sailesh Kumar", "Sachin Bijwar"],
    ["Sughosh Prashant Pande", "Vishalvanshikumar Patel", "Sachin Bijwar"],
    ["Vivek Vinchankar", "Vishalvanshikumar Patel", "Sachin Bijwar"],
    ["Yashwant Bhatane", "Sailesh Kumar", "Sachin Bijwar"],
    ["Pravin Devidas Gaddam", "NA", "Punit Shah"],
    ["Akshay Shetty", "Swapnil Karwa", "Simon Pinto"],
    ["Chaitrali Nakhate", "Dinesh Chandu", "Girish Patel"],
    ["Dinesh Chandu", "Girish Patel", "Punit Shah"],
    ["Harshad Vasudev Jadhav", "Madhuri Sapkal", "Girish Patel"],
    ["Madhuri Sapkal", "Girish Patel", "Sachin Bijwar"],
    ["Prajjwal Jain", "Dinesh Chandu", "Girish Patel"],
    ["Ritwik Parija", "Madhuri Sapkal", "Girish Patel"],
    ["Sachin Lad", "Punit Shah", "Pramod"],
    ["Shubham Lokhande", "Dinesh Chandu", "Girish Patel"],
    ["Sourabh Sanjay Patil", "Madhuri Sapkal", "Girish Patel"],
    ["Syedabdul Shami", "Dinesh Chandu", "Girish Patel"],
    ["Anuja Deokar", "Suraj Shinde", "Sachin Bijwar"],
    ["Dharmesh Saraiya", "Swapnil Karwa", "Simon Pinto"],
    ["Dishant Shinde", "Navneet Kaur", "Simon Pinto"],
    ["Kaustubh Alkari", "Navneet Kaur", "Simon Pinto"],
    ["Kurukuntla Reddy", "Suraj Shinde", "Simon Pinto"],
    ["Nitin Karche", "Navneet Kaur", "Simon Pinto"],
    ["Rohit Vishnu Pawar", "Navneet Kaur", "Simon Pinto"],
    ["Sakshi Jadhav", "Pikasa Bagchi", "Simon Pinto"],
    ["Sarita Yadav", "Swapnil Karwa", "Simon Pinto"],
    ["Srirum Sridhar", "Swapnil Karwa", "Simon Pinto"],
    ["Vishal Singh", "Suraj Shinde", "Simon Pinto"],
    ["Vishalvanshikumar Patel", "Simon Pinto", "Punit Shah"],
    ["Yashashri Nimje", "Navneet Kaur", "Simon Pinto"],
    ["Ajinkya Barge", "Suraj Shinde", "Simon Pinto"],
    ["Arjun Tiwari", "Nitali Gupta", "Sachin Bijwar"],
    ["Mahammad Thohidh", "Vishalvanshikumar Patel", "Simon Pinto"],
    ["Nitali Gupta", "Sachin Bijwar", "Punit Shah"],
    ["Pikasa Bagchi", "Simon Pinto", "Punit Shah"],
    ["Pranay Dafale", "Swapnil Karwa", "Sachin Bijwar"],
    ["Rohan Jagtap", "Nitali Gupta", "Sachin Bijwar"],
    ["Rudraksh Apte", "Navneet Kaur", "Simon Pinto"],
    ["Suraj Shinde", "Simon Pinto", "Punit Shah"],
    ["Tushar Shirsath", "Nitali Gupta", "Sachin Bijwar"],
    ["Saurabh Babasaheb Lengare", "NA", "Punit Shah"],
    ["Sourabh Triveni Singh", "NA", "Punit Shah"],
    ["Abdul Mannan", "Sachin Bijwar", "Punit Shah"],
    ["Ankeet Rajesh Upadhyay", "Sailesh Kumar", "Sachin Bijwar"],
    ["Prajwal Ramchandra Bhogle", "Suraj Shinde", "Sachin Bijwar"],
    ["Girish Patel", "Punit Shah", "Pramod"],
    ["Navneet Kaur", "Simon Pinto", "Punit Shah"],
    ["Sachin Bijwar", "Punit Shah", "Pramod"],
    ["Simon Pinto", "Punit Shah", "Pramod"],
    ["Akshay Lanjewar", "Sachin Bijwar", "Simon Pinto"],
    ["Mihir Amdekar", "Sailesh Kumar", "Sachin Bijwar"],
    ["Omkar Sunil Kamathe", "Sailesh Kumar", "Sachin Bijwar"],
    ["Deepthi Krishnan Mani Ramakrishnan", "Pikasa Bagchi", "Simon Pinto"]
];

const INITIAL_DATA = {
    employees: {
        'admin': { id: 'admin', icon: 'AD', name: 'System Admin', role: 'admin', password: 'admin', designation: 'Portal Administrator', kras: [], ksa: {}, coe: [], certifications: [] }
    },
    currentUser: null,
    selectedEmployeeId: 'emp-1'
};

RAW_EMPLOYEE_DATA.forEach((data, index) => {
    const name = data[0];
    const id = toUserId(name);
    const roleStr = data[1];
    
    let role = 'employee';
    let designation = 'Consultant';
    if (roleStr === 'L1 Manager') { role = 'l1'; designation = 'Manager'; }
    if (roleStr === 'L1 Manager and L2 Manager') { role = 'l2'; designation = 'Director'; }
    
    const icon = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
    const password = name.split(' ')[0].toLowerCase() + '@2026';
    
    INITIAL_DATA.employees[id] = {
        id, icon, name, role, designation, password,
        kras: JSON.parse(JSON.stringify(KRA_TEMPLATE)),
        ksa: JSON.parse(JSON.stringify(KSA_TEMPLATE)),
        coe: JSON.parse(JSON.stringify(COE_TEMPLATE)),
        certifications: JSON.parse(JSON.stringify(CERT_TEMPLATE))
    };
});

// --- GLOBAL STORE ---
let store = INITIAL_DATA; // Start with local default

function toUserId(name) {
    return (name || '').toLowerCase().replace(/\s+/g, '.');
}

function createEmployeeRecord(name, roleStr = 'Employee') {
    let role = 'employee';
    let designation = 'Consultant';
    if (roleStr === 'L1 Manager') { role = 'l1'; designation = 'Manager'; }
    if (roleStr === 'L1 Manager and L2 Manager') { role = 'l2'; designation = 'Director'; }

    const id = toUserId(name);
    const icon = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
    const password = name.split(' ')[0].toLowerCase() + '@2026';

    return {
        id, icon, name, role, designation, password,
        kras: JSON.parse(JSON.stringify(KRA_TEMPLATE)),
        ksa: JSON.parse(JSON.stringify(KSA_TEMPLATE)),
        coe: JSON.parse(JSON.stringify(COE_TEMPLATE)),
        certifications: JSON.parse(JSON.stringify(CERT_TEMPLATE))
    };
}

function ensureEmployeeByName(name, roleStr = 'Employee') {
    if (!name || name === 'NA') return null;
    const id = toUserId(name);
    if (!store.employees[id]) {
        store.employees[id] = createEmployeeRecord(name, roleStr);
        return store.employees[id];
    }
    return store.employees[id];
}

function applyManagerMapping() {
    let changed = false;
    RESOURCE_MANAGER_MAPPING.forEach(([resourceName, l1Name, l2Name]) => {
        const emp = ensureEmployeeByName(resourceName);
        if (!emp) return;
        const l1 = ensureEmployeeByName(l1Name, 'L1 Manager');
        const l2 = ensureEmployeeByName(l2Name, 'L1 Manager and L2 Manager');
        const updates = {
            l1ManagerId: l1 ? l1.id : null,
            l1ManagerName: l1 ? l1.name : 'NA',
            l2ManagerId: l2 ? l2.id : null,
            l2ManagerName: l2 ? l2.name : 'NA'
        };
        Object.entries(updates).forEach(([key, value]) => {
            if (emp[key] !== value) {
                emp[key] = value;
                changed = true;
            }
        });
    });
    return changed;
}

function isSelfReview(emp) {
    return !!emp && !!store.currentUser && emp.id === store.currentUser.id;
}

function canReviewAs(emp, level) {
    if (!emp || !store.currentUser) return false;
    if (level === 'self') return isSelfReview(emp);
    if (level === 'l1') return emp.l1ManagerId === store.currentUser.id;
    if (level === 'l2') return emp.l2ManagerId === store.currentUser.id;
    return false;
}

function getVisibleEmployees() {
    const employees = Object.values(store.employees).filter(e => e.role !== 'admin');
    if (!store.currentUser) return employees;
    if (store.currentUser.role === 'admin') return employees;
    return employees.filter(e =>
        e.id === store.currentUser.id ||
        e.l1ManagerId === store.currentUser.id ||
        e.l2ManagerId === store.currentUser.id
    );
}

applyManagerMapping();

// --- FIREBASE SYNC FUNCTIONS ---

// Update Cloud when data changes
async function save(forceFull = false) {
    // 1. Keep LocalStorage as "Emergency Backup"
    localStorage.setItem('nexgen_v5_local', JSON.stringify(store));

    // 2. Push to Firestore
    try {
        if (forceFull) {
            await db.collection("appraisals").doc("company_wide").set(store);
        } else {
            const ids = new Set();
            if (store.currentUser?.id) ids.add(store.currentUser.id);
            if (store.selectedEmployeeId) ids.add(store.selectedEmployeeId);
            
            const updateArgs = [];
            ids.forEach(id => {
                if (store.employees[id]) {
                    updateArgs.push(new firebase.firestore.FieldPath("employees", id));
                    updateArgs.push(store.employees[id]);
                }
            });
            
            if (updateArgs.length > 0) {
                await db.collection("appraisals").doc("company_wide").update(...updateArgs).catch(() => {
                    return db.collection("appraisals").doc("company_wide").set(store);
                });
            } else {
                await db.collection("appraisals").doc("company_wide").set(store);
            }
        }
        console.log(`Cloud Sync: Success (${forceFull ? 'Full' : 'Partial'})`);
        
        // --- AUDIT LOGGING ---
        if (store.currentUser) {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userId: store.currentUser.id,
                userName: store.currentUser.name,
                role: store.currentUser.role,
                action: "Data Saved",
                localTime: timestamp
            };
            // Fire-and-forget audit log
            db.collection("audit_logs").add(logEntry).catch(e => console.warn("Log failed:", e));
        }

        // --- AUTOMATED DAILY BACKUP ---
        // Create a snapshot once per day (e.g., appraisals_backup/2026-06-01)
        const dateStr = new Date().toISOString().split('T')[0];
        const backupRef = db.collection("appraisals_backup").doc(dateStr);
        
        // Check if backup for today already exists in memory flag to avoid extra reads
        if (!window.__dailyBackupDone || window.__dailyBackupDone !== dateStr) {
            backupRef.get().then(doc => {
                if (!doc.exists) {
                    backupRef.set(store).then(() => {
                        console.log("Daily Backup Created:", dateStr);
                        window.__dailyBackupDone = dateStr;
                    });
                } else {
                    window.__dailyBackupDone = dateStr;
                }
            }).catch(e => console.warn("Backup check failed:", e));
        }
        
    } catch (e) {
        console.error("Cloud Sync Error:", e);
        showNote("Sync Error! Data saved locally only.");
    }
}

// Initial Sync from Cloud on startup
async function loadFromCloud() {
    try {
        const doc = await db.collection("appraisals").doc("company_wide").get();
        if (doc.exists) {
            store = doc.data();
            // MIGRATION: Ensure new sections exist for existing data
            let added = false;
            const NEW_KRA_IDS = new Set(['kra-1','kra-2','kra-3','kra-4','kra-5','kra-6','kra-7','kra-8','kra-9','kra-10']);
            const NEW_KSA_KEYS = new Set(['dataEngPlatforms','toolsExpertise','codingProficiency','communication','timeManagement','learningAgility','analyticalThinking','certifications']);

            Object.values(store.employees).forEach(emp => {
                // --- KRA MIGRATION: Non-destructive ---
                // Only reset if KRAs are completely missing or have wrong IDs (never wipe user data)
                const hasKras = emp.kras && emp.kras.length > 0;
                const hasCorrectKraIds = hasKras && emp.kras.every(k => NEW_KRA_IDS.has(k.id));
                if (!hasKras || !hasCorrectKraIds) {
                    // Truly missing or corrupted structure - reset to template (no user data to lose)
                    emp.kras = JSON.parse(JSON.stringify(KRA_TEMPLATE));
                    added = true;
                } else {
                    // Has valid KRAs - only update metadata (title/weightage), NEVER touch self/l1/l2 data
                    emp.kras.forEach(kra => {
                        const templateKra = KRA_TEMPLATE_BY_ID[kra.id];
                        if (!templateKra) return;
                        if (kra.title !== templateKra.title || kra.weightage !== templateKra.weightage) {
                            kra.title = templateKra.title;
                            kra.weightage = templateKra.weightage;
                            added = true;
                        }
                        // Ensure sub-objects exist (in case a field was never saved)
                        if (!kra.self) { kra.self = { rating: 0, justification: '' }; added = true; }
                        if (!kra.l1) { kra.l1 = { rating: 0, comments: '' }; added = true; }
                        if (!kra.l2) { kra.l2 = { rating: 0 }; added = true; }
                    });
                    // Add any entirely new KRA IDs from template that don't exist in user data
                    NEW_KRA_IDS.forEach(id => {
                        if (!emp.kras.find(k => k.id === id)) {
                            const tpl = KRA_TEMPLATE_BY_ID[id];
                            if (tpl) { emp.kras.push(JSON.parse(JSON.stringify(tpl))); added = true; }
                        }
                    });
                }

                // --- KSA MIGRATION: Non-destructive ---
                if (!emp.ksa || typeof emp.ksa !== 'object') {
                    emp.ksa = JSON.parse(JSON.stringify(KSA_TEMPLATE));
                    added = true;
                } else {
                    // Add only MISSING KSA keys - never overwrite existing ones with user data
                    NEW_KSA_KEYS.forEach(key => {
                        if (!emp.ksa[key]) {
                            emp.ksa[key] = JSON.parse(JSON.stringify(KSA_TEMPLATE[key]));
                            added = true;
                        } else {
                            // Ensure sub-objects exist
                            if (!emp.ksa[key].self) { emp.ksa[key].self = { rating: 0, justification: '' }; added = true; }
                            if (!emp.ksa[key].l1) { emp.ksa[key].l1 = { rating: 0, comments: '' }; added = true; }
                            if (!emp.ksa[key].l2) { emp.ksa[key].l2 = { rating: 0 }; added = true; }
                        }
                    });
                }

                if (!emp.coe || emp.coe.length === 0) { emp.coe = JSON.parse(JSON.stringify(COE_TEMPLATE)); added = true; }
                if (!emp.certifications || emp.certifications.length === 0) { emp.certifications = JSON.parse(JSON.stringify(CERT_TEMPLATE)); added = true; }
                if (!emp.role) emp.role = emp.id.includes('emp') ? 'employee' : 'l1';
            });
            
            // CLEANUP FIRST: Migrate stale emp-* IDs to name-based IDs BEFORE creating new templates
            Object.keys(store.employees).forEach(id => {
                if (id.startsWith('emp-')) {
                    const emp = store.employees[id];
                    const targetId = toUserId(emp.name);
                    // Copy data if target doesn't exist, OR if target is just a blank un-started template
                    if (!store.employees[targetId] || store.employees[targetId].kras[0].self.rating === 0) {
                        store.employees[targetId] = JSON.parse(JSON.stringify(emp));
                        store.employees[targetId].id = targetId;
                    }
                    delete store.employees[id];
                    added = true;
                }
            });
            
            // MERGE NEW EMPLOYEES IF MISSING (using canonical employee list)
            RAW_EMPLOYEE_DATA.forEach((data) => {
                const name = data[0];
                const roleStr = data[1];
                const username = toUserId(name);

                if (!store.employees[username]) {
                    // Truly new employee - safe to create with defaults
                    store.employees[username] = createEmployeeRecord(name, roleStr);
                    added = true;
                } else {
                    // Existing employee - NEVER overwrite their password or evaluation data
                    // Only update role/designation metadata if it changed
                    let role = 'employee';
                    let designation = 'Consultant';
                    if (roleStr === 'L1 Manager') { role = 'l1'; designation = 'Manager'; }
                    if (roleStr === 'L1 Manager and L2 Manager') { role = 'l2'; designation = 'Director'; }
                    if (store.employees[username].role !== role) {
                        store.employees[username].role = role;
                        store.employees[username].designation = designation;
                        added = true;
                    }
                    // Ensure icon and name are up-to-date (non-destructive)
                    if (!store.employees[username].icon) {
                        store.employees[username].icon = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
                        added = true;
                    }
                    // *** CRITICAL: DO NOT TOUCH .password - user may have changed it ***
                }
            });

            if (!store.employees['admin']) {
                store.employees['admin'] = JSON.parse(JSON.stringify(INITIAL_DATA.employees['admin']));
                store.employees['admin'].password = 'admin@2026';
                added = true;
            }

            // PURGE: Remove employees NOT in the canonical list (clears old bulk users)
            const canonicalIds = new Set(
                RAW_EMPLOYEE_DATA.map(d => toUserId(d[0]))
            );
            canonicalIds.add('admin');
            Object.keys(store.employees).forEach(id => {
                if (!canonicalIds.has(id)) {
                    console.log(`Purging unlisted employee: ${id}`);
                    delete store.employees[id];
                    added = true;
                }
            });

            if (applyManagerMapping()) added = true;

            if (added) save(true);
            
            // SESSION RESTORE
            const sessionData = localStorage.getItem('sa_eval_session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                
                // VALIDATE ID (Migration Support)
                if (session.user && !store.employees[session.user.id]) {
                    console.warn("Outdated session ID found. Clearing...");
                    localStorage.removeItem('sa_eval_session');
                    return render();
                }

                store.currentUser = session.user;
                store.selectedEmployeeId = session.selectedId;
                currentView = session.view || (store.currentUser.role === 'employee' ? 'kra' : 'dashboard');
                
                document.getElementById('login-overlay').classList.add('hidden');
                document.getElementById('app-container').classList.remove('opacity-0', 'blur-xl');
                // Restore history state on session resume
                history.replaceState({ view: currentView, selectedId: store.selectedEmployeeId }, '', '#' + currentView);
                renderSidebar();
                render();
            }
            
            console.log("Cloud Data Loaded & Session Restored");
            if (!store.currentUser) render(); // Only render if not logged in to avoid double render
        } else {
            console.log("No cloud data found. Using local template.");
            save(true);
        }
    } catch (e) {
        console.error("Fetch Error:", e);
        // Fallback to local storage if cloud fails
        const backup = localStorage.getItem('nexgen_v5_local');
        if (backup) store = JSON.parse(backup);
    }
}

// -- ANALYTICS --
function getStatus(emp) {
    if (emp.statusOverride) return emp.statusOverride;
    const kras = emp.kras || [];
    const ksa = Object.values(emp.ksa || {});
    if (kras.length === 0 || ksa.length === 0) return 'Draft';
    
    const selfDone = kras.every(k => k.self?.rating > 0 && (k.self?.justification || '').trim().length > 0) &&
        ksa.every(k => k.self?.rating > 0 && (k.self?.justification || '').trim().length > 0);
    const l1Done = kras.every(k => k.l1?.rating > 0) && ksa.every(k => k.l1?.rating > 0);
    const l2Done = kras.every(k => k.l2?.rating > 0) && ksa.every(k => k.l2?.rating > 0);
    
    if (l2Done) return 'L2 Completed';
    if (l1Done) return 'L1 Completed';
    if (selfDone) return 'Self Done';
    return 'Draft';
}

window.saveDraft = () => {
    save();
    showNote("Progress saved to cloud successfully.");
};

window.submitReview = () => {
    const emp = store.employees[store.selectedEmployeeId];
    const status = getStatus(emp);
    
    let newStatus = "";
    let submitRole = "";

    if (canReviewAs(emp, 'self')) {
        // Validate: all KRA ratings + justifications filled
        const missingKra = (emp.kras || []).filter(k => k.self.rating === 0 || !k.self.justification.trim());
        const missingKsa = Object.entries(emp.ksa || {}).filter(([, k]) => k.self.rating === 0 || !k.self.justification.trim());
        if (missingKra.length > 0) {
            return showNote(`Please complete all KRA ratings and justifications. Missing: ${missingKra.map(k => k.title).join(', ')}`);
        }
        if (missingKsa.length > 0) {
            return showNote(`Please complete all KSA ratings and justifications. Missing: ${missingKsa.map(([, k]) => k.label).join(', ')}`);
        }
        newStatus = "Self-Completed";
        submitRole = "self";

    } else if (canReviewAs(emp, 'l1')) {
        if (status === 'Draft') return showNote("Self evaluation must be submitted before L1 review.");
        // Validate: all KRA + KSA L1 ratings filled
        const missingKra = (emp.kras || []).filter(k => k.l1.rating === 0);
        const missingKsa = Object.entries(emp.ksa || {}).filter(([, k]) => k.l1.rating === 0);
        if (missingKra.length > 0) {
            return showNote(`Please rate all KRAs before submitting L1 review. Missing: ${missingKra.map(k => k.title).join(', ')}`);
        }
        if (missingKsa.length > 0) {
            return showNote(`Please rate all KSAs before submitting L1 review. Missing: ${missingKsa.map(([, k]) => k.label).join(', ')}`);
        }
        newStatus = "L1-Approved";
        submitRole = "l1";

    } else if (canReviewAs(emp, 'l2')) {
        if (!(status === 'L1 Completed' || status === 'L1-Approved' || status === 'L2 Completed' || status === 'L2-Finalized')) {
            return showNote("L1 review must be submitted before L2 finalization.");
        }
        // Validate: all KRA + KSA L2 ratings filled
        const missingKra = (emp.kras || []).filter(k => k.l2.rating === 0);
        const missingKsa = Object.entries(emp.ksa || {}).filter(([, k]) => k.l2.rating === 0);
        if (missingKra.length > 0) {
            return showNote(`Please rate all KRAs before L2 finalization. Missing: ${missingKra.map(k => k.title).join(', ')}`);
        }
        if (missingKsa.length > 0) {
            return showNote(`Please rate all KSAs before L2 finalization. Missing: ${missingKsa.map(([, k]) => k.label).join(', ')}`);
        }
        newStatus = "L2-Finalized";
        submitRole = "l2";

    } else {
        return showNote(store.currentUser.role === 'admin' ? "Administrators cannot submit appraisal reviews." : "You are not mapped to submit this review.");
    }

    if (confirm(`Are you sure you want to officially submit this evaluation as ${newStatus}?`)) {
        emp.statusOverride = newStatus;
        if (submitRole === 'l1') emp.l1_reviewer = store.currentUser.name;
        if (submitRole === 'l2') emp.l2_reviewer = store.currentUser.name;
        
        save();
        render();
        showNote(`Review Submitted — ${newStatus}.`);
    }
};

function getTeamStats() {
    const employees = getVisibleEmployees();
    const stats = { draft: 0, self: 0, l1: 0, l2: 0, total: employees.length };
    employees.forEach(e => {
        const s = getStatus(e);
        if (s === 'L2 Completed' || s === 'L2-Finalized') stats.l2++;
        else if (s === 'L1 Completed' || s === 'L1-Approved') stats.l1++;
        else if (s === 'Self Done' || s === 'Self-Completed') stats.self++;
        else stats.draft++;
    });
    return stats;
}

function calculateScores(emp) {
    const averageCompletedManagerRatings = (l1Rating = 0, l2Rating = 0) => {
        const completedRatings = [Number(l1Rating) || 0, Number(l2Rating) || 0].filter(rating => rating > 0);
        if (!completedRatings.length) return 0;
        return completedRatings.reduce((sum, rating) => sum + rating, 0) / completedRatings.length;
    };

    // KRA: weighted sum (each KRA has its own weightage, total = 100%)
    let kraSum = 0;
    (emp.kras || []).forEach(k => {
        const r = averageCompletedManagerRatings(k.l1.rating, k.l2.rating);
        kraSum += r * (k.weightage / 100);
    });
    // KSA: weighted average (each KSA has its own weightage, total = 100%)
    let ksaWeightedSum = 0;
    let ksaTotalWeight = 0;
    Object.values(emp.ksa || {}).forEach(k => {
        const w = k.weightage || 0;
        const r = averageCompletedManagerRatings(k.l1.rating, k.l2.rating);
        ksaWeightedSum += r * (w / 100);
        ksaTotalWeight += w;
    });
    // Normalise in case weights don't sum to exactly 100
    const avgKsa = ksaTotalWeight > 0 ? (ksaWeightedSum / ksaTotalWeight) * 100 : 0;
    const final = (kraSum * 0.7) + (avgKsa * 0.3);
    return { kra: kraSum.toFixed(2), ksa: avgKsa.toFixed(2), final: final.toFixed(2) };
}

function updateProgress(emp) {
    if (!emp) return;
    let total = 0; let done = 0;
    (emp.kras || []).forEach(k => { total++; if (k.self.rating > 0 && k.self.justification.trim()) done++; });
    Object.values(emp.ksa || {}).forEach(k => { total++; if (k.self.rating > 0 && k.self.justification.trim()) done++; });
    (emp.coe || []).forEach(c => { total++; if (c.self.description.trim()) done++; });
    (emp.certifications || []).forEach(c => { total++; if (c.self.name.trim()) done++; });
    const p = total > 0 ? Math.round((done / total) * 100) : 0;
    const bar = document.getElementById('progress-bar');
    const txt = document.getElementById('progress-text');
    if (bar && txt) { bar.style.width = p + '%'; txt.innerText = p + '%'; }
}

// --- APP UI CORE ---
window.login = (type, id, pass) => {
    const userInp = document.getElementById('login-user');
    const passInp = document.getElementById('login-pass');
    userInp.classList.remove('border-rose-500', 'ring-rose-500/50');
    passInp.classList.remove('border-rose-500', 'ring-rose-500/50');

    if (!store || !store.employees) return alert("System still loading...");
    
    const emp = store.employees[id];
    if (!emp) {
        userInp.classList.add('border-rose-500', 'ring-rose-500/50');
        return showNote("Invalid Username or ID.");
    }

    if (emp.isRevoked) {
        userInp.classList.add('border-rose-500', 'ring-rose-500/50');
        return showNote("Access Revoked: Your account has been suspended.", "error");
    }
    
    if (emp.password && emp.password !== pass) {
        passInp.classList.add('border-rose-500', 'ring-rose-500/50');
        return showNote("Incorrect password.");
    }

    store.currentUser = { role: emp.role, id, name: emp.name };
    const visibleEmployees = getVisibleEmployees();
    store.selectedEmployeeId = emp.role === 'employee' ? id : (visibleEmployees[0]?.id || id);
    
    localStorage.setItem('sa_eval_session', JSON.stringify({
        user: store.currentUser,
        selectedId: store.selectedEmployeeId,
        view: emp.role === 'employee' ? 'kra' : 'dashboard'
    }));

    save();
    document.getElementById('login-overlay').classList.add('hidden');
    document.getElementById('app-container').classList.remove('opacity-0', 'blur-xl');
    // Push initial history entry after login
    const initialView = emp.role === 'employee' ? 'kra' : 'dashboard';
    history.replaceState({ view: initialView, selectedId: store.selectedEmployeeId }, '', '#' + initialView);
    renderSidebar(); 
    render();
};

window.logout = () => {
    localStorage.removeItem('sa_eval_session');
    location.reload();
};

window.updatePassword = (newPass) => {
    if (!newPass || newPass.length < 4) return showNote('Password too short');
    store.employees[store.currentUser.id].password = newPass;
    save();
    showNote('Password updated successfully!');
};

window.submitPinChange = () => {
    const p1 = document.getElementById('new-pin-input').value;
    const p2 = document.getElementById('confirm-pin-input').value;
    
    if (!p1 || p1.length < 4) return showNote('Password must be at least 4 characters.');
    if (p1 !== p2) return showNote('Passwords do not match.');
    
    store.employees[store.currentUser.id].password = p1;
    save();
    
    document.getElementById('new-pin-input').value = '';
    document.getElementById('confirm-pin-input').value = '';
    document.getElementById('change-pin-modal').classList.add('hidden');
    
    showNote('Password updated successfully!');
};

window.showNote = (msg) => {
    const t = document.getElementById('ai-suggestion');
    const tx = document.getElementById('ai-text');
    tx.innerText = msg;
    t.classList.remove('translate-y-32');
    setTimeout(() => t.classList.add('translate-y-32'), 4000);
};

window.setKra = (id, field, role, val) => {
    const emp = store.employees[store.selectedEmployeeId];
    if (!canReviewAs(emp, role)) return showNote("You are not mapped to edit this section.");
    store.employees[store.selectedEmployeeId].kras.find(x => x.id === id)[role][field] = field === 'rating' ? parseInt(val) : val;
    if (field === 'rating') { save(); render(); } else { save(); }
};

window.setKsa = (key, field, role, val) => {
    const emp = store.employees[store.selectedEmployeeId];
    if (!canReviewAs(emp, role)) return showNote("You are not mapped to edit this section.");
    store.employees[store.selectedEmployeeId].ksa[key][role][field] = field === 'rating' ? parseInt(val) : val;
    if (field === 'rating') { save(); render(); } else { save(); }
};

let currentView = 'dashboard';
window.toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;
    if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        if (overlay) overlay.classList.remove('hidden');
    } else {
        sidebar.classList.remove('translate-x-0');
        sidebar.classList.add('-translate-x-full');
        if (overlay) overlay.classList.add('hidden');
    }
};

window.navigate = (v, pushState = true) => { 
    currentView = v; 
    const sessionData = localStorage.getItem('sa_eval_session');
    if (sessionData) {
        const session = JSON.parse(sessionData);
        session.view = v;
        localStorage.setItem('sa_eval_session', JSON.stringify(session));
    }
    // Push to browser history so back/forward works
    if (pushState) {
        const url = '#' + v;
        history.pushState({ view: v, selectedId: store.selectedEmployeeId }, '', url);
    }
    // Auto-close sidebar on mobile after clicking navigation
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && sidebar.classList.contains('translate-x-0') && window.innerWidth < 768) {
        sidebar.classList.remove('translate-x-0');
        sidebar.classList.add('-translate-x-full');
        if (overlay) overlay.classList.add('hidden');
    }
    renderSidebar(); 
    render(); 
};

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (!store.currentUser) return; // not logged in, ignore
    if (e.state && e.state.view) {
        // Restore selected employee if it was stored in state
        if (e.state.selectedId && store.employees[e.state.selectedId]) {
            store.selectedEmployeeId = e.state.selectedId;
        }
        navigate(e.state.view, false); // false = don't push another history entry
    } else {
        // Fallback: read from hash
        const hash = location.hash.replace('#', '');
        const validViews = ['dashboard', 'kra', 'ksa', 'admin'];
        if (validViews.includes(hash)) {
            navigate(hash, false);
        }
    }
});

let searchQuery = "";
let pipelineFilter = "all";
window.handleSearch = (val) => {
    searchQuery = val.toLowerCase();
    const adminBody = document.getElementById('admin-table-body');
    const dashBody = document.getElementById('dashboard-list-body');
    if (adminBody) renderAdminResults(adminBody);
    if (dashBody) renderDashboardResults(dashBody);
};

window.setPipelineFilter = (filter) => {
    pipelineFilter = filter;
    const dashBody = document.getElementById('dashboard-list-body');
    const filterBar = document.getElementById('pipeline-filter-bar');
    if (filterBar) {
        filterBar.querySelectorAll('button').forEach(btn => {
            const active = btn.dataset.filter === filter;
            btn.className = active
                ? 'px-3 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase shadow-sm transition-all'
                : 'px-3 py-2 bg-white text-slate-500 border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all';
        });
    }
    if (dashBody) renderDashboardResults(dashBody);
};

function renderSidebar() {
    const nav = document.getElementById('sidebar-nav'); nav.innerHTML = '';
    const menu = [
        { id: 'dashboard', label: 'Team Analytics', icon: 'pie-chart', roles: ['l1', 'l2', 'admin'] },
        { id: 'kra', label: 'KRA Appraisal', icon: 'target', roles: ['employee', 'l1', 'l2', 'admin'] },
        { id: 'ksa', label: 'KSA Competency', icon: 'brain', roles: ['employee', 'l1', 'l2', 'admin'] },
        { id: 'admin', label: 'User Management', icon: 'settings', roles: ['admin'] }
    ];
    menu.forEach(m => {
        if (!m.roles.includes(store.currentUser.role)) return;
        const b = document.createElement('button');
        b.className = `nav-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${currentView === m.id ? 'bg-indigo-600 font-bold' : 'hover:bg-slate-800'}`;
        b.innerHTML = `<i data-lucide="${m.icon}" class="w-5 h-5"></i><span>${m.label}</span>`;
        b.onclick = () => navigate(m.id);
        nav.appendChild(b);
    });
    lucide.createIcons();
}

function render() {
    const body = document.getElementById('content-body');
    if (!store || !store.employees || !store.currentUser) return; 
    
    // Auto-view logic
    if (store.currentUser.role === 'employee' && currentView === 'dashboard') currentView = 'kra';

    const visibleIds = new Set(getVisibleEmployees().map(e => e.id));
    if (!visibleIds.has(store.selectedEmployeeId)) {
        store.selectedEmployeeId = getVisibleEmployees()[0]?.id || store.currentUser.id;
    }

    let emp = store.employees[store.selectedEmployeeId] || store.employees[store.currentUser.id];
    if (!emp) {
        // Find first available resource as fallback
        const fallbackId = Object.keys(store.employees).find(k => k !== 'admin');
        if (fallbackId) {
            store.selectedEmployeeId = fallbackId;
            emp = store.employees[fallbackId];
        }
    }
    if (!body || !emp) return;
    
    body.innerHTML = '';
    const status = getStatus(emp);
    const badge = document.getElementById('badge-status');
    if (badge) badge.innerText = status;
    
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.innerText = store.currentUser.name;

    const avatarEl = document.getElementById('user-avatar-initials');
    if (avatarEl) {
        const initials = store.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        avatarEl.innerText = initials;
    }

    if (currentView === 'dashboard') renderDashboard(body);
    else if (currentView === 'kra') renderKra(body, emp);
    else if (currentView === 'ksa') renderKsa(body, emp);
    else if (currentView === 'admin') renderAdmin(body);
    
    updateProgress(emp);
    lucide.createIcons();
}

window.exportToCsv = (fullDump = false) => {
    let rows = [];
    if (fullDump) {
        // Collect headers from templates
        const kraHeaders = KRA_TEMPLATE.map(k => [`${k.title} (Rating)`, `${k.title} (Comment)`]).flat();
        const ksaHeaders = Object.keys(KSA_TEMPLATE).map(k => [`${KSA_TEMPLATE[k].label} (Rating)`, `${KSA_TEMPLATE[k].label} (Comment)`]).flat();
        
        rows.push(['Employee ID', 'Name', 'Role', 'Status', 'L1 Reviewer', 'L2 Reviewer', 'Final Score', ...kraHeaders, ...ksaHeaders]);

        Object.entries(store.employees).forEach(([id, u]) => {
            if (u.role === 'admin') return;
            const scores = calculateScores(u);
            const row = [id, u.name, u.role, getStatus(u), u.l1_reviewer || 'N/A', u.l2_reviewer || 'N/A', scores.final];
            
            // Add KRA ratings and justifications
            (u.kras || []).forEach(k => {
                row.push(k.self.rating || 0);
                row.push(`"${(k.self.justification || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`);
            });
            
            // Add KSA ratings and justifications
            Object.keys(u.ksa || {}).forEach(k => {
                row.push(u.ksa[k].self.rating || 0);
                row.push(`"${(u.ksa[k].self.justification || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`);
            });
            
            rows.push(row);
        });
    } else {
        rows = [['Employee ID', 'Name', 'Role', 'Status', 'KRA Score', 'KSA Score', 'Final Rating']];
        Object.entries(store.employees).forEach(([id, u]) => {
            if (u.role === 'admin') return;
            const scores = calculateScores(u);
            rows.push([id, u.name, u.role, getStatus(u), scores.kra, scores.ksa, scores.final]);
        });
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fullDump ? `Smartavya_Evaluation_Dump_2026.csv` : `Smartavya_Performance_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.exportIndividualCsv = (empId) => {
    if (!empId || !store.employees[empId]) return showNote('Invalid employee ID for export.');
    const u = store.employees[empId];
    const scores = calculateScores(u);
    
    let rows = [];
    rows.push(['Employee Name', u.name]);
    rows.push(['Employee ID', u.id]);
    rows.push(['Role', u.designation]);
    rows.push(['Status', getStatus(u)]);
    rows.push(['Final KRA Score', scores.kra]);
    rows.push(['Final KSA Score', scores.ksa]);
    rows.push(['Overall Rating', scores.final]);
    rows.push([]);
    
    // KRA Section
    rows.push(['Key Result Areas (KRAs)']);
    rows.push(['Title', 'Weightage', 'Self Rating', 'Self Justification', 'L1 Rating', 'L1 Comments', 'L2 Rating']);
    (u.kras || []).forEach(k => {
        rows.push([
            k.title,
            `${k.weightage}%`,
            k.self.rating || 0,
            `"${(k.self.justification || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
            k.l1.rating || 0,
            `"${(k.l1.comments || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
            k.l2.rating || 0
        ]);
    });
    rows.push([]);
    
    // KSA Section
    rows.push(['Knowledge, Skills & Abilities (KSAs)']);
    rows.push(['Category', 'Self Rating', 'Self Justification', 'L1 Rating', 'L1 Comments', 'L2 Rating']);
    Object.keys(u.ksa || {}).forEach(key => {
        const k = u.ksa[key];
        rows.push([
            k.label,
            k.self.rating || 0,
            `"${(k.self.justification || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
            k.l1.rating || 0,
            `"${(k.l1.comments || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
            k.l2.rating || 0
        ]);
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${u.name.replace(/\s+/g, '_')}_Performance_Review_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNote('Individual CSV Exported successfully!');
};

window.resetEvaluation = (id) => {
    if (confirm(`Are you sure you want to completely erase the evaluation data for ${store.employees[id].name}?`)) {
        const u = store.employees[id];
        u.kras = JSON.parse(JSON.stringify(KRA_TEMPLATE));
        u.ksa = JSON.parse(JSON.stringify(KSA_TEMPLATE));
        u.coe = JSON.parse(JSON.stringify(COE_TEMPLATE));
        u.certifications = JSON.parse(JSON.stringify(CERT_TEMPLATE));
        u.statusOverride = '';
        u.l1_reviewer = '';
        u.l2_reviewer = '';
        save(true); render();
        showNote(`Evaluation reset for ${u.name}`);
    }
};

window.deleteUser = (id) => {
    if (confirm(`Delete user ${id}?`)) {
        delete store.employees[id];
        save(true); render();
    }
};

window.addUser = (id, name, role, pass) => {
    if (!id || !name) return alert('Fill all fields');
    if (store.employees[id]) return alert('ID already exists');
    
    store.employees[id] = {
        id: id.toLowerCase().replace(/\s+/g, '.'),
        name: name,
        role: role,
        password: pass,
        kras: JSON.parse(JSON.stringify(KRA_TEMPLATE)),
        ksa: JSON.parse(JSON.stringify(KSA_TEMPLATE)),
        coe: JSON.parse(JSON.stringify(COE_TEMPLATE)),
        certifications: JSON.parse(JSON.stringify(CERT_TEMPLATE))
    };
    save(true); render();
    document.getElementById('add-id').value = '';
    document.getElementById('add-name').value = '';
};

function renderAdmin(container) {
    container.innerHTML = `
        <div class="animate-fade-in space-y-6 md:space-y-10">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
                <div>
                    <h1 class="text-2xl md:text-3xl font-black text-slate-800">User Management</h1>
                    <p class="text-slate-500 font-bold text-xs md:text-sm uppercase mt-1">Admin Control Center</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div class="relative w-full sm:min-w-[250px]">
                        <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
                        <input type="text" placeholder="Search resources..." oninput="handleSearch(this.value)" value="${searchQuery}" 
                            class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all">
                    </div>
                    <div class="flex gap-2 w-full sm:w-auto">
                        <button onclick="exportToCsv()" class="flex-1 sm:flex-initial px-4 py-3 bg-slate-100 text-slate-700 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all text-xs md:text-sm whitespace-nowrap">
                            <i data-lucide="download" class="w-4 h-4"></i> Export CSV
                        </button>
                        <button onclick="document.getElementById('add-user-modal').classList.toggle('hidden')" class="flex-1 sm:flex-initial px-4 py-3 bg-smart-orange text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-xs md:text-sm whitespace-nowrap">
                            <i data-lucide="user-plus" class="w-4 h-4"></i> Add Resource
                        </button>
                    </div>
                </div>
            </div>

            <div id="add-user-modal" class="hidden glass-card p-6 md:p-10 space-y-6 border-2 border-orange-100">
                <h3 class="text-lg md:text-xl font-black">Register New Member</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <input id="new-id" type="text" placeholder="Employee ID (emp-151)" class="p-4 border rounded-2xl text-sm">
                    <input id="new-name" type="text" placeholder="Full Name" class="p-4 border rounded-2xl text-sm">
                    <select id="new-role" class="p-4 border rounded-2xl font-bold text-sm">
                        <option value="employee">Employee</option>
                        <option value="l1">L1 Manager</option>
                        <option value="l2">L2 Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                    <input id="new-pass" type="text" placeholder="Temp Password" class="p-4 border rounded-2xl text-sm">
                </div>
                <div class="flex justify-end gap-3 md:gap-4">
                    <button onclick="document.getElementById('add-user-modal').classList.add('hidden')" class="px-5 py-2.5 text-slate-500 font-bold text-sm">Cancel</button>
                    <button onclick="addUser(document.getElementById('new-id').value, document.getElementById('new-name').value, document.getElementById('new-role').value, document.getElementById('new-pass').value)" class="px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-sm">Create User</button>
                </div>
            </div>

            <div class="glass-card overflow-hidden border border-slate-100 shadow-sm">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b">
                        <tr>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase">Resource</th>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase">Role</th>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase">Status</th>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase">Employee ID</th>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase">Temp Password</th>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="admin-table-body" class="divide-y divide-slate-100"></tbody>
                </table>
            </div>
        </div>
    `;
    renderAdminResults(document.getElementById('admin-table-body'));
}

function renderAdminResults(tbody) {
    tbody.innerHTML = Object.entries(store.employees)
        .filter(([id, u]) => (u.name || '').toLowerCase().includes(searchQuery) || id.toLowerCase().includes(searchQuery))
        .map(([id, u]) => `
            <tr class="hover:bg-slate-50/50 transition-colors">
                <td class="p-6" data-label="Resource">
                    <div class="flex items-center justify-end md:justify-start gap-4">
                        <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-600">${u.icon || id[0]}</div>
                        <div class="font-bold text-slate-800">${u.name}</div>
                    </div>
                </td>
                <td class="p-6" data-label="Role">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : (u.role || '').includes('l') ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}">
                        ${u.role || 'Unknown'}
                    </span>
                </td>
                <td class="p-6" data-label="Status">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.isRevoked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                        ${u.isRevoked ? 'Revoked' : 'Active'}
                    </span>
                </td>
                <td class="p-6 font-mono text-sm text-slate-500" data-label="Employee ID">${id}</td>
                <td class="p-6 font-mono text-sm text-orange-600 font-bold" data-label="Temp Password">${u.password || '---'}</td>
                <td class="p-6 text-right flex items-center justify-end gap-2" data-label="Actions">
                    <button onclick="resetEvaluation('${id}')" title="Reset Evaluation" class="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg transition-all">
                        <i data-lucide="rotate-ccw" class="w-5 h-5"></i>
                    </button>
                    <button onclick="toggleAccess('${id}')" title="${u.isRevoked ? 'Grant Access' : 'Revoke Access'}" class="p-2 ${u.isRevoked ? 'text-emerald-500 hover:bg-emerald-50' : 'text-orange-400 hover:bg-orange-50'} rounded-lg transition-all">
                        <i data-lucide="${u.isRevoked ? 'unlock' : 'lock'}" class="w-5 h-5"></i>
                    </button>
                    <button onclick="deleteUser('${id}')" title="Delete User" class="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    lucide.createIcons();
}

window.toggleAccess = (id) => {
    if (id === 'admin') return showNote("Cannot revoke Administrator access.", "error");
    const u = store.employees[id];
    u.isRevoked = !u.isRevoked;
    save();
    const tbody = document.getElementById('admin-table-body');
    if (tbody) renderAdminResults(tbody);
    showNote(`Access ${u.isRevoked ? 'REVOKED' : 'GRANTED'} for ${u.name}`);
};

window.setCoe = (id, field, role, val) => {
    const emp = store.employees[store.selectedEmployeeId];
    if (!canReviewAs(emp, role)) return showNote("You are not mapped to edit this section.");
    const parsedVal = (field === 'rating') ? parseInt(val) : val;
    store.employees[store.selectedEmployeeId].coe.find(x => x.id === id)[role][field] = parsedVal;
    if (field === 'rating') { save(); render(); } else { save(); }
};

window.setCertifications = (id, field, role, val) => {
    const emp = store.employees[store.selectedEmployeeId];
    if (!canReviewAs(emp, role)) return showNote("You are not mapped to edit this section.");
    const parsedVal = (field === 'rating') ? parseInt(val) : val;
    store.employees[store.selectedEmployeeId].certifications.find(x => x.id === id)[role][field] = parsedVal;
    if (field === 'rating') { save(); render(); } else { save(); }
};

function renderDashboard(container) {
    const stats = getTeamStats();
    container.innerHTML = `
        <div class="animate-fade-in space-y-6 md:space-y-10">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 class="text-2xl md:text-3xl font-black text-slate-800">Team Performance Analytics</h1>
                ${store.currentUser.role === 'admin' ? `
                    <button onclick="exportToCsv(true)" class="px-5 py-3 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-slate-900/20 text-xs md:text-sm">
                        <i data-lucide="database" class="w-4 h-4"></i> Export Detailed Dump
                    </button>
                ` : ''}
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div class="glass-card p-5 bg-white border-b-4 border-slate-200">
                    <p class="text-[10px] font-black text-slate-500 uppercase">Total Team</p>
                    <p class="text-2xl md:text-3xl font-black text-slate-800 mt-1">${stats.total}</p>
                </div>
                <div class="glass-card p-5 bg-indigo-50 border-b-4 border-indigo-400">
                    <p class="text-[10px] font-black text-indigo-500 uppercase">Self-Eval Done</p>
                    <p class="text-2xl md:text-3xl font-black text-indigo-700 mt-1">${stats.self + stats.l1 + stats.l2}</p>
                </div>
                <div class="glass-card p-5 bg-emerald-50 border-b-4 border-emerald-400">
                    <p class="text-[10px] font-black text-emerald-500 uppercase">L2 Finalized</p>
                    <p class="text-2xl md:text-3xl font-black text-emerald-700 mt-1">${stats.l2}</p>
                </div>
                <div class="glass-card p-5 flex flex-col items-center justify-center bg-slate-900 border-b-4 border-purple-500 min-h-[88px]">
                    <p class="text-[9px] text-slate-400 uppercase font-bold text-center">Total Completion</p>
                    <p class="text-xl md:text-2xl font-black text-white mt-1 text-center">${stats.total > 0 ? Math.round((stats.l2 / stats.total) * 100) : 0}%</p>
                </div>
            </div>
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-4">
                <div class="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
                    <h3 class="font-black text-lg md:text-xl text-slate-700 whitespace-nowrap">Individual Employee Pipeline</h3>
                    <div class="relative w-full sm:w-[250px]">
                        <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
                        <input type="text" placeholder="Filter by name..." oninput="handleSearch(this.value)" value="${searchQuery}" 
                            class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                    </div>
                    <div id="pipeline-filter-bar" class="flex flex-wrap gap-2">
                        ${[
                            { id: 'all', label: `All ${stats.total}` },
                            { id: 'self', label: `Self ${stats.self}` },
                            { id: 'l1', label: `L1 ${stats.l1}` },
                            { id: 'l2', label: `L2 ${stats.l2}` }
                        ].map(f => `
                            <button type="button" data-filter="${f.id}" onclick="setPipelineFilter('${f.id}')"
                                class="${pipelineFilter === f.id
                                    ? 'px-3 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase shadow-sm transition-all'
                                    : 'px-3 py-2 bg-white text-slate-500 border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all'}">
                                ${f.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    <span class="px-2.5 py-1 bg-slate-100 text-[9px] sm:text-[10px] font-bold rounded-full uppercase">Draft: ${stats.draft}</span>
                    <span class="px-2.5 py-1 bg-indigo-100 text-indigo-600 text-[9px] sm:text-[10px] font-bold rounded-full uppercase">In Review: ${stats.self + stats.l1}</span>
                    <span class="px-2.5 py-1 bg-emerald-100 text-emerald-600 text-[9px] sm:text-[10px] font-bold rounded-full uppercase">Completed: ${stats.l2}</span>
                </div>
            </div>
            <div id="dashboard-list-body" class="grid grid-cols-1 gap-4"></div>
        </div>`;
    renderDashboardResults(document.getElementById('dashboard-list-body'));
}

function renderDashboardResults(container) {
    const filteredEmployees = getVisibleEmployees()
        .filter(e => (e.name || '').toLowerCase().includes(searchQuery) || (e.id || '').toLowerCase().includes(searchQuery))
        .filter(e => {
            const status = getStatus(e);
            if (pipelineFilter === 'self') return status === 'Self Done' || status === 'Self-Completed';
            if (pipelineFilter === 'l1') return status === 'L1 Completed' || status === 'L1-Approved';
            if (pipelineFilter === 'l2') return status === 'L2 Completed' || status === 'L2-Finalized';
            return true;
        });

    if (!filteredEmployees.length) {
        container.innerHTML = `
            <div class="p-8 bg-white border border-dashed border-slate-200 rounded-2xl text-center">
                <p class="text-sm font-bold text-slate-500">No resources found for this filter.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredEmployees
        .map(e => {
            const s = calculateScores(e);
            const canViewScores = ['l2', 'admin'].includes(store.currentUser.role);
            const status = getStatus(e);
            return `
                <div class="employee-review-card glass-card p-0 overflow-hidden hover:scale-[1.01] transition-all border border-slate-100 shadow-sm animate-fade-in">
                    <div class="employee-review-card-main p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white font-black flex-shrink-0">${e.icon}</div>
                            <div class="min-w-0">
                                <p class="font-black text-slate-800 truncate">${e.name}</p>
                                <p class="text-[10px] text-slate-400 uppercase font-black tracking-tighter truncate">${e.designation}</p>
                                <p class="text-[9px] text-slate-400 uppercase font-bold truncate mt-1">L1: ${e.l1ManagerName || 'NA'} | L2: ${e.l2ManagerName || 'NA'}</p>
                            </div>
                        </div>
                        <div class="employee-review-actions flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-4 sm:space-x-6">
                            ${canViewScores ? `
                                <div class="employee-score-strip flex space-x-4 px-4 sm:border-l border-slate-200">
                                    <div class="text-center font-bold"><p class="text-[8px] text-slate-400 uppercase">KRA</p><p class="text-sm">${s.kra}</p></div>
                                    <div class="text-center font-bold"><p class="text-[8px] text-slate-400 uppercase">KSA</p><p class="text-sm">${s.ksa}</p></div>
                                    <div class="text-center h-full px-3 py-1 bg-slate-900 rounded-lg text-white font-black"><p class="text-[7px] text-slate-500 uppercase">FINAL</p><p class="text-sm">${s.final}</p></div>
                                </div>
                            ` : ''}
                            <button onclick="store.selectedEmployeeId='${e.id}'; navigate('kra')" class="w-full sm:w-auto px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-slate-800 text-center transition-all">VIEW REVIEW</button>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 text-[9px] sm:text-[10px] font-black text-center border-t">
                        <div class="py-2 ${status !== 'Draft' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'}">PHASE 1: SELF</div>
                        <div class="py-2 ${status.includes('L1') || status.includes('L2') ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'} border-l border-white/20">PHASE 2: L1</div>
                        <div class="py-2 ${status.includes('L2') ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'} border-l border-white/20">PHASE 3: L2</div>
                    </div>
                </div>
            `;
        }).join('');
    lucide.createIcons();
}

function renderKra(container, emp) {
    const status = getStatus(emp);
    const canEditSelf = canReviewAs(emp, 'self');
    const canEditL1 = canReviewAs(emp, 'l1') && status !== 'Draft';
    const canEditL2 = canReviewAs(emp, 'l2') && (status.includes('L1') || status.includes('L2'));

    const KRA_DESC = {
        'kra-1':  'Writing clean, modular, reusable, and well-documented code; adherence to coding standards; maintaining low defect rates; ensuring peer-review readiness.',
        'kra-2':  'Effective participation in ALM process, accurate estimation, commitment adherence, and predictable delivery velocity.',
        'kra-3':  'Ownership of assigned tasks, on-time delivery, and maintaining a high success rate across development, testing, and deployment activities.',
        'kra-4':  'Ensuring stable ETL pipelines or data processes, proactive monitoring, quick resolution of failures, and minimizing production incidents.',
        'kra-5':  'Applying strong data engineering fundamentals, contributing to data-warehouse architecture decisions, optimizing performance, and improving system scalability.',
        'kra-6':  'Clear communication with stakeholders (Business User, ADM partners and leads, Operations, Infra), timely updates, and effective collaboration within the team.',
        'kra-7':  'Ability to prioritize tasks based on impact, manage workload efficiently, and optimize use of available tools and resources.',
        'kra-8':  'Raising blockers early, managing dependencies, preventing delays, and ensuring smooth project flow through timely escalation.',
        'kra-9':  'Adopting new tools/technologies, improving processes, staying updated with modern data engineering practices, and applying learnings to real work.',
        'kra-10': 'Supporting peers, mentoring juniors, conducting knowledge-sharing sessions, and contributing to team growth and culture.'
    };
    const COE_DESC = {
        'coe-1': 'Tech talks, internal workshops, or documentation you led or contributed to.',
        'coe-2': 'Reusable components, scripts, templates, or tools built to improve team productivity.',
        'coe-3': 'Initiatives that improved team workflows, reduced manual effort, or increased delivery quality.'
    };
    const CERT_DESC = {
        'cert-1': 'Cloud, DevOps, programming, or platform certifications relevant to your role.',
        'cert-2': 'Management, agile, domain-specific, or soft-skill certifications completed this cycle.'
    };

    container.innerHTML = `
        <div class="animate-fade-in space-y-6 md:space-y-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-xl md:text-2xl font-black text-slate-800">KRA Appraisal: ${emp.name}</h1>
                    <p class="text-[10px] text-slate-400 font-bold mt-1 uppercase">L1: ${emp.l1ManagerName || 'NA'} | L2: ${emp.l2ManagerName || 'NA'}</p>
                    ${emp.l1_reviewer ? `<p class="text-[10px] text-indigo-600 font-bold mt-1 uppercase">L1 Review by: ${emp.l1_reviewer}</p>` : ''}
                    ${emp.l2_reviewer ? `<p class="text-[10px] text-emerald-600 font-bold mt-1 uppercase">L2 Finalized by: ${emp.l2_reviewer}</p>` : ''}
                </div>
            </div>
            ${(emp.kras || []).map((k, index) => `
                <div class="glass-card p-6 md:p-10 relative overflow-hidden">
                    <div class="absolute -top-4 -right-4 w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl font-black text-slate-200 pointer-events-none">
                        ${String(index + 1).padStart(2, '0')}
                    </div>
                    <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 relative z-10">
                        <div>
                            <h3 class="text-base md:text-lg font-black text-slate-800">${k.title}</h3>
                            <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Key Result Area</p>
                            <p class="text-xs text-slate-400 font-medium mt-2 max-w-lg">${KRA_DESC[k.id] || ''}</p>
                        </div>
                        <div class="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl font-black text-xs">
                            ${k.weightage}% Weight
                        </div>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
                    <div class="space-y-4">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Self Evaluation</label>
                        <select ${!canEditSelf ? 'disabled' : ''} onchange="setKra('${k.id}', 'rating', 'self', this.value)" class="w-full p-4 border rounded-2xl font-black text-indigo-700 text-sm">
                            ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${k.self.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                        </select>
                        <textarea ${!canEditSelf ? 'disabled' : ''} onblur="setKra('${k.id}', 'justification', 'self', this.value)" class="w-full p-4 border rounded-2xl text-sm h-32 bg-slate-50/10">${k.self.justification}</textarea>
                    </div>
                    <div class="space-y-4 ${!canEditL1 ? 'opacity-40 pointer-events-none' : ''}">
                        <label class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">L1 Manager</label>
                        <select ${!canEditL1 ? 'disabled' : ''} onchange="setKra('${k.id}', 'rating', 'l1', this.value)" class="w-full p-4 border border-indigo-100 rounded-2xl font-black bg-indigo-50/10 text-sm">
                            ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${k.l1.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                        </select>
                        <textarea ${!canEditL1 ? 'disabled' : ''} onblur="setKra('${k.id}', 'comments', 'l1', this.value)" class="w-full p-4 border border-indigo-50 rounded-2xl text-sm h-32 bg-indigo-50/10">${k.l1.comments}</textarea>
                    </div>
                    <div class="space-y-4 ${!canEditL2 ? 'opacity-40 pointer-events-none' : ''}">
                        <label class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">L2 Final</label>
                        <select ${!canEditL2 ? 'disabled' : ''} onchange="setKra('${k.id}', 'rating', 'l2', this.value)" class="w-full p-4 border border-emerald-100 rounded-2xl font-black bg-emerald-50/10 text-emerald-700 text-sm">
                            ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${k.l2.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                        </select>
                        <div class="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-[10px] text-emerald-700/60 font-bold italic">L2 provides ultimate sign-off. Score is final.</div>
                    </div>
                </div>
                </div>
            `).join('')}

            <h2 class="text-base md:text-lg font-black text-slate-800 flex items-center gap-3 mt-10 md:mt-16 mb-4">
                <i data-lucide="award" class="text-indigo-600"></i> CoE Contributions
            </h2>
            <div class="space-y-6">
            ${(emp.coe || []).map((c, idx) => `
                <div class="glass-card p-6 md:p-10 relative overflow-hidden">
                    <div class="absolute -top-4 -right-4 w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-xl font-black text-slate-200 pointer-events-none">
                        ${String(idx + 1).padStart(2, '0')}
                    </div>
                    <div class="mb-6 pb-4 border-b border-slate-100 relative z-10">
                        <h3 class="text-base md:text-lg font-black text-slate-800">${c.title}</h3>
                        <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Center of Excellence</p>
                        <p class="text-xs text-slate-400 font-medium mt-2">${COE_DESC[c.id] || ''}</p>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 relative z-10">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Self Declaration</label>
                            <input type="text" placeholder="What did you contribute?" ${!canEditSelf ? 'disabled' : ''} onblur="setCoe('${c.id}', 'description', 'self', this.value)" value="${c.self.description}" class="w-full p-4 border rounded-2xl text-sm bg-slate-50/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                            <input type="url" placeholder="Evidence Link (e.g. Confluence/Jira)" ${!canEditSelf ? 'disabled' : ''} onblur="setCoe('${c.id}', 'link', 'self', this.value)" value="${c.self.link}" class="w-full p-4 border rounded-2xl text-sm bg-slate-50/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        </div>
                        <div class="space-y-4 ${!canEditL1 ? 'opacity-40 pointer-events-none' : ''}">
                            <label class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Manager Assessment</label>
                            <select ${!canEditL1 ? 'disabled' : ''} onchange="setCoe('${c.id}', 'rating', 'l1', this.value)" class="w-full p-4 border border-indigo-100 rounded-2xl font-black bg-indigo-50/10 text-indigo-700 text-sm">
                                ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${c.l1.rating == v ? 'selected' : ''}>${v || 'Rate Contribution'}</option>`).join('')}
                            </select>
                            <textarea ${!canEditL1 ? 'disabled' : ''} onblur="setCoe('${c.id}', 'comments', 'l1', this.value)" placeholder="Manager comments..." class="w-full p-4 border border-indigo-50 rounded-2xl text-sm h-24 bg-indigo-50/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">${c.l1.comments}</textarea>
                        </div>
                    </div>
                </div>
            `).join('')}
            </div>

            <div class="h-px bg-slate-200 my-10 md:my-16"></div>
            <h2 class="text-lg md:text-xl font-black text-slate-800 flex items-center gap-3 mb-6">
                <i data-lucide="shield-check" class="text-emerald-600"></i> Certifications
            </h2>
            <div class="space-y-8">
            ${(emp.certifications || []).map((c, idx) => `
                <div class="glass-card p-6 md:p-12 relative overflow-hidden">
                    <div class="absolute -top-4 -right-4 w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-2xl font-black text-slate-200 pointer-events-none">
                        ${String(idx + 1).padStart(2, '0')}
                    </div>
                    <div class="mb-8 pb-4 border-b border-slate-100 relative z-10">
                        <h3 class="text-base md:text-lg font-black text-slate-800">${c.title}</h3>
                        <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Professional Recognition</p>
                        <p class="text-xs text-slate-400 font-medium mt-2">${CERT_DESC[c.id] || ''}</p>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 relative z-10">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certification Details</label>
                            <input type="text" placeholder="Exact Name of Certificate" ${!canEditSelf ? 'disabled' : ''} onblur="setCertifications('${c.id}', 'name', 'self', this.value)" value="${c.self.name}" class="w-full p-4 border rounded-2xl text-sm bg-slate-50/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                            <div class="grid grid-cols-2 gap-4">
                                <input type="date" ${!canEditSelf ? 'disabled' : ''} onblur="setCertifications('${c.id}', 'date', 'self', this.value)" value="${c.self.date}" class="w-full p-4 border rounded-2xl text-sm bg-slate-50/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                <input type="url" placeholder="Verification URL" ${!canEditSelf ? 'disabled' : ''} onblur="setCertifications('${c.id}', 'link', 'self', this.value)" value="${c.self.link}" class="w-full p-4 border rounded-2xl text-sm bg-slate-50/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                            </div>
                        </div>
                        <div class="space-y-4 ${!canEditL1 ? 'opacity-40 pointer-events-none' : ''}">
                            <label class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verification & Approval</label>
                            <div class="flex gap-4">
                                <select ${!canEditL1 ? 'disabled' : ''} onchange="setCertifications('${c.id}', 'rating', 'l1', this.value)" class="flex-1 p-4 border border-emerald-100 rounded-2xl font-black bg-emerald-50/10 text-emerald-700 text-sm">
                                    <option value="0" ${c.l1.rating == 0 ? 'selected' : ''}>Pending Verification</option>
                                    <option value="5" ${c.l1.rating == 5 ? 'selected' : ''}>Verified & Approved</option>
                                    <option value="1" ${c.l1.rating == 1 ? 'selected' : ''}>Rejected / Incomplete</option>
                                </select>
                                ${c.self.link ? `<a href="${c.self.link}" target="_blank" class="p-4 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-indigo-100"><i data-lucide="external-link" class="w-5 h-5"></i></a>` : ''}
                            </div>
                            <div class="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-[10px] text-emerald-700/60 font-bold italic">Managers must verify certificate authenticity via provided URL.</div>
                        </div>
                    </div>
                </div>
            `).join('')}
            </div>
        </div>`;
}

function renderKsa(container, emp) {
    const status = getStatus(emp);
    const canEditSelf = canReviewAs(emp, 'self');
    const canEditL1 = canReviewAs(emp, 'l1') && status !== 'Draft';
    const canEditL2 = canReviewAs(emp, 'l2') && (status.includes('L1') || status.includes('L2'));

    const KSA_DESC = {
        dataEngPlatforms:   'Strong hands-on skills in the primary data platform (CDP - HDFS, Hive, Impala, Spark, Yarn, Kerberos) including storage, compute, cluster navigation, performance tuning and troubleshooting.',
        toolsExpertise:     'Hands-on expertise in Informatica for ETL development and strong understanding of downstream BI/reporting tools like SAP BO and Tableau.',
        codingProficiency:  'Strong command over SQL, Python, Java; ability to write optimized, scalable, and maintainable code for data pipelines and transformations.',
        communication:      'Clear and structured communication — written and verbal — especially when explaining technical concepts, documenting work, or interacting with stakeholders.',
        timeManagement:     'Ability to manage workload effectively, maintain compliance with processes, follow standards, and demonstrate reliability in day-to-day execution.',
        learningAgility:    'Ability to quickly learn new tools, adapt to evolving technologies, and proactively pursue certifications or training relevant to data engineering.',
        analyticalThinking: 'Ability to diagnose complex data issues, debug pipeline failures, analyze root causes, and design efficient solutions.',
        certifications:     'Relevant certifications in cloud platforms, data engineering, or ETL tools that enhance technical credibility and domain expertise.'
    };

    container.innerHTML = `
        <div class="animate-fade-in space-y-6 md:space-y-8">
            <h1 class="text-xl md:text-2xl font-black text-slate-800">KSA Assessment: ${emp.name}</h1>
            ${Object.entries(emp.ksa || {}).map(([key, data], idx) => `
                <div class="glass-card p-6 md:p-10 relative overflow-hidden">
                    <div class="absolute -top-4 -right-4 w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl font-black text-slate-200 pointer-events-none">
                        ${String(idx + 1).padStart(2, '0')}
                    </div>
                    <div class="mb-6 pb-4 border-b border-slate-100 relative z-10 flex items-start justify-between">
                        <div>
                            <h3 class="text-base md:text-lg font-black text-slate-800">${data.label}</h3>
                            <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Core Competency</p>
                            <p class="text-xs text-slate-400 font-medium mt-2 max-w-lg">${KSA_DESC[key] || ''}</p>
                        </div>
                        <div class="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl font-black text-xs whitespace-nowrap ml-4">${data.weightage || 0}% Weight</div>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Self Evaluation</label>
                            <select ${!canEditSelf ? 'disabled' : ''} onchange="setKsa('${key}', 'rating', 'self', this.value)" class="w-full p-4 border rounded-2xl font-black text-indigo-700 text-sm">
                                ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${data.self.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                            </select>
                            <textarea ${!canEditSelf ? 'disabled' : ''} onblur="setKsa('${key}', 'justification', 'self', this.value)" class="w-full p-4 border rounded-2xl text-sm h-32 bg-slate-50/10">${data.self.justification}</textarea>
                        </div>
                        <div class="space-y-4 ${!canEditL1 ? 'opacity-40 pointer-events-none' : ''}">
                            <label class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">L1 Feedback</label>
                            <select ${!canEditL1 ? 'disabled' : ''} onchange="setKsa('${key}', 'rating', 'l1', this.value)" class="w-full p-4 border border-indigo-100 rounded-2xl font-black bg-indigo-50/10 text-sm">
                                ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${data.l1.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                            </select>
                            <textarea ${!canEditL1 ? 'disabled' : ''} onblur="setKsa('${key}', 'comments', 'l1', this.value)" class="w-full p-4 border border-indigo-100 rounded-2xl text-sm h-32 bg-indigo-50/10">${data.l1.comments}</textarea>
                        </div>
                        <div class="space-y-4 ${!canEditL2 ? 'opacity-40 pointer-events-none' : ''}">
                            <label class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">L2 Final</label>
                            <select ${!canEditL2 ? 'disabled' : ''} onchange="setKsa('${key}', 'rating', 'l2', this.value)" class="w-full p-4 border border-emerald-100 rounded-2xl font-black bg-emerald-50/10 text-emerald-700 text-sm">
                                ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${data.l2.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                            </select>
                            <div class="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-[10px] text-emerald-700/60 font-bold italic">L2 finalizes competence score.</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromCloud(); // INITIAL SYNC

    document.getElementById('login-overlay').innerHTML = `
        <div class="absolute inset-0 bg-slate-900">
            <div class="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/40 via-transparent to-emerald-900/20"></div>
        </div>
        
        <div class="relative w-full max-w-md md:max-w-[1000px] m-4 flex bg-slate-900/80 backdrop-blur-3xl rounded-3xl md:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <!-- Left Panel: Branding -->
            <div class="hidden md:flex md:w-5/12 bg-orange-600 p-16 flex-col justify-between relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-800 opacity-90"></div>
                <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                
                <div class="relative z-10">
                    <img src="data:image/png;base64,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" alt="Smartavya Analytica" class="h-12 object-contain mb-8 drop-shadow-xl">
                    <div class="h-1 w-12 bg-white/40 my-6 rounded-full"></div>
                    <p class="text-orange-50 text-base font-medium opacity-80 italic">Smart People. Smarter Solutions.</p>
                </div>

                <div class="relative z-10 space-y-6">
                    <div class="flex items-center space-x-4 text-white/60">
                        <div class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold text-white">2026</div>
                        <p class="text-sm font-bold tracking-tight uppercase text-white">Annual Evaluation</p>
                    </div>
                    <p class="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">Enterprise Performance Portal</p>
                </div>
            </div>

            <!-- Right Panel: Login Form -->
            <div class="flex-1 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white/5 relative">
                <div class="mb-10 text-center md:text-left">
                    <h2 class="text-3xl font-black text-white mb-2 text-center md:text-left">Secure Login</h2>
                    <p class="text-slate-500 font-bold text-sm uppercase tracking-widest text-center md:text-left">Enter your credentials to access the portal</p>
                </div>

                <!-- Unified Login Form -->
                <form id="login-form" onsubmit="event.preventDefault(); login('unified', document.getElementById('login-user').value, document.getElementById('login-pass').value);" class="space-y-6">
                    <div class="space-y-4">
                        <div class="relative group">
                            <i data-lucide="user" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-orange-400 transition-colors"></i>
                            <input type="text" id="login-user" placeholder="Username or ID" 
                                class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white font-bold outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-600 text-sm">
                        </div>
                        <div class="relative group">
                            <i data-lucide="lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-orange-400 transition-colors"></i>
                            <input type="password" id="login-pass" placeholder="Password" 
                                class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white font-bold outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-600 text-sm">
                        </div>
                    </div>
                    
                    <button type="submit" 
                        class="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 transition-all transform hover:scale-[1.02] active:scale-95 text-sm">
                        LOGIN TO PORTAL
                    </button>
                </form>
                    
                <div id="emp-preview" class="p-4 bg-white/5 border border-white/10 rounded-2xl hidden items-center space-x-4 animate-fade-in mt-6">
                    <div id="emp-preview-icon" class="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-xs"></div>
                    <div>
                        <p id="emp-preview-name" class="text-white font-black text-sm"></p>
                        <p id="emp-preview-role" class="text-slate-500 text-[10px] uppercase font-bold tracking-tighter"></p>
                    </div>
                </div>

                <p class="mt-8 text-center text-slate-600 text-[10px] font-bold tracking-[0.2em] uppercase">Authorized Access Only</p>
            </div>
        </div>`;

    // Add Tab Switch Logic
    window.switchLoginTab = (type) => {
        const empTab = document.getElementById('tab-emp');
        const mgrTab = document.getElementById('tab-mgr');
        const empForm = document.getElementById('form-employee');
        const mgrForm = document.getElementById('form-manager');

        if (type === 'employee') {
            empTab.className = "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all bg-[#0072bc] text-white shadow-lg";
            mgrTab.className = "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all text-slate-400 hover:text-white";
            empForm.classList.remove('hidden');
            mgrForm.classList.add('hidden');
        } else {
            mgrTab.className = "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all bg-[#f58220] text-white shadow-lg";
            empTab.className = "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all text-slate-400 hover:text-white";
            mgrForm.classList.remove('hidden');
            empForm.classList.add('hidden');
        }
        lucide.createIcons();
    };

    // Add Employee Lookup Logic
    document.getElementById('login-user').addEventListener('input', (e) => {
        const val = e.target.value.trim();
        const preview = document.getElementById('emp-preview');
        const emp = store.employees[val];

        if (emp && emp.role === 'employee') {
            document.getElementById('emp-preview-icon').innerText = emp.icon;
            document.getElementById('emp-preview-name').innerText = emp.name;
            document.getElementById('emp-preview-role').innerText = emp.designation;
            preview.classList.remove('hidden');
            preview.classList.add('flex');
        } else {
            preview.classList.add('hidden');
            preview.classList.remove('flex');
        }
    });

    lucide.createIcons();
});
