// Global data structure
const userData = {
    currentUser: null,
    subjects: [],
    friends: [],
    rankings: {
        class: [],
        batch: [],
        program: []
    },
    studentMarks: []
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and handle accordingly
    const path = window.location.pathname;
    
    if (path.endsWith('index.html') || path === '/') {
        handleLoginPage();
    } else if (path.includes('dashboard.html')) {
        handleDashboardPage();
    } else if (path.includes('marks.html')) {
        handleMarksPage();
    } else if (path.includes('leaderboard.html')) {
        handleLeaderboardPage();
    } else if (path.includes('calculator.html')) {
        // Calculator-specific handling is in js/calculator.js
    }
});

// ==================== LOGIN PAGE ====================
function handleLoginPage() {
    // Animation handling
    setTimeout(function() {
        const logoContainer = document.querySelector('.logo-container');
        if (logoContainer) logoContainer.classList.add('move-up');
        
        setTimeout(function() {
            const loginContainer = document.querySelector('.login-container');
            if (loginContainer) loginContainer.classList.add('show');
        }, 1000);
    }, 2500);

    // Form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                alert('Please enter both username and password');
                return;
            }
            
            // Set user data
            userData.currentUser = {
                username: username,
                program: 'BTech',
                batch: '2023',
                class: 'CSE-A'
            };
            
            // Save to storage
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Redirect
            window.location.href = 'dashboard.html';
        });
    }
}

// ==================== DASHBOARD PAGE ====================
function handleDashboardPage() {
    // Check login first
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load fresh data from localStorage
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        try {
            Object.assign(userData, JSON.parse(savedData));
        } catch (e) {
            console.error("Error parsing user data:", e);
        }
    }
    
    // Setup UI and load content
    setupDashboardUI();
    loadDashboardContent();
}

function loadUserData() {
    try {
        const savedData = localStorage.getItem('userData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            Object.assign(userData, parsed);
            
            // Initialize any missing arrays
            userData.subjects = userData.subjects || [];
            userData.studentMarks = userData.studentMarks || [];
        }
    } catch (e) {
        console.error("Error loading user data:", e);
        // Initialize fresh data
        userData.subjects = [];
        userData.studentMarks = [];
    }
    // const savedData = localStorage.getItem('userData');
    // if (savedData) {
    //     Object.assign(userData, JSON.parse(savedData));
    // }
    
    // // Load marks from old system if exists
    // const oldMarks = JSON.parse(localStorage.getItem('studentMarks') || '[]');
    // if (oldMarks.length > 0) {
    //     userData.studentMarks = oldMarks;
    //     localStorage.removeItem('studentMarks');
    // }
}

function setupDashboardUI() {
    // Welcome message
    const usernameElement = document.getElementById('username-display');
    if (usernameElement) {
        usernameElement.textContent = `Welcome, ${userData.currentUser.username}`;
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }
    
    // Calculator button
    const calculatorBtn = document.getElementById('calculator-btn');
    if (calculatorBtn) {
        calculatorBtn.addEventListener('click', function() {
            window.location.href = 'calculator.html';
        });
    }
    
    // Leaderboard button
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', function() {
            window.location.href = 'leaderboard.html';
        });
    }
    // Change this in setupDashboardUI():
    const addSubjectBtn = document.getElementById('add-subject-btn');
    if (addSubjectBtn) {
        addSubjectBtn.addEventListener('click', function() {
            window.location.href = 'calculator.html';
        });
    }
}

function loadDashboardContent() {
    // Load marks data
    // Ensure we have fresh data
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        Object.assign(userData, JSON.parse(savedData));
    }
    if (userData.studentMarks.length > 0) {
        loadMarksData();
    }
    
    // Load subjects from calculator
    if (userData.subjects.length > 0) {
        loadSubjectGrades();
    }
    
    // Update rankings
    updateRankings();
    checkForNewSubjects();
}

function loadMarksData() {
    const marksContainer = document.getElementById('recent-assessments');
    if (!marksContainer) return;
    
    marksContainer.innerHTML = '';
    const recentMarks = userData.studentMarks.slice(-4).reverse();
    
    recentMarks.forEach(mark => {
        const card = document.createElement('div');
        card.className = 'marks-card';
        card.innerHTML = `
            <h3>${capitalizeFirstLetter(mark.subject)} ${capitalizeFirstLetter(mark.assessmentType)} ${mark.assessmentNumber}</h3>
            <p class="marks">${mark.marksObtained}/${mark.totalMarks}</p>
            <p class="marks-date">${new Date(mark.date).toLocaleDateString()}</p>
        `;
        marksContainer.appendChild(card);
    });
}

function loadSubjectGrades() {
    const gradesContainer = document.getElementById('grades-container');
    if (!gradesContainer) return;
    
    // Clear existing content
    gradesContainer.innerHTML = '';
    
    // Check if we have subjects to display
    if (!userData.subjects || userData.subjects.length === 0) {
        gradesContainer.innerHTML = '<p>No subjects added yet. Use the calculator to add subjects.</p>';
        return;
    }
    
    // Create grade cards for each subject
    userData.subjects.forEach(subject => {
        // Calculate total weighted score
        const totalWeighted = subject.assessments.reduce((sum, assessment) => {
            const marks = assessment.marks || 0;
            return sum + (marks / assessment.maxMarks) * assessment.weightage;
        }, 0);
        
        // Create the grade card element
        const gradeCard = document.createElement('div');
        gradeCard.className = 'grade-card';
        gradeCard.innerHTML = `
            <h3>${subject.name}</h3>
            <div class="grade-progress">
                <div class="progress-bar" style="width: ${totalWeighted}%"></div>
            </div>
            <p class="grade-score">${totalWeighted.toFixed(2)}%</p>
            <p class="grade-letter">${calculateGrade(subject, totalWeighted)}</p>
            <div class="subject-details">
                <p>Type: ${subject.type === 'theory' ? 'Theory' : 'Lab'}</p>
                <p>Credits: ${subject.credit}</p>
            </div>
        `;
        
        gradesContainer.appendChild(gradeCard);
    });
}

// ==================== MARKS PAGE ====================
function handleMarksPage() {
    // Check login
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Form submission
    const marksForm = document.getElementById('marks-form');
    if (marksForm) {
        marksForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const subject = document.getElementById('subject').value;
            const assessmentType = document.getElementById('assessment-type').value;
            const assessmentNumber = document.getElementById('assessment-number').value;
            const marksObtained = parseFloat(document.getElementById('marks-obtained').value);
            const totalMarks = parseFloat(document.getElementById('total-marks').value);
            
            if (marksObtained > totalMarks) {
                alert('Marks obtained cannot be greater than total marks');
                return;
            }
            
            const percentage = (marksObtained / totalMarks) * 100;
            
            userData.studentMarks.push({
                subject,
                assessmentType,
                assessmentNumber,
                marksObtained,
                totalMarks,
                percentage,
                date: new Date().toISOString()
            });
            
            localStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = 'dashboard.html';
        });
    }
}

// ==================== LEADERBOARD PAGE ====================
function handleLeaderboardPage() {
    // Check login
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load data
    loadUserData();
    
    // Setup UI
    setupLeaderboardUI();
    
    // Load content
    loadLeaderboardContent();
}

function setupLeaderboardUI() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Friend search
    const searchInput = document.getElementById('search-friend');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchFriends(this.value);
        });
    }
    
    // Back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
}

function loadLeaderboardContent() {
    // Generate sample rankings if none exist
    if (userData.rankings.class.length === 0) {
        updateRankings();
    }
    
    // Load friends tab by default
    switchTab('friends');
}

function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activate selected tab
    const activeTab = document.getElementById(`${tabId}-tab`);
    if (activeTab) activeTab.classList.add('active');
    
    // Activate button
    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Load content for tab
    if (tabId === 'friends') {
        loadFriendsList();
    } else {
        loadRankingList(tabId);
    }
}

// HELPER FUNCTIONS
function updateRankings() {
    userData.rankings = {
        class: generateRankingData(30, userData.currentUser.username),
        batch: generateRankingData(100, userData.currentUser.username),
        program: generateRankingData(500, userData.currentUser.username)
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
}

function generateRankingData(count, currentUsername) {
    const rankings = [];
    for (let i = 1; i <= count; i++) {
        rankings.push({
            name: i === Math.floor(count/2) ? currentUsername : `Student${i}`,
            score: Math.floor(Math.random() * 100),
            rank: i
        });
    }
    return rankings.sort((a, b) => b.score - a.score);
}

function calculateGrade(subject, totalWeighted) {
    if (subject.type === 'lab') {
        if (totalWeighted >= 90) return 'S';
        if (totalWeighted >= 80) return 'A';
        if (totalWeighted >= 70) return 'B';
        if (totalWeighted >= 60) return 'C';
        if (totalWeighted >= 55) return 'D';
        if (totalWeighted >= 50) return 'E';
        return 'F';
    } else {
        if (!subject.classAverage || !subject.stdDev) return 'N/A';
        
        const deviation = (totalWeighted - subject.classAverage) / subject.stdDev;
        
        if (deviation >= 1.5) return 'S';
        if (deviation >= 0.5) return 'A';
        if (deviation >= -0.5) return 'B';
        if (deviation >= -1.0) return 'C';
        if (deviation >= -1.5) return 'D';
        if (deviation >= -2.0) return 'E';
        return 'F';
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getGradeLetter(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}
function checkForNewSubjects() {
    const calculatorSubjects = JSON.parse(localStorage.getItem('calculatorSubjects')) || [];
    if (calculatorSubjects.length > 0) {
        // Merge new subjects with existing ones
        userData.subjects = [...userData.subjects, ...calculatorSubjects];
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Clear the temporary storage
        localStorage.removeItem('calculatorSubjects');
        
        // Refresh the display
        loadSubjectGrades();
    }
}