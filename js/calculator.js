let subjects = [];

        function toggleAssessmentOptions() {
            const subjectType = document.getElementById('subjectType').value;
            document.getElementById('theoryOptions').style.display = subjectType === 'theory' ? 'block' : 'none';
            document.getElementById('labOptions').style.display = subjectType === 'lab' ? 'block' : 'none';

            if (subjectType === 'theory') updateTheoryComponents();
            if (subjectType === 'lab') updateLabComponents();
        }

        function updateTheoryComponents() {
            const assignmentChecked = document.getElementById('theoryAssignment').checked;
            const digitalChecked = document.getElementById('theoryDigital').checked;
            const quizChecked = document.getElementById('theoryQuiz').checked;

            document.getElementById('theoryAssignmentCount').disabled = !assignmentChecked;
            document.getElementById('theoryDigitalCount').disabled = !digitalChecked;
            document.getElementById('theoryQuizCount').disabled = !quizChecked;

            const assignmentCount = assignmentChecked ? parseInt(document.getElementById('theoryAssignmentCount').value) : 0;
            const digitalCount = digitalChecked ? parseInt(document.getElementById('theoryDigitalCount').value) : 0;
            const quizCount = quizChecked ? parseInt(document.getElementById('theoryQuizCount').value) : 0;

            const totalComponents = assignmentCount + digitalCount + quizCount;
            const remainingWeight = 30;
            const weightPerComponent = totalComponents > 0 ? remainingWeight / totalComponents : 0;

            let weightInfo = `Total components selected: ${totalComponents}`;
            if (totalComponents > 0) {
                weightInfo += ` (Each worth ${weightPerComponent.toFixed(2)}%)`;
            }

            document.getElementById('theoryWeightInfo').innerHTML = weightInfo;
        }

        function updateLabComponents() {
            const assignmentChecked = document.getElementById('labAssignment').checked;
            const digitalChecked = document.getElementById('labDigital').checked;
            const quizChecked = document.getElementById('labQuiz').checked;

            document.getElementById('labAssignmentCount').disabled = !assignmentChecked;
            document.getElementById('labDigitalCount').disabled = !digitalChecked;
            document.getElementById('labQuizCount').disabled = !quizChecked;

            const assignmentCount = assignmentChecked ? parseInt(document.getElementById('labAssignmentCount').value) : 0;
            const digitalCount = digitalChecked ? parseInt(document.getElementById('labDigitalCount').value) : 0;
            const quizCount = quizChecked ? parseInt(document.getElementById('labQuizCount').value) : 0;

            const totalComponents = assignmentCount + digitalCount + quizCount;
            const remainingWeight = 60;
            const weightPerComponent = totalComponents > 0 ? remainingWeight / totalComponents : 0;

            let weightInfo = `Total components selected: ${totalComponents}`;
            if (totalComponents > 0) {
                weightInfo += ` (Each worth ${weightPerComponent.toFixed(2)}%)`;
            }

            document.getElementById('labWeightInfo').innerHTML = weightInfo;
        }

        function addSubject() {
            const name = document.getElementById('subjectName').value;
            const type = document.getElementById('subjectType').value;
            const credit = parseInt(document.getElementById('subjectCredit').value);

            if (!name) {
                alert('Please enter a subject name');
                return;
            }

            const subject = {
                id: Date.now(),
                name,
                type,
                credit,
                assessments: [],
                classAverage: type === 'theory' ? parseInt(document.getElementById('classAverage').value) : null,
                stdDev: type === 'theory' ? parseInt(document.getElementById('stdDev').value) : null
            };

            if (type === 'theory') {
                // Add fixed theory assessments
                subject.assessments.push({ type: 'CAT1', maxMarks: 50, weightage: 15, marks: null });
                subject.assessments.push({ type: 'CAT2', maxMarks: 50, weightage: 15, marks: null });
                subject.assessments.push({ type: 'FAT', maxMarks: 100, weightage: 40, marks: null });

                // Add variable theory assessments
                const assignmentCount = document.getElementById('theoryAssignment').checked ?
                    parseInt(document.getElementById('theoryAssignmentCount').value) : 0;
                const digitalCount = document.getElementById('theoryDigital').checked ?
                    parseInt(document.getElementById('theoryDigitalCount').value) : 0;
                const quizCount = document.getElementById('theoryQuiz').checked ?
                    parseInt(document.getElementById('theoryQuizCount').value) : 0;

                const totalComponents = assignmentCount + digitalCount + quizCount;
                const weightPerComponent = totalComponents > 0 ? 30 / totalComponents : 0;

                for (let i = 1; i <= assignmentCount; i++) {
                    subject.assessments.push({
                        type: `Assignment ${i}`,
                        maxMarks: 10,
                        weightage: weightPerComponent,
                        marks: null
                    });
                }

                for (let i = 1; i <= digitalCount; i++) {
                    subject.assessments.push({
                        type: `Digital Assignment ${i}`,
                        maxMarks: 10,
                        weightage: weightPerComponent,
                        marks: null
                    });
                }

                for (let i = 1; i <= quizCount; i++) {
                    subject.assessments.push({
                        type: `Quiz ${i}`,
                        maxMarks: 10,
                        weightage: weightPerComponent,
                        marks: null
                    });
                }
            } else { // lab
                // Add fixed lab assessment
                subject.assessments.push({ type: 'FAT', maxMarks: 100, weightage: 40, marks: null });

                // Add variable lab assessments
                const assignmentCount = document.getElementById('labAssignment').checked ?
                    parseInt(document.getElementById('labAssignmentCount').value) : 0;
                const digitalCount = document.getElementById('labDigital').checked ?
                    parseInt(document.getElementById('labDigitalCount').value) : 0;
                const quizCount = document.getElementById('labQuiz').checked ?
                    parseInt(document.getElementById('labQuizCount').value) : 0;

                const totalComponents = assignmentCount + digitalCount + quizCount;
                const weightPerComponent = totalComponents > 0 ? 60 / totalComponents : 0;

                for (let i = 1; i <= assignmentCount; i++) {
                    subject.assessments.push({
                        type: `Assignment ${i}`,
                        maxMarks: 100,
                        weightage: weightPerComponent,
                        marks: null
                    });
                }

                for (let i = 1; i <= digitalCount; i++) {
                    subject.assessments.push({
                        type: `Digital Assignment ${i}`,
                        maxMarks: 100,
                        weightage: weightPerComponent,
                        marks: null
                    });
                }

                for (let i = 1; i <= quizCount; i++) {
                    subject.assessments.push({
                        type: `Quiz ${i}`,
                        maxMarks: 100,
                        weightage: weightPerComponent,
                        marks: null
                    });
                }
            }

            subjects.push(subject);
            renderSubjects();
            document.getElementById('subjectName').value = '';
            // ... existing subject creation code ...

            // Save to localStorage under userData
            const userData = JSON.parse(localStorage.getItem('userData')) || {
                currentUser: JSON.parse(localStorage.getItem('userData')).currentUser,
                subjects: [],
                studentMarks: [],
                friends: [],
                rankings: { class: [], batch: [], program: [] }
            };
            
            userData.subjects.push(subject);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Redirect back to dashboard
            //window.location.href = 'dashboard.html';

        }

        function renderSubjects() {
            const container = document.getElementById('subjectsContainer');
            container.innerHTML = '';

            if (subjects.length === 0) {
                container.innerHTML = '<p>No subjects added yet.</p>';
                return;
            }

            subjects.forEach(subject => {
                const subjectDiv = document.createElement('div');
                subjectDiv.className = 'subject-item';
                subjectDiv.id = `subject-${subject.id}`;

                let html = `
                    <h3>${subject.name} (${subject.type.charAt(0).toUpperCase() + subject.type.slice(1)}, ${subject.credit} credits)
                        <button class="remove-btn" onclick="removeSubject(${subject.id})">Remove</button>
                    </h3>
                    <div class="assessment-section">
                        <table>
                            <thead>
                                <tr>
                                    <th>Assessment</th>
                                    <th>Max Marks</th>
                                    <th>Weightage</th>
                                    <th>Your Marks</th>
                                    <th>Weighted Score</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                let totalWeighted = 0;
                let fatScore = 0;

                subject.assessments.forEach(assessment => {
                    const weighted = assessment.marks !== null ?
                        (assessment.marks / assessment.maxMarks) * assessment.weightage : 0;
                    totalWeighted += weighted;

                    if (assessment.type === 'FAT') {
                        fatScore = weighted;
                    }

                    html += `
                        <tr>
                            <td>${assessment.type}</td>
                            <td>${assessment.maxMarks}</td>
                            <td>${assessment.weightage}%</td>
                            <td>
                                <input type="number" min="0" max="${assessment.maxMarks}" 
                                    value="${assessment.marks !== null ? assessment.marks : ''}" 
                                    onchange="updateMarks(${subject.id}, '${assessment.type.replace(/ /g, '_')}', this.value)">
                            </td>
                            <td>${weighted.toFixed(2)}</td>
                        </tr>
                    `;
                });

                // Check pass criteria
                const passFat = subject.assessments.find(a => a.type === 'FAT')?.marks !== null ?
                    (subject.assessments.find(a => a.type === 'FAT').marks / subject.assessments.find(a => a.type === 'FAT').maxMarks) >= 0.4 : false;

                const passed = passFat && totalWeighted >= 50;

                html += `
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="4">Total</th>
                                    <th>${totalWeighted.toFixed(2)}%</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <div class="flex-container">
                        <div class="flex-item">
                            <p>FAT Score: ${fatScore.toFixed(2)}% ${passFat ? '' : '<span class="warning">(Below 40%)</span>'}</p>
                            <p>Status: ${passed ? '<span style="color:green">Passing</span>' : '<span class="warning">Failing</span>'}</p>
                        </div>
                `;

                if (subject.type === 'theory') {
                    html += `
                        <div class="flex-item">
                            <label>Class Average:</label>
                            <input type="number" min="0" max="100" value="${subject.classAverage}" 
                                onchange="updateClassAverage(${subject.id}, this.value)">
                        </div>
                        <div class="flex-item">
                            <label>Std Deviation:</label>
                            <input type="number" min="1" max="20" value="${subject.stdDev}" 
                                onchange="updateStdDev(${subject.id}, this.value)">
                        </div>
                    `;
                }

                html += `</div>`;

                // Calculate and display grade
                const grade = calculateGrade(subject, totalWeighted);
                const gradePoint = getGradePoint(grade);

                html += `
                    <div class="result">
                        Current Grade: <span class="grade">${grade} (${gradePoint})</span>
                    </div>
                    
                    <!-- Add Save Marks button -->
                    <div class="subject-actions">
                        <button onclick="saveSubject(${subject.id})" class="save-btn">Save Marks</button>
                    </div>
                `;

                subjectDiv.innerHTML = html;
                container.appendChild(subjectDiv);
            });
        }

        function updateMarks(subjectId, assessmentType, marks) {
            const subject = subjects.find(s => s.id === subjectId);
            if (!subject) return;

            // Replace underscores with spaces for matching
            const formattedType = assessmentType.replace(/_/g, ' ');

            // Find the exact assessment to update
            const assessment = subject.assessments.find(a => a.type === formattedType);

            if (assessment) {
                assessment.marks = marks !== '' ? parseFloat(marks) : null;
            }

            renderSubjects();
        }

        function updateClassAverage(subjectId, average) {
            const subject = subjects.find(s => s.id === subjectId);
            if (subject) {
                subject.classAverage = parseFloat(average);
                renderSubjects();
            }
        }

        function updateStdDev(subjectId, stdDev) {
            const subject = subjects.find(s => s.id === subjectId);
            if (subject) {
                subject.stdDev = parseFloat(stdDev);
                renderSubjects();
            }
        }

        function removeSubject(subjectId) {
            subjects = subjects.filter(s => s.id !== subjectId);
            renderSubjects();
        }

        function calculateGrade(subject, totalWeighted) {
            if (subject.type === 'lab') {
                // Absolute grading for lab
                if (totalWeighted >= 90) return 'S';
                if (totalWeighted >= 80) return 'A';
                if (totalWeighted >= 70) return 'B';
                if (totalWeighted >= 60) return 'C';
                if (totalWeighted >= 55) return 'D';
                if (totalWeighted >= 50) return 'E';
                return 'F';
            } else {
                // Relative grading for theory based on class average and standard deviation
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

        function getGradePoint(grade) {
            switch (grade) {
                case 'S': return '10';
                case 'A': return '9';
                case 'B': return '8';
                case 'C': return '7';
                case 'D': return '6';
                case 'E': return '5';
                case 'F': return '0';
                default: return 'N/A';
            }
        }

//         // Initialize the page
//         document.addEventListener('DOMContentLoaded', function () {
//             toggleAssessmentOptions();

//             // Add event listeners for component checkboxes
//             const theoryCheckboxes = document.querySelectorAll('input[name="theoryComponents"]');
//             theoryCheckboxes.forEach(checkbox => {
//                 checkbox.addEventListener('change', updateTheoryComponents);
//             });

//             const labCheckboxes = document.querySelectorAll('input[name="labComponents"]');
//             labCheckboxes.forEach(checkbox => {
//                 checkbox.addEventListener('change', updateLabComponents);
//             });
//         });
// document.addEventListener('DOMContentLoaded', function() {
//     // All your calculator code here
// });

function saveSubject(subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    // Load current user data
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        currentUser: JSON.parse(localStorage.getItem('userData')).currentUser,
        subjects: [],
        studentMarks: [],
        friends: [],
        rankings: { class: [], batch: [], program: [] }
    };

    // Find and update the subject in userData
    const existingSubjectIndex = userData.subjects.findIndex(s => s.id === subjectId);
    if (existingSubjectIndex >= 0) {
        // Update existing subject
        userData.subjects[existingSubjectIndex] = subject;
    } else {
        // Add new subject
        userData.subjects.push(subject);
    }

    // Save back to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Show confirmation
    alert('Marks saved successfully!');
    
    // Optional: Redirect to dashboard
    // window.location.href = 'dashboard.html';
}



// Initialize the page - move this to the bottom of the file
document.addEventListener('DOMContentLoaded', function() {
    toggleAssessmentOptions();
    
    // Load any existing subjects
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        const userData = JSON.parse(savedData);
        subjects = userData.subjects || [];
        renderSubjects();
    }

    // Add event listeners for component checkboxes
    const theoryCheckboxes = document.querySelectorAll('input[name="theoryComponents"]');
    theoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTheoryComponents);
    });

    const labCheckboxes = document.querySelectorAll('input[name="labComponents"]');
    labCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateLabComponents);
    });
});