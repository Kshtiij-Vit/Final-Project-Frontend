document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (you'll need to implement your actual auth check)
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedIn');
            window.location.href = 'index.html';
        });
    }
    
    // Navigation to marks page
    const addMarksBtn = document.getElementById('add-marks-btn');
    if (addMarksBtn) {
        addMarksBtn.addEventListener('click', function() {
            window.location.href = 'marks.html';
        });
    }
    
    // Marks form submission
    const marksForm = document.getElementById('marks-form');
    if (marksForm) {
        marksForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const subject = document.getElementById('subject').value;
            const assessmentType = document.getElementById('assessment-type').value;
            const assessmentNumber = document.getElementById('assessment-number').value;
            const marksObtained = document.getElementById('marks-obtained').value;
            const totalMarks = document.getElementById('total-marks').value;
            
            // Calculate percentage
            const percentage = (marksObtained / totalMarks) * 100;
            
            // Save to localStorage (in a real app, you'd send to a server)
            let marks = JSON.parse(localStorage.getItem('studentMarks') || '[]');
            
            marks.push({
                subject,
                assessmentType,
                assessmentNumber,
                marksObtained,
                totalMarks,
                percentage,
                date: new Date().toISOString()
            });
            
            localStorage.setItem('studentMarks', JSON.stringify(marks));
            
            // Redirect back to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Load marks data on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        loadMarksData();
    }
});

function loadMarksData() {
    const marks = JSON.parse(localStorage.getItem('studentMarks') || '[]');
    const marksContainer = document.querySelector('.marks-container');
    
    // Clear existing marks (except the first few if you want to keep some static)
    if (marksContainer && marks.length > 0) {
        marksContainer.innerHTML = '';
        
        // Display the 4 most recent marks
        const recentMarks = marks.slice(-4).reverse();
        
        recentMarks.forEach(mark => {
            const assessmentName = `${capitalizeFirstLetter(mark.subject)} ${capitalizeFirstLetter(mark.assessmentType)} ${mark.assessmentNumber}`;
            const marksCard = document.createElement('div');
            marksCard.className = 'marks-card';
            marksCard.innerHTML = `
                <h3>${assessmentName}</h3>
                <p class="marks">${mark.marksObtained}/${mark.totalMarks}</p>
            `;
            marksContainer.appendChild(marksCard);
        });
    }
    
    // Update grades based on marks
    updateGrades();
}

function updateGrades() {
    const marks = JSON.parse(localStorage.getItem('studentMarks') || '[]');
    
    // Calculate average for each subject
    const subjects = {
        math: { total: 0, count: 0 },
        physics: { total: 0, count: 0 },
        chemistry: { total: 0, count: 0 }
    };
    
    marks.forEach(mark => {
        if (subjects[mark.subject]) {
            subjects[mark.subject].total += mark.percentage;
            subjects[mark.subject].count++;
        }
    });
    
    // Update grade cards
    for (const subject in subjects) {
        const gradeCard = document.querySelector(`.grade-card h3:contains(${capitalizeFirstLetter(subject)})`)?.parentElement;
        if (gradeCard && subjects[subject].count > 0) {
            const average = subjects[subject].total / subjects[subject].count;
            const gradeLetter = getGradeLetter(average);
            
            gradeCard.querySelector('.progress-bar').style.width = `${average}%`;
            gradeCard.querySelector('.grade-score').textContent = `${Math.round(average)}%`;
            gradeCard.querySelector('.grade-letter').textContent = gradeLetter;
        }
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