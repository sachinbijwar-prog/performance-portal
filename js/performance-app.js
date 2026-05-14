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
    { id: 'kra-1', title: 'Technical Excellence & Architecture', weightage: 40, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-2', title: 'Team Mentorship & Growth', weightage: 30, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    { id: 'kra-3', title: 'Agile Delivery', weightage: 30, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } }
];

const KSA_TEMPLATE = {
    technical: { label: 'Technical Skills', self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    problemSolving: { label: 'Problem Solving', self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    communication: { label: 'Communication', self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    collaboration: { label: 'Collaboration', self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
    ownership: { label: 'Ownership', self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } }
};

const COE_TEMPLATE = [
    { id: 'coe-1', title: 'Knowledge Sharing Session', self: { description: '', link: '' }, l1: { comments: '', rating: 0 } },
    { id: 'coe-2', title: 'Asset / Tool Creation', self: { description: '', link: '' }, l1: { comments: '', rating: 0 } },
    { id: 'coe-3', title: 'Process Improvement', self: { description: '', link: '' }, l1: { comments: '', rating: 0 } }
];

const CERT_TEMPLATE = [
    { id: 'cert-1', title: 'Technical Certification', self: { name: '', date: '', link: '' }, l1: { rating: 0 } },
    { id: 'cert-2', title: 'Leadership / Domain Cert', self: { name: '', date: '', link: '' }, l1: { rating: 0 } }
];

const INITIAL_DATA = {
    employees: {
        'admin': { id: 'admin', icon: 'AD', name: 'System Admin', role: 'admin', password: 'admin', designation: 'Portal Administrator', kras: [], ksa: {}, coe: [], certifications: [] },
        'emp-1': { id: 'emp-1', icon: 'SB', name: 'Sachin Bijwar', role: 'employee', designation: 'Senior Architect', kras: JSON.parse(JSON.stringify(KRA_TEMPLATE)), ksa: JSON.parse(JSON.stringify(KSA_TEMPLATE)), coe: JSON.parse(JSON.stringify(COE_TEMPLATE)), certifications: JSON.parse(JSON.stringify(CERT_TEMPLATE)) },
        'emp-2': { id: 'emp-2', icon: 'AR', name: 'Ananya Rao', role: 'employee', designation: 'UX Lead', kras: JSON.parse(JSON.stringify(KRA_TEMPLATE)), ksa: JSON.parse(JSON.stringify(KSA_TEMPLATE)), coe: JSON.parse(JSON.stringify(COE_TEMPLATE)), certifications: JSON.parse(JSON.stringify(CERT_TEMPLATE)) },
        'emp-3': { id: 'emp-3', icon: 'RM', name: 'Rohan Mehta', role: 'employee', designation: 'Data Scientist', kras: JSON.parse(JSON.stringify(KRA_TEMPLATE)), ksa: JSON.parse(JSON.stringify(KSA_TEMPLATE)), coe: JSON.parse(JSON.stringify(COE_TEMPLATE)), certifications: JSON.parse(JSON.stringify(CERT_TEMPLATE)) },
        'emp-4': { id: 'emp-4', icon: 'ZK', name: 'Zoya Khan', role: 'employee', designation: 'Ops Manager', kras: JSON.parse(JSON.stringify(KRA_TEMPLATE)), ksa: JSON.parse(JSON.stringify(KSA_TEMPLATE)), coe: JSON.parse(JSON.stringify(COE_TEMPLATE)), certifications: JSON.parse(JSON.stringify(CERT_TEMPLATE)) }
    },
    currentUser: null,
    selectedEmployeeId: 'emp-1'
};

// --- GLOBAL STORE ---
let store = INITIAL_DATA; // Start with local default

// --- FIREBASE SYNC FUNCTIONS ---

// Update Cloud when data changes
async function save() {
    // 1. Keep LocalStorage as "Emergency Backup"
    localStorage.setItem('nexgen_v5_local', JSON.stringify(store));

    // 2. Push to Firestore
    try {
        await db.collection("appraisals").doc("company_wide").set(store);
        console.log("Cloud Sync: Success");
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
            Object.values(store.employees).forEach(emp => {
                if (!emp.coe) emp.coe = JSON.parse(JSON.stringify(COE_TEMPLATE));
                if (!emp.certifications) emp.certifications = JSON.parse(JSON.stringify(CERT_TEMPLATE));
                if (!emp.role) emp.role = emp.id.includes('emp') ? 'employee' : 'l1';
            });
            
            // BULK ADD ATTACHED USERS IF MISSING
            const bulkUsers = [
                "Pramod Kejriwal", "Sachin Bijwar", "Mitali Pranav Gupta", "Amit Morajkar", 
                "Prasad Revannath Choudhari", "Rohan Mohan Jagtap", "Ajinkya Borge", "Punit Ramanlal Shah",
                "Arjun Dhrupdev Tiwari", "Akash Ravindra Salunke", "Pranay Prakash Datale", "Pranav Novale",
                "Swapnil Omprakash Karwa", "Harish Chellikonda", "Khushal Shevalekar", "Amol Ghuge",
                "Abhiney Rindhe", "Abhishek Rastogi", "Pooja Shivran", "Nikhil Patil", "Yasir Pathan",
                "V Mohammed Thohidh", "Amit Kulkarni", "Mayur Sindhani", "Simon Pinto", "Nishant Chavan",
                "Tushar Amrut Shirsath", "Suraj Narendra Shinde", "Dinesh Chanda", "Tejal Bhayani",
                "Tamizhselvan K", "Vishal Singh", "Manishkumar Hirilal Prajapati", "Waman Balajirao Birajdar",
                "Sudarshan Jadhav", "Rajan Kotru", "Chandrakiran mewad", "Lokashwari D", "Nuthi venkata Sai Nath",
                "Thumu Hemanthra Reddy", "Ravi Shekhar", "Sufyan Muhammad Zubair Abubakar", "Shivam Kumar Pandey",
                "Sanket Ramesh Jain", "Vaibhav Ravindra Patil", "Prasad Balasaheb Lamite", "Kondeti Inyal Victor",
                "Ravi Kumar Raju", "Adnan Qurashi", "Sarika Yadav", "Srikanth R", "Goli Kishorebabu",
                "Rahul Omprakash Yadav", "Ganesh Shivaji Shinde", "Akshay Karunakar Shetty", "Sakshi Ashok Jadhav",
                "Vishal Vijay Deshmukh", "Ajinkya Pravin Toke", "Vivek Shrikrushna Vinchurkar", "Nitin Shrivastava",
                "Yashwant Ganeshrao Khotane", "Sandip Chandrakant Chaudhari", "Chennakes Jayshyam",
                "Mayur Krishna Bhedige", "Kaustubh Pramod Atkari", "Kurakantla Manoj Kumar Reddy",
                "Mohammed Wahab", "Martin Ahmed Fayaz Nizam", "Uday Kumar Kurada", "Dipan Sureshcandra Desai",
                "Yash Kamlesh Pandya", "Makarand Manohar Satam", "Pramod Kumar Dubey", "Mayank Tyagi",
                "Mohit Ahuja", "Mrudula Maniksingh Pardeshi", "Prasad Milind Joshi", "Sanket Ganesh Bhoir",
                "Avinash Raosaheb chougule", "Ajit Ashok Ingale", "Vishal Anant Kadam", "Jennifer Rakesh Misra",
                "Sheshadrivendra", "Yashashri Yogesh Nimje", "Mihir Nitin Ambekar", "Girish Devidas Pandit",
                "Vicky Soni", "Sudhanshu Patil", "Piyush Shajwal", "Mukul Vinayak Dhote", "Harshal Chitto",
                "Prajjwal Jain", "Shubham Rajiv Lokhande", "Dnyanesh Vasudev Patharwat", "Aniket Bhaiuu More",
                "Omkar Sunil Komatke", "Abhishek Kumar Sinha", "Pravin Kashavrao", "Aryan Rajput",
                "Sahil Talathi", "Prajakta Sudhir Honawale", "Jay Jitendra Bhagat", "Sayed Abdul Shami",
                "Chaitrali Sharad Nakhate", "Shirish Jain", "Rohit Kumar", "Nitin Karoche"
            ];

            let added = false;
            bulkUsers.forEach((name, i) => {
                const id = `emp-${1000 + i}`;
                if (!store.employees[id]) {
                    store.employees[id] = {
                        id, name, icon: name.split(' ').map(n => n[0]).join(''), role: 'employee', 
                        password: id + '@2026', // UNIQUE DEFAULT PASSWORD
                        designation: 'Resource',
                        kras: JSON.parse(JSON.stringify(KRA_TEMPLATE)),
                        ksa: JSON.parse(JSON.stringify(KSA_TEMPLATE)),
                        coe: JSON.parse(JSON.stringify(COE_TEMPLATE)),
                        certifications: JSON.parse(JSON.stringify(CERT_TEMPLATE))
                    };
                    added = true;
                }
            });

            if (!store.employees['admin']) {
                store.employees['admin'] = JSON.parse(JSON.stringify(INITIAL_DATA.employees['admin']));
                store.employees['admin'].password = 'admin@2026';
                added = true;
            }

            // FORCE UNIQUE PASSWORDS
            Object.keys(store.employees).forEach(id => {
                if (id !== 'admin' && (store.employees[id].password === 'smart2026' || !store.employees[id].password)) {
                    store.employees[id].password = id + '@2026';
                    added = true;
                }
            });

            if (!store.employees['admin'] || store.employees['admin'].password === 'admin') {
                if (!store.employees['admin']) store.employees['admin'] = JSON.parse(JSON.stringify(INITIAL_DATA.employees['admin']));
                store.employees['admin'].password = 'admin@2026';
                added = true;
            }

            if (added) save();
            
            // SESSION RESTORE
            const sessionData = localStorage.getItem('sa_eval_session');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                store.currentUser = session.user;
                store.selectedEmployeeId = session.selectedId;
                currentView = session.view || (store.currentUser.role === 'employee' ? 'kra' : 'dashboard');
                
                document.getElementById('login-overlay').classList.add('hidden');
                document.getElementById('app-container').classList.remove('opacity-0', 'blur-xl');
                renderSidebar();
                render();
            }
            
            console.log("Cloud Data Loaded & Session Restored");
            if (!store.currentUser) render(); // Only render if not logged in to avoid double render
        } else {
            console.log("No cloud data found. Using local template.");
            save();
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
    const selfDone = emp.kras.every(k => k.self.rating > 0 && k.self.justification.trim().length > 0) &&
        Object.values(emp.ksa).every(k => k.self.rating > 0 && k.self.justification.trim().length > 0);
    const l1Done = emp.kras.every(k => k.l1.rating > 0) && Object.values(emp.ksa).every(k => k.l1.rating > 0);
    const l2Done = emp.kras.every(k => k.l2.rating > 0) && Object.values(emp.ksa).every(k => k.l2.rating > 0);
    if (l2Done) return 'L2 Completed';
    if (l1Done) return 'L1 Completed';
    if (selfDone) return 'Self Completed';
    return 'Draft';
}

function getTeamStats() {
    const stats = { draft: 0, self: 0, l1: 0, l2: 0, total: Object.keys(store.employees).length };
    Object.values(store.employees).forEach(e => {
        const s = getStatus(e);
        if (s === 'L2 Completed') stats.l2++;
        else if (s === 'L1 Completed') stats.l1++;
        else if (s === 'Self Completed') stats.self++;
        else stats.draft++;
    });
    return stats;
}

function calculateScores(emp) {
    let kraSum = 0;
    (emp.kras || []).forEach(k => { const r = (k.l1.rating + k.l2.rating) / 2 || 0; kraSum += r * (k.weightage / 100); });
    let ksaSum = 0;
    Object.values(emp.ksa || {}).forEach(k => { ksaSum += (k.l1.rating + k.l2.rating) / 2 || 0; });
    const avgKsa = ksaSum / 5;
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
    
    if (emp.password && emp.password !== pass) {
        passInp.classList.add('border-rose-500', 'ring-rose-500/50');
        return showNote("Incorrect password.");
    }

    store.currentUser = { role: emp.role, id, name: emp.name };
    store.selectedEmployeeId = (emp.role === 'admin' || emp.role === 'l1' || emp.role === 'l2') ? Object.keys(store.employees).find(k => k !== 'admin') : id;
    
    localStorage.setItem('sa_eval_session', JSON.stringify({
        user: store.currentUser,
        selectedId: store.selectedEmployeeId,
        view: emp.role === 'employee' ? 'kra' : 'dashboard'
    }));

    save();
    document.getElementById('login-overlay').classList.add('hidden');
    document.getElementById('app-container').classList.remove('opacity-0', 'blur-xl');
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

window.showNote = (msg) => {
    const t = document.getElementById('ai-suggestion');
    const tx = document.getElementById('ai-text');
    tx.innerText = msg;
    t.classList.remove('translate-y-32');
    setTimeout(() => t.classList.add('translate-y-32'), 4000);
};

window.setKra = (id, field, role, val) => {
    store.employees[store.selectedEmployeeId].kras.find(x => x.id === id)[role][field] = field === 'rating' ? parseInt(val) : val;
    save(); render();
};

window.setKsa = (key, field, role, val) => {
    store.employees[store.selectedEmployeeId].ksa[key][role][field] = field === 'rating' ? parseInt(val) : val;
    save(); render();
};

let currentView = 'dashboard';
window.navigate = (v) => { 
    currentView = v; 
    const sessionData = localStorage.getItem('sa_eval_session');
    if (sessionData) {
        const session = JSON.parse(sessionData);
        session.view = v;
        localStorage.setItem('sa_eval_session', JSON.stringify(session));
    }
    renderSidebar(); 
    render(); 
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

    const emp = store.employees[store.selectedEmployeeId] || store.employees[store.currentUser.id];
    if (!body || !emp) return;
    
    body.innerHTML = '';
    const status = getStatus(emp);
    const badge = document.getElementById('badge-status');
    if (badge) badge.innerText = status;
    
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.innerText = store.currentUser.name;

    if (currentView === 'dashboard') renderDashboard(body);
    else if (currentView === 'kra') renderKra(body, emp);
    else if (currentView === 'ksa') renderKsa(body, emp);
    else if (currentView === 'admin') renderAdmin(body);
    
    updateProgress(emp);
    lucide.createIcons();
}

window.exportToCsv = () => {
    const rows = [
        ['Employee ID', 'Name', 'Role', 'Status', 'KRA Score', 'KSA Score', 'Final Rating']
    ];

    Object.entries(store.employees).forEach(([id, u]) => {
        if (u.role === 'admin') return;
        const scores = calculateScores(u);
        rows.push([
            id,
            u.name,
            u.role,
            getStatus(u),
            scores.kra,
            scores.ksa,
            scores.final
        ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Smartavya_Performance_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
};

window.deleteUser = (id) => {
    if (confirm(`Delete user ${id}?`)) {
        delete store.employees[id];
        save(); render();
    }
};

window.addUser = (id, name, role, pass) => {
    if (!id || !name) return alert('Fill all fields');
    if (store.employees[id]) return alert('ID already exists');
    
    store.employees[id] = {
        name, role, icon: name.charAt(0), password: pass,
        kras: [
            { id: 'k1', title: 'Technical Excellence', weightage: 30, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
            { id: 'k2', title: 'Team Delivery', weightage: 30, self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } }
        ],
        ksa: {
            p1: { label: 'Problem Solving', self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } },
            c1: { label: 'Communication', self: { rating: 0, justification: '' }, l1: { rating: 0, comments: '' }, l2: { rating: 0 } }
        },
        coe: [], certifications: []
    };
    save(); render();
};

function renderAdmin(container) {
    container.innerHTML = `
        <div class="animate-fade-in space-y-10">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-black text-slate-800">User Management</h1>
                    <p class="text-slate-500 font-bold text-sm uppercase mt-1">Admin Control Center</p>
                </div>
                <div class="flex gap-4">
                    <button onclick="exportToCsv()" class="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-200 transition-all">
                        <i data-lucide="download" class="w-5 h-5"></i> Export CSV
                    </button>
                    <button onclick="document.getElementById('add-user-modal').classList.toggle('hidden')" class="px-6 py-3 bg-smart-orange text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 flex items-center gap-2">
                        <i data-lucide="user-plus" class="w-5 h-5"></i> Add New Resource
                    </button>
                </div>
            </div>

            <div id="add-user-modal" class="hidden glass-card p-10 space-y-6 border-2 border-orange-100">
                <h3 class="text-xl font-black">Register New Member</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <input id="new-id" type="text" placeholder="Employee ID (emp-151)" class="p-4 border rounded-2xl">
                    <input id="new-name" type="text" placeholder="Full Name" class="p-4 border rounded-2xl">
                    <select id="new-role" class="p-4 border rounded-2xl font-bold">
                        <option value="employee">Employee</option>
                        <option value="l1">L1 Manager</option>
                        <option value="l2">L2 Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                    <input id="new-pass" type="text" placeholder="Temp Password" class="p-4 border rounded-2xl">
                </div>
                <div class="flex justify-end gap-4">
                    <button onclick="document.getElementById('add-user-modal').classList.add('hidden')" class="px-6 py-3 text-slate-500 font-bold">Cancel</button>
                    <button onclick="addUser(document.getElementById('new-id').value, document.getElementById('new-name').value, document.getElementById('new-role').value, document.getElementById('new-pass').value)" class="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black">Create User</button>
                </div>
            </div>

            <div class="glass-card overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b">
                        <tr>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase">Resource</th>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase">Role</th>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase">Employee ID</th>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase">Temp Password</th>
                            <th class="p-6 text-xs font-black text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${Object.entries(store.employees).map(([id, u]) => `
                            <tr class="hover:bg-slate-50/50 transition-colors">
                                <td class="p-6">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-600">${u.icon || id[0]}</div>
                                        <div class="font-bold text-slate-800">${u.name}</div>
                                    </div>
                                </td>
                                <td class="p-6">
                                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role.includes('l') ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}">
                                        ${u.role}
                                    </span>
                                </td>
                                <td class="p-6 font-mono text-sm text-slate-500">${id}</td>
                                <td class="p-6 font-mono text-sm text-orange-600 font-bold">${u.password || '---'}</td>
                                <td class="p-6 text-right">
                                    <button onclick="deleteUser('${id}')" class="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all">
                                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.setCoe = (id, field, role, val) => {
    const parsedVal = (field === 'rating') ? parseInt(val) : val;
    store.employees[store.selectedEmployeeId].coe.find(x => x.id === id)[role][field] = parsedVal;
    save(); render();
};

window.setCertifications = (id, field, role, val) => {
    const parsedVal = (field === 'rating') ? parseInt(val) : val;
    store.employees[store.selectedEmployeeId].certifications.find(x => x.id === id)[role][field] = parsedVal;
    save(); render();
};

function renderDashboard(container) {
    const stats = getTeamStats();
    container.innerHTML = `
        <div class="animate-fade-in space-y-10">
            <h1 class="text-3xl font-black text-slate-800">Team Performance Analytics</h1>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="glass-card p-5 bg-white border-b-4 border-slate-200">
                    <p class="text-[10px] font-black text-slate-500 uppercase">Total Team</p>
                    <p class="text-3xl font-black text-slate-800">${stats.total}</p>
                </div>
                <div class="glass-card p-5 bg-indigo-50 border-b-4 border-indigo-400">
                    <p class="text-[10px] font-black text-indigo-500 uppercase">Self-Eval Done</p>
                    <p class="text-3xl font-black text-indigo-700">${stats.self + stats.l1 + stats.l2}</p>
                </div>
                <div class="glass-card p-5 bg-emerald-50 border-b-4 border-emerald-400">
                    <p class="text-[10px] font-black text-emerald-500 uppercase">L2 Finalized</p>
                    <p class="text-3xl font-black text-emerald-700">${stats.l2}</p>
                </div>
                <div class="glass-card p-0 h-[80px] overflow-hidden flex items-center justify-center bg-slate-900 border-b-4 border-purple-500">
                    <div class="text-center">
                        <p class="text-[9px] text-slate-400 uppercase font-bold">Total Completion</p>
                        <p class="text-xl font-black text-white">${Math.round((stats.l2 / stats.total) * 100)}%</p>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between border-b pb-4">
                <h3 class="font-black text-xl text-slate-700">Individual Employee Pipeline</h3>
                <div class="flex space-x-2">
                    <span class="px-3 py-1 bg-slate-100 text-[10px] font-bold rounded-full uppercase">Draft: ${stats.draft}</span>
                    <span class="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full uppercase">In Review: ${stats.self + stats.l1}</span>
                    <span class="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full uppercase">Completed: ${stats.l2}</span>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-4">
                ${Object.values(store.employees).map(e => {
        const s = calculateScores(e);
        const isL2 = store.currentUser.role === 'l2';
        return `
                        <div class="glass-card p-0 overflow-hidden hover:scale-[1.01] transition-all border border-slate-100 shadow-sm">
                            <div class="p-6 flex items-center justify-between bg-white">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white font-black">${e.icon}</div>
                                    <div><p class="font-black text-slate-800">${e.name}</p><p class="text-[10px] text-slate-400 uppercase font-black tracking-tighter">${e.designation}</p></div>
                                </div>
                                <div class="flex items-center space-x-6">
                                    ${isL2 ? `
                                        <div class="flex space-x-4 px-4 border-l">
                                            <div class="text-center font-bold"><p class="text-[8px] text-slate-400 uppercase">KRA</p><p class="text-sm">${s.kra}</p></div>
                                            <div class="text-center font-bold"><p class="text-[8px] text-slate-400 uppercase">KSA</p><p class="text-sm">${s.ksa}</p></div>
                                            <div class="text-center h-full px-3 py-1 bg-slate-900 rounded-lg text-white font-black"><p class="text-[7px] text-slate-500 uppercase">FINAL</p><p class="text-sm">${s.final}</p></div>
                                        </div>
                                    ` : ''}
                                    <button onclick="store.selectedEmployeeId='${e.id}'; navigate('kra')" class="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-slate-800">VIEW REVIEW</button>
                                </div>
                            </div>
                            <div class="grid grid-cols-3 text-[10px] font-black text-center border-t">
                                <div class="py-2 ${getStatus(e) !== 'Draft' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'}">PHASE 1: SELF</div>
                                <div class="py-2 ${getStatus(e).includes('L1') || getStatus(e).includes('L2') ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'} border-l border-white/20">PHASE 2: L1</div>
                                <div class="py-2 ${getStatus(e).includes('L2') ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'} border-l border-white/20">PHASE 3: L2</div>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>`;
}

function renderKra(container, emp) {
    container.innerHTML = `
        <div class="animate-fade-in space-y-8">
            <h1 class="text-2xl font-black text-slate-800">KRA Appraisal: ${emp.name}</h1>
            ${(emp.kras || []).map((k, index) => `
                <div class="glass-card p-10 relative overflow-hidden">
                    <div class="absolute -top-4 -right-4 w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl font-black text-slate-200 pointer-events-none">
                        ${String(index + 1).padStart(2, '0')}
                    </div>
                    <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 relative z-10">
                        <div>
                            <h3 class="text-lg font-black text-slate-800">${k.title}</h3>
                            <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Key Result Area</p>
                        </div>
                        <div class="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl font-black text-xs">
                            ${k.weightage}% Weight
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <div class="space-y-4">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Self Evaluation</label>
                        <select ${store.currentUser.role !== 'employee' ? 'disabled' : ''} onchange="setKra('${k.id}', 'rating', 'self', this.value)" class="w-full p-4 border rounded-2xl font-black text-indigo-700">
                            ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${k.self.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                        </select>
                        <textarea ${store.currentUser.role !== 'employee' ? 'disabled' : ''} onblur="setKra('${k.id}', 'justification', 'self', this.value)" class="w-full p-4 border rounded-2xl text-sm h-32 bg-slate-50/10">${k.self.justification}</textarea>
                    </div>
                    <div class="space-y-4 ${store.currentUser.role === 'employee' ? 'opacity-40 pointer-events-none' : ''}">
                        <label class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">L1 Manager</label>
                        <select ${store.currentUser.role !== 'l1' ? 'disabled' : ''} onchange="setKra('${k.id}', 'rating', 'l1', this.value)" class="w-full p-4 border border-indigo-100 rounded-2xl font-black bg-indigo-50/10">
                            ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${k.l1.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                        </select>
                        <textarea ${store.currentUser.role !== 'l1' ? 'disabled' : ''} onblur="setKra('${k.id}', 'comments', 'l1', this.value)" class="w-full p-4 border border-indigo-50 rounded-2xl text-sm h-32 bg-indigo-50/10">${k.l1.comments}</textarea>
                    </div>
                    <div class="space-y-4 ${store.currentUser.role !== 'l2' ? 'opacity-40 pointer-events-none' : ''}">
                        <label class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">L2 Final</label>
                        <select onchange="setKra('${k.id}', 'rating', 'l2', this.value)" class="w-full p-4 border border-emerald-100 rounded-2xl font-black bg-emerald-50/10 text-emerald-700">
                            ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${k.l2.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                        </select>
                        <div class="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-[10px] text-emerald-700/60 font-bold italic">L2 provides ultimate sign-off. Score is final.</div>
                    </div>
                </div>
            `).join('')}

            <h2 class="text-lg font-black text-slate-800 flex items-center gap-3 mt-16 mb-4">
                <i data-lucide="award" class="text-indigo-600"></i> CoE Contributions
            </h2>
            <div class="space-y-6">
            ${(emp.coe || []).map((c, idx) => `
                <div class="glass-card p-10 relative overflow-hidden">
                    <div class="absolute -top-4 -right-4 w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-xl font-black text-slate-200 pointer-events-none">
                        ${String(idx + 1).padStart(2, '0')}
                    </div>
                    <div class="mb-6 pb-4 border-b border-slate-100 relative z-10">
                        <h3 class="text-lg font-black text-slate-800">${c.title}</h3>
                        <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Center of Excellence</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Self Declaration</label>
                            <input type="text" placeholder="What did you contribute?" ${store.currentUser.role !== 'employee' ? 'disabled' : ''} onblur="setCoe('${c.id}', 'description', 'self', this.value)" value="${c.self.description}" class="w-full p-4 border rounded-2xl text-sm bg-slate-50/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                            <input type="url" placeholder="Evidence Link (e.g. Confluence/Jira)" ${store.currentUser.role !== 'employee' ? 'disabled' : ''} onblur="setCoe('${c.id}', 'link', 'self', this.value)" value="${c.self.link}" class="w-full p-4 border rounded-2xl text-sm bg-slate-50/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        </div>
                        <div class="space-y-4 ${store.currentUser.role === 'employee' ? 'opacity-40 pointer-events-none' : ''}">
                            <label class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Manager Assessment</label>
                            <select ${store.currentUser.role !== 'l1' ? 'disabled' : ''} onchange="setCoe('${c.id}', 'rating', 'l1', this.value)" class="w-full p-4 border border-indigo-100 rounded-2xl font-black bg-indigo-50/10 text-indigo-700">
                                ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${c.l1.rating == v ? 'selected' : ''}>${v || 'Rate Contribution'}</option>`).join('')}
                            </select>
                            <textarea ${store.currentUser.role !== 'l1' ? 'disabled' : ''} onblur="setCoe('${c.id}', 'comments', 'l1', this.value)" placeholder="Manager comments..." class="w-full p-4 border border-indigo-50 rounded-2xl text-sm h-24 bg-indigo-50/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">${c.l1.comments}</textarea>
                        </div>
                    </div>
                </div>
            `).join('')}
            </div>

            <div class="h-px bg-slate-200 my-16"></div>
            <h2 class="text-xl font-black text-slate-800 flex items-center gap-3 mb-6">
                <i data-lucide="shield-check" class="text-emerald-600"></i> Certifications
            </h2>
            <div class="space-y-8">
            ${(emp.certifications || []).map((c, idx) => `
                <div class="glass-card p-12 relative overflow-hidden">
                    <div class="absolute -top-4 -right-4 w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-2xl font-black text-slate-200 pointer-events-none">
                        ${String(idx + 1).padStart(2, '0')}
                    </div>
                    <div class="mb-8 pb-4 border-b border-slate-100 relative z-10">
                        <h3 class="text-xl font-black text-slate-800">${c.title}</h3>
                        <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Professional Recognition</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certification Details</label>
                            <input type="text" placeholder="Exact Name of Certificate" ${store.currentUser.role !== 'employee' ? 'disabled' : ''} onblur="setCertifications('${c.id}', 'name', 'self', this.value)" value="${c.self.name}" class="w-full p-4 border rounded-2xl text-sm bg-slate-50/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                            <div class="grid grid-cols-2 gap-4">
                                <input type="date" ${store.currentUser.role !== 'employee' ? 'disabled' : ''} onblur="setCertifications('${c.id}', 'date', 'self', this.value)" value="${c.self.date}" class="w-full p-4 border rounded-2xl text-sm bg-slate-50/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                <input type="url" placeholder="Verification URL" ${store.currentUser.role !== 'employee' ? 'disabled' : ''} onblur="setCertifications('${c.id}', 'link', 'self', this.value)" value="${c.self.link}" class="w-full p-4 border rounded-2xl text-sm bg-slate-50/10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                            </div>
                        </div>
                        <div class="space-y-4 ${store.currentUser.role === 'employee' ? 'opacity-40 pointer-events-none' : ''}">
                            <label class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verification & Approval</label>
                            <div class="flex gap-4">
                                <select ${store.currentUser.role !== 'l1' ? 'disabled' : ''} onchange="setCertifications('${c.id}', 'rating', 'l1', this.value)" class="flex-1 p-4 border border-emerald-100 rounded-2xl font-black bg-emerald-50/10 text-emerald-700">
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
    container.innerHTML = `
        <div class="animate-fade-in space-y-8">
            <h1 class="text-2xl font-black text-slate-800">KSA Assessment: ${emp.name}</h1>
            ${Object.entries(emp.ksa || {}).map(([key, data], idx) => `
                <div class="glass-card p-10 relative overflow-hidden">
                    <div class="absolute -top-4 -right-4 w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl font-black text-slate-200 pointer-events-none">
                        ${String(idx + 1).padStart(2, '0')}
                    </div>
                    <div class="mb-6 pb-4 border-b border-slate-100 relative z-10">
                        <h3 class="text-lg font-black text-slate-800">${data.label}</h3>
                        <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Core Competency</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Self Evaluation</label>
                            <select ${store.currentUser.role !== 'employee' ? 'disabled' : ''} onchange="setKsa('${key}', 'rating', 'self', this.value)" class="w-full p-4 border rounded-2xl font-black text-indigo-700">
                                ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${data.self.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                            </select>
                            <textarea ${store.currentUser.role !== 'employee' ? 'disabled' : ''} onblur="setKsa('${key}', 'justification', 'self', this.value)" class="w-full p-4 border rounded-2xl text-sm h-32 bg-slate-50/10">${data.self.justification}</textarea>
                        </div>
                        <div class="space-y-4 ${store.currentUser.role === 'employee' ? 'opacity-40 pointer-events-none' : ''}">
                            <label class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">L1 Feedback</label>
                            <select ${store.currentUser.role !== 'l1' ? 'disabled' : ''} onchange="setKsa('${key}', 'rating', 'l1', this.value)" class="w-full p-4 border border-indigo-100 rounded-2xl font-black bg-indigo-50/10">
                                ${[0, 1, 2, 3, 4, 5].map(v => `<option value="${v}" ${data.l1.rating == v ? 'selected' : ''}>${v || 'Rate'}</option>`).join('')}
                            </select>
                            <textarea ${store.currentUser.role !== 'l1' ? 'disabled' : ''} onblur="setKsa('${key}', 'comments', 'l1', this.value)" class="w-full p-4 border border-indigo-100 rounded-2xl text-sm h-32 bg-indigo-50/10">${data.l1.comments}</textarea>
                        </div>
                        <div class="space-y-4 ${store.currentUser.role !== 'l2' ? 'opacity-40 pointer-events-none' : ''}">
                            <label class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">L2 Final</label>
                            <select onchange="setKsa('${key}', 'rating', 'l2', this.value)" class="w-full p-4 border border-emerald-100 rounded-2xl font-black bg-emerald-50/10 text-emerald-700">
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
        
        <div class="relative w-full max-w-[1000px] flex bg-slate-900/80 backdrop-blur-3xl rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <!-- Left Panel: Branding -->
            <div class="hidden md:flex w-5/12 bg-orange-600 p-16 flex-col justify-between relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-800 opacity-90"></div>
                <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                
                <div class="relative z-10">
                    <div class="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mb-8">
                        <i data-lucide="shield-check" class="w-10 h-10 text-white"></i>
                    </div>
                    <h1 class="text-3xl font-black text-white leading-tight tracking-tighter">Smartavya<br>Analytica</h1>
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
            <div class="flex-1 p-16 md:p-20 flex flex-col justify-center bg-white/5">
                <div class="mb-10 text-center md:text-left">
                    <h2 class="text-3xl font-black text-white mb-2 text-center md:text-left">Secure Login</h2>
                    <p class="text-slate-500 font-bold text-sm uppercase tracking-widest text-center md:text-left">Enter your credentials to access the portal</p>
                </div>

                <!-- Unified Login Form -->
                <div class="space-y-6">
                    <div class="space-y-4">
                        <div class="relative group">
                            <i data-lucide="user" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-orange-400 transition-colors"></i>
                            <input type="text" id="login-user" placeholder="Username or Employee ID" 
                                class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white font-bold outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-600">
                        </div>
                        <div class="relative group">
                            <i data-lucide="lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-orange-400 transition-colors"></i>
                            <input type="password" id="login-pass" placeholder="Password" 
                                class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white font-bold outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-600">
                        </div>
                    </div>
                    
                    <button onclick="login('unified', document.getElementById('login-user').value, document.getElementById('login-pass').value)" 
                        class="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 transition-all transform hover:scale-[1.02] active:scale-95">
                        LOGIN TO PORTAL
                    </button>
                    
                    <div id="emp-preview" class="p-4 bg-white/5 border border-white/10 rounded-2xl hidden items-center space-x-4 animate-fade-in">
                        <div id="emp-preview-icon" class="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-xs"></div>
                        <div>
                            <p id="emp-preview-name" class="text-white font-black text-sm"></p>
                            <p id="emp-preview-role" class="text-slate-500 text-[10px] uppercase font-bold tracking-tighter"></p>
                        </div>
                    </div>
                </div>



                <p class="mt-10 text-center text-slate-600 text-[10px] font-bold tracking-[0.2em] uppercase">Authorized Access Only</p>
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

    loadFromCloud(); // INITIAL SYNC
    lucide.createIcons();
});
