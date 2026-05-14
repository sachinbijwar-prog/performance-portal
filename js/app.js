/**
 * App.js - Router and Component Controller
 */
import { store, notify, observers } from './store.js';

// Elements
const viewTitle = document.getElementById('view-title');
const contentBody = document.getElementById('content-body');
const navItems = document.querySelectorAll('.nav-item');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const badgeStatus = document.getElementById('badge-status');

// Role Switchers
const roleEmp = document.getElementById('role-emp');
const roleMgr = document.getElementById('role-mgr');

// View Map
let currentView = 'dashboard';

/**
 * Navigation logic
 */
function navigate(view) {
    currentView = view;
    render();

    // Update active nav item
    navItems.forEach(item => {
        if (item.dataset.view === view) {
            item.classList.add('bg-indigo-600', 'shadow-lg', 'shadow-indigo-600/20');
            item.classList.remove('hover:bg-slate-800');
        } else {
            item.classList.remove('bg-indigo-600', 'shadow-lg', 'shadow-indigo-600/20');
            item.classList.add('hover:bg-slate-800');
        }
    });

    viewTitle.innerText = view.charAt(0).toUpperCase() + view.slice(1) + (view === 'kra' || view === 'ksa' ? ' Evaluation' : ' Review');
}

/**
 * Main Render Engine
 */
function render() {
    contentBody.innerHTML = '';

    // Update Global UI
    progressBar.style.width = `${store.getCompletionPercentage()}%`;
    progressText.innerText = `${store.getCompletionPercentage()}%`;
    badgeStatus.innerText = store.status;

    switch (currentView) {
        case 'dashboard': renderDashboard(); break;
        case 'summary': renderSummary(); break;
        case 'kra': renderKRA(); break;
        case 'ksa': renderKSA(); break;
        case 'final': renderFinal(); break;
        case 'analytics': renderAnalytics(); break;
    }

    // Re-init Icons
    lucide.createIcons();
}

/**
 * VIEW: Dashboard (Overview)
 */
function renderDashboard() {
    const scores = store.calculateScores();
    const html = `
        <div class="animate-fade-in space-y-8">
            <header>
                <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">System Overview</h1>
                <p class="text-slate-500 mt-1">Welcome back, ${store.user.name}. Here is your current performance snapshot.</p>
            </header>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="glass-card p-6 rounded-2xl border-l-4 border-indigo-500">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><i data-lucide="target" class="w-5 h-5"></i></div>
                        <span class="text-sm font-semibold text-slate-500">KRA Score</span>
                    </div>
                    <div class="text-3xl font-bold">${scores.kra} / 5.0</div>
                </div>
                <div class="glass-card p-6 rounded-2xl border-l-4 border-emerald-500">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><i data-lucide="brain-circuit" class="w-5 h-5"></i></div>
                        <span class="text-sm font-semibold text-slate-500">KSA Score</span>
                    </div>
                    <div class="text-3xl font-bold">${scores.ksa} / 5.0</div>
                </div>
                <div class="glass-card p-6 rounded-2xl border-l-4 border-purple-500">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="p-2 bg-purple-50 text-purple-600 rounded-lg"><i data-lucide="star" class="w-5 h-5"></i></div>
                        <span class="text-sm font-semibold text-slate-500">Final Rating</span>
                    </div>
                    <div class="text-3xl font-bold">${scores.final}</div>
                </div>
                <div class="glass-card p-6 rounded-2xl border-l-4 border-amber-500">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="p-2 bg-amber-50 text-amber-600 rounded-lg"><i data-lucide="award" class="w-5 h-5"></i></div>
                        <span class="text-sm font-semibold text-slate-500">Band</span>
                    </div>
                    <div class="text-lg font-bold ${getBandClass(scores.band)} px-2 py-1 rounded-md inline-block">${scores.band}</div>
                </div>
            </div>

            <!-- Promotion & Hike (If Manager) -->
            ${store.user.role === 'manager' ? `
            <div class="glass-card p-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">Recommendation Engine</h3>
                        <p class="text-sm text-slate-500">Based on the current evaluation metrics.</p>
                    </div>
                    <div class="flex space-x-6">
                        <div class="text-center">
                            <span class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Promotion</span>
                            <span class="px-4 py-1.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs uppercase">Highly Recommended</span>
                        </div>
                        <div class="text-center">
                            <span class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Salary Hike</span>
                            <span class="px-4 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded-full text-xs uppercase">Est. 12% - 15%</span>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Recent Task / Activity -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="md:col-span-2 glass-card rounded-2xl p-0 overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="font-bold text-slate-800">KRA Progress Details</h3>
                        <button class="text-indigo-600 text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div class="p-6 space-y-6">
                        ${store.kras.map(kra => `
                            <div class="space-y-2">
                                <div class="flex justify-between text-sm">
                                    <span class="font-medium text-slate-700">${kra.title}</span>
                                    <span class="text-slate-400">${kra.weightage}% Weight</span>
                                </div>
                                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div class="bg-indigo-500 h-full rounded-full" style="width: ${kra.self.rating * 20}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="glass-card rounded-2xl p-6 bg-slate-900 text-white shadow-xl shadow-slate-900/20">
                    <h3 class="font-bold mb-6 flex items-center space-x-2">
                        <i data-lucide="sparkles" class="w-5 h-5 text-indigo-400"></i>
                        <span>AI Performance Insights</span>
                    </h3>
                    <p class="text-slate-300 text-sm leading-relaxed mb-4">
                        "Sachin's technical leadership in the Cloud migration project has been exemplary. The 30% weightage in Technical Excellence is well justified. Recommendation: Explore Lead Architect roles."
                    </p>
                    <div class="flex items-center space-x-3 text-xs text-indigo-300 animate-pulse">
                        <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                        <span>Analysis suggests consistent high output</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    contentBody.innerHTML = html;
}

/**
 * VIEW: Summary
 */
function renderSummary() {
    const html = `
        <div class="animate-fade-in space-y-6 max-w-5xl mx-auto">
            <div class="glass-card p-10 rounded-3xl overflow-hidden relative">
                <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                
                <div class="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    <img src="${store.user.avatar}" class="w-32 h-32 rounded-3xl shadow-xl border-4 border-white" alt="Profile">
                    <div class="flex-1 text-center md:text-left">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 class="text-3xl font-black text-slate-800">${store.user.name}</h1>
                                <p class="text-lg font-medium text-indigo-600">${store.user.designation}</p>
                            </div>
                            <div class="flex justify-center md:justify-end">
                                <span class="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl border border-indigo-100">
                                    ID: ${store.user.id}
                                </span>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                            <div>
                                <span class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Department</span>
                                <span class="font-semibold text-slate-700">${store.user.department}</span>
                            </div>
                            <div>
                                <span class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Review Period</span>
                                <span class="font-semibold text-slate-700">${store.user.reviewPeriod}</span>
                            </div>
                            <div>
                                <span class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reporting Manager</span>
                                <span class="font-semibold text-slate-700">${store.user.reportingManager}</span>
                            </div>
                            <div>
                                <span class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Review Manager</span>
                                <span class="font-semibold text-slate-700">${store.user.reviewManager}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="glass-card p-6 rounded-2xl">
                    <h3 class="font-bold text-slate-800 mb-4">Core Focus Areas</h3>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">Cloud Architecture</span>
                        <span class="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">Technical Mentorship</span>
                        <span class="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">Agile Delivery</span>
                        <span class="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">System Scalability</span>
                    </div>
                </div>
                <div class="glass-card p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <h3 class="font-bold text-slate-800">Current Rating Status</h3>
                        <p class="text-sm text-slate-500">Evaluation is in progress.</p>
                    </div>
                    <div class="text-right">
                        <span class="text-2xl font-black text-indigo-600">${store.calculateScores().final}</span>
                        <span class="text-xs font-bold text-slate-400 block uppercase">Projected</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    contentBody.innerHTML = html;
}

/**
 * VIEW: KRA Evaluation
 */
function renderKRA() {
    let totalWeight = store.kras.reduce((acc, k) => acc + k.weightage, 0);
    const html = `
        <div class="animate-fade-in space-y-8">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 pb-6">
                <div>
                    <h1 class="text-2xl font-black text-slate-800">Key Result Areas (KRA)</h1>
                    <p class="text-slate-500">Define and evaluate performance based on weighted business objectives.</p>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex flex-col items-end">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Weightage</span>
                        <span class="text-lg font-black ${totalWeight === 100 ? 'text-emerald-500' : 'text-rose-500'}">${totalWeight}% / 100%</span>
                    </div>
                    <button onclick="document.getElementById('modal-kra').classList.remove('hidden')" class="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all">
                        <i data-lucide="plus" class="w-6 h-6"></i>
                    </button>
                </div>
            </header>

            <div class="grid grid-cols-1 gap-6">
                ${store.kras.map((kra, index) => `
                    <div class="kra-card glass-card rounded-2xl overflow-hidden border border-slate-100">
                        <div class="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-lg flex items-center justify-center font-bold text-indigo-600">
                                    ${index + 1}
                                </div>
                                <div>
                                    <h3 class="font-bold text-slate-800">${kra.title}</h3>
                                    <span class="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">${kra.weightage}% Weight</span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                <button class="p-2 text-slate-400 hover:text-rose-500 transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </div>
                        </div>
                        
                        <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <!-- Activities -->
                            <div class="space-y-4">
                                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Planned Activities</h4>
                                <ul class="space-y-2">
                                    ${kra.activities.map(act => `
                                        <li class="flex items-start space-x-2 text-sm text-slate-600 font-medium">
                                            <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500 mt-0.5"></i>
                                            <span>${act}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                                <p class="text-xs text-slate-400 italic mt-4">${kra.description}</p>
                            </div>

                            <!-- Self Evaluation -->
                            <div class="space-y-4 p-6 bg-indigo-50/30 rounded-2xl border border-indigo-50">
                                <h4 class="text-xs font-bold text-indigo-600 uppercase tracking-widest">Self Evaluation</h4>
                                <div>
                                    <label class="block text-xs font-semibold mb-1 text-slate-600">Rating (1-5)</label>
                                    <select onchange="updateKraRating('${kra.id}', 'self', this.value)" class="w-full bg-white border border-indigo-100 rounded-lg px-3 py-2 text-sm font-bold">
                                        <option value="0" ${kra.self.rating === 0 ? 'selected' : ''}>Select Rating</option>
                                        <option value="1" ${kra.self.rating === 1 ? 'selected' : ''}>1 - Unsatisfactory</option>
                                        <option value="2" ${kra.self.rating === 2 ? 'selected' : ''}>2 - Needs Improvement</option>
                                        <option value="3" ${kra.self.rating === 3 ? 'selected' : ''}>3 - Meets Expectations</option>
                                        <option value="4" ${kra.self.rating === 4 ? 'selected' : ''}>4 - Exceeds Expectations</option>
                                        <option value="5" ${kra.self.rating === 5 ? 'selected' : ''}>5 - Outstanding</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold mb-1 text-slate-600">Justification</label>
                                    <textarea rows="3" class="w-full bg-white border border-indigo-100 rounded-lg px-3 py-2 text-sm" placeholder="Evidence of achievements...">${kra.self.justification}</textarea>
                                </div>
                            </div>

                            <!-- Manager Evaluation -->
                            <div class="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 ${store.user.role === 'employee' ? 'opacity-60 grayscale' : ''}">
                                <h4 class="text-xs font-bold text-slate-700 uppercase tracking-widest">Manager Assessment</h4>
                                <div>
                                    <label class="block text-xs font-semibold mb-1 text-slate-600">Reviewer Rating</label>
                                    <select ${store.user.role === 'employee' ? 'disabled' : ''} class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold">
                                        <option value="0" ${kra.reporting.rating === 0 ? 'selected' : ''}>To be rated</option>
                                        <option value="1" ${kra.reporting.rating === 1 ? 'selected' : ''}>1</option>
                                        <option value="2" ${kra.reporting.rating === 2 ? 'selected' : ''}>2</option>
                                        <option value="3" ${kra.reporting.rating === 3 ? 'selected' : ''}>3</option>
                                        <option value="4" ${kra.reporting.rating === 4 ? 'selected' : ''}>4</option>
                                        <option value="5" ${kra.reporting.rating === 5 ? 'selected' : ''}>5</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold mb-1 text-slate-600">Reviewer Comments</label>
                                    <textarea ${store.user.role === 'employee' ? 'disabled' : ''} rows="3" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm">${kra.reporting.comments}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    contentBody.innerHTML = html;

    // Add event listeners for KRA logic
    window.updateKraRating = (id, type, value) => {
        const kra = store.kras.find(k => k.id === id);
        if (kra) {
            kra.self.rating = parseInt(value);
            showAiSuggestion(`Your projected weighted score for "${kra.title}" is now ${(kra.self.rating * (kra.weightage / 100)).toFixed(2)}.`);
            render();
        }
    };
}

/**
 * VIEW: KSA Assessment
 */
function renderKSA() {
    const ksaCategories = [
        { key: 'technical', label: 'Technical Skills', desc: 'Domain expertise, tool proficiency, and knowledge depth.' },
        { key: 'problemSolving', label: 'Problem Solving', desc: 'Critical thinking, root cause analysis, and innovative solutions.' },
        { key: 'communication', label: 'Communication', desc: 'Clarity, listening, and effective stakeholder management.' },
        { key: 'collaboration', label: 'Collaboration', desc: 'Teamwork, cross-functional support, and synergy.' },
        { key: 'ownership', label: 'Ownership & Accountability', desc: 'Executing responsibilities and taking internal charge.' }
    ];

    const html = `
        <div class="animate-fade-in space-y-8 max-w-4xl mx-auto">
            <header>
                <h1 class="text-2xl font-black text-slate-800">Competency Assessment (KSA)</h1>
                <p class="text-slate-500">Evaluating Knowledge, Skills, and Abilities across core competencies.</p>
            </header>

            <div class="space-y-6">
                ${ksaCategories.map(cat => `
                    <div class="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div class="flex-1">
                            <h3 class="font-bold text-slate-800 text-lg">${cat.label}</h3>
                            <p class="text-sm text-slate-500">${cat.desc}</p>
                        </div>
                        <div class="w-full md:w-auto flex flex-col md:items-end gap-3">
                            <div class="flex items-center space-x-2">
                                ${[1, 2, 3, 4, 5].map(star => `
                                    <button 
                                        onclick="updateKsaRating('${cat.key}', ${star})"
                                        class="p-1.5 transition-all transform hover:scale-125 ${store.ksa[cat.key].rating >= star ? 'text-amber-400' : 'text-slate-200'}"
                                    >
                                        <i data-lucide="star" class="w-6 h-6 fill-current"></i>
                                    </button>
                                `).join('')}
                            </div>
                            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Level: ${store.ksa[cat.key].rating}/5</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="glass-card p-8 rounded-3xl bg-indigo-50/50 border-indigo-100 text-center">
                <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Projected KSA Score</span>
                <div class="text-4xl font-black text-indigo-700">${store.calculateScores().ksa}</div>
            </div>
        </div>
    `;
    contentBody.innerHTML = html;

    window.updateKsaRating = (key, val) => {
        store.ksa[key].rating = val;
        render();
    };
}

/**
 * VIEW: Final Review
 */
function renderFinal() {
    const scores = store.calculateScores();
    const html = `
        <div class="animate-fade-in space-y-8 max-w-4xl mx-auto pb-20">
            <header class="text-center">
                <h1 class="text-3xl font-black text-slate-800">Final Performance Review</h1>
                <p class="text-slate-500">Summary of integrated scores and organizational recommendations.</p>
            </header>

            <!-- Score Summary -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="glass-card p-8 rounded-3xl bg-white flex flex-col items-center text-center">
                    <div class="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-black shadow-xl shadow-indigo-200 mb-4">
                        ${scores.final}
                    </div>
                    <h3 class="text-xl font-bold text-slate-800">${scores.band}</h3>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Overall Rating Band</p>
                    
                    <div class="w-full mt-8 pt-8 border-t border-slate-100 flex justify-between">
                        <div class="text-center flex-1">
                            <span class="text-lg font-bold text-slate-800">${scores.kra}</span>
                            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">KRA (70%)</span>
                        </div>
                        <div class="text-center flex-1 border-x border-slate-100">
                            <span class="text-lg font-bold text-slate-800">${scores.ksa}</span>
                            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">KSA (30%)</span>
                        </div>
                        <div class="text-center flex-1">
                            <span class="text-lg font-bold text-emerald-500">ACTIVE</span>
                            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">STATUS</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="glass-card p-6 rounded-2xl">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-bold text-slate-800">Review Recommendations</h4>
                            <i data-lucide="info" class="w-4 h-4 text-slate-400"></i>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <span class="text-sm font-medium">Eligible for Promotion</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer" ${store.finalReview.promotion ? 'checked' : ''}>
                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <span class="text-sm font-medium">Salary Hike Recommendation</span>
                                <div class="flex items-center space-x-2">
                                    <input type="number" value="${store.finalReview.salaryHike}" class="w-20 px-2 py-1 text-right font-bold text-sm border-b border-indigo-200 bg-transparent outline-none">
                                    <span class="text-sm font-bold text-slate-400">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sign Off Section -->
            <div class="glass-card p-10 rounded-3xl overflow-hidden relative border-2 border-indigo-100">
                <div class="relative z-10 space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Manager Final Comments</label>
                            <textarea rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Summarize achievements and path forward..."></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">HR Remarks</label>
                            <textarea rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Compliance and structural feedback..."></textarea>
                        </div>
                    </div>

                    <div class="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <label class="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" onchange="toggleAck(this.checked)" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" ${store.finalReview.acknowledged ? 'checked' : ''}>
                            <span class="text-sm text-slate-600 font-medium group-hover:text-slate-900">I acknowledge that I have reviewed this evaluation with my manager.</span>
                        </label>
                        
                        <div class="flex items-center space-x-6">
                             <div class="text-right">
                                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Employee Signature</p>
                                <p class="font-bold text-slate-800 italic" id="sign-name">${store.finalReview.acknowledged ? store.user.name : 'Not Signed'}</p>
                                <p class="text-[10px] text-slate-400">${store.finalReview.signDate || '-'}</p>
                             </div>
                             <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                <i data-lucide="pen-tool" class="w-6 h-6 text-indigo-400"></i>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    contentBody.innerHTML = html;

    window.toggleAck = (val) => {
        store.finalReview.acknowledged = val;
        store.finalReview.signDate = val ? new Date().toLocaleDateString() : null;
        render();
        if (val) {
            showAiSuggestion("Digital sign-off completed. You can now submit the final evaluation.");
        }
    };
}

/**
 * VIEW: Analytics
 */
function renderAnalytics() {
    const html = `
        <div class="animate-fade-in space-y-8">
            <header>
                <h1 class="text-2xl font-black text-slate-800">Organization Performance Analytics</h1>
                <p class="text-slate-500">Aggregate insights from the current review cycle across departments.</p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="glass-card p-8 rounded-2xl">
                    <h3 class="font-bold text-slate-800 mb-6">Rating Distribution (Bands)</h3>
                    <div class="h-64 flex items-center justify-center">
                        <canvas id="chart-bands"></canvas>
                    </div>
                </div>
                <div class="glass-card p-8 rounded-2xl">
                    <h3 class="font-bold text-slate-800 mb-6">Competency Heatmap</h3>
                    <div class="h-64 flex items-center justify-center">
                        <canvas id="chart-ksa"></canvas>
                    </div>
                </div>
            </div>

            <div class="glass-card p-0 rounded-2xl overflow-hidden mt-8">
                <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 class="font-bold text-slate-800">Top Performing Sub-teams</h3>
                    <span class="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase">Review Active</span>
                </div>
                <table class="w-full text-left">
                    <thead class="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                        <tr>
                            <th class="px-6 py-4">Department</th>
                            <th class="px-6 py-4">Avg Score</th>
                            <th class="px-6 py-4">Completion</th>
                            <th class="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-slate-100">
                        <tr>
                            <td class="px-6 py-4 font-bold">Cloud Engineering</td>
                            <td class="px-6 py-4">4.2 / 5.0</td>
                            <td class="px-6 py-4">
                                <div class="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div class="bg-indigo-500 h-full w-[85%]"></div>
                                </div>
                            </td>
                            <td class="px-6 py-4"><span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Leading</span></td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 font-bold">AI Research</td>
                            <td class="px-6 py-4">4.5 / 5.0</td>
                            <td class="px-6 py-4">
                                <div class="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div class="bg-indigo-500 h-full w-[94%]"></div>
                                </div>
                            </td>
                            <td class="px-6 py-4"><span class="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">Elite</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    contentBody.innerHTML = html;

    // Init Charts
    setTimeout(() => {
        const ctxBand = document.getElementById('chart-bands');
        const ctxKsa = document.getElementById('chart-ksa');

        new Chart(ctxBand, {
            type: 'doughnut',
            data: {
                labels: ['Outstanding', 'Exceeds', 'Meets', 'Needs Imp.', 'Unsat.'],
                datasets: [{
                    data: [15, 30, 45, 10, 0],
                    backgroundColor: ['#6366f1', '#818cf8', '#a5b4fc', '#cbd5e1', '#f1f5f9'],
                    borderWidth: 0,
                    spacing: 8
                }]
            },
            options: { cutout: '70%', plugins: { legend: { position: 'right' } } }
        });

        new Chart(ctxKsa, {
            type: 'radar',
            data: {
                labels: ['Technical', 'Communication', 'Problem Solving', 'Ownership', 'Collaboration'],
                datasets: [{
                    label: 'Team Average',
                    data: [4.2, 3.8, 4.5, 4.0, 4.1],
                    fill: true,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: 'rgb(99, 102, 241)',
                    pointBackgroundColor: 'rgb(99, 102, 241)',
                }]
            },
            options: { scales: { r: { min: 0, max: 5 } }, plugins: { legend: { display: false } } }
        });
    }, 100);
}

/**
 * Helpers
 */
function getBandClass(band) {
    switch (band) {
        case 'Outstanding': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        case 'Exceeds Expectations': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
        case 'Meets Expectations': return 'bg-slate-50 text-slate-600 border border-slate-100';
        default: return 'bg-rose-50 text-rose-600 border border-rose-100';
    }
}

function showAiSuggestion(text) {
    const aiToast = document.getElementById('ai-suggestion');
    const aiText = document.getElementById('ai-text');
    aiText.innerText = text;
    aiToast.classList.remove('translate-y-32');
    setTimeout(() => {
        aiToast.classList.add('translate-y-32');
    }, 6000);
}

// Global Event Listeners
navItems.forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.view));
});

roleEmp.addEventListener('click', () => {
    store.user.role = 'employee';
    roleEmp.classList.add('bg-white', 'shadow-sm', 'ring-1', 'ring-slate-200');
    roleMgr.classList.remove('bg-white', 'shadow-sm', 'ring-1', 'ring-slate-200');
    render();
});

roleMgr.addEventListener('click', () => {
    store.user.role = 'manager';
    roleMgr.classList.add('bg-white', 'shadow-sm', 'ring-1', 'ring-slate-200');
    roleEmp.classList.remove('bg-white', 'shadow-sm', 'ring-1', 'ring-slate-200');
    render();
});

document.getElementById('btn-save').addEventListener('click', () => {
    store.status = 'Draft';
    showAiSuggestion("Progress saved successfully. You can return and edit anytime before final submission.");
    render();
});

document.getElementById('btn-submit').addEventListener('click', () => {
    if (store.getCompletionPercentage() < 100) {
        showAiSuggestion("Review cannot be submitted. Please complete all evaluation sections and sign-off.");
        return;
    }
    store.status = 'Locked';
    showAiSuggestion("Evaluation submitted successfully! The review process is now locked for management approval.");
    render();
});

// Initialization
navigate('dashboard');
render();
