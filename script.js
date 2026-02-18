// ==================== STORAGE AND STATE MANAGEMENT ====================

// Initialize storage
function initializeStorage() {
    if (!localStorage.getItem('freeTestsUsed')) {
        localStorage.setItem('freeTestsUsed', '0');
    }
    if (!localStorage.getItem('isLoggedIn')) {
        localStorage.setItem('isLoggedIn', 'false');
    }
    updateFreeTestsCounter();
}

// Update free tests counter
function updateFreeTestsCounter() {
    const freeTestsUsed = parseInt(localStorage.getItem('freeTestsUsed')) || 0;
    const freeTestsLeft = Math.max(0, 3 - freeTestsUsed);
    const counterElement = document.getElementById('freeTestsLeft');
    if (counterElement) {
        counterElement.textContent = freeTestsLeft;
    }
}

// Check if user can generate test
function canGenerateTest() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) return true;

    const freeTestsUsed = parseInt(localStorage.getItem('freeTestsUsed')) || 0;
    return freeTestsUsed < 3;
}

// Increment free tests used
function incrementFreeTestsUsed() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        let freeTestsUsed = parseInt(localStorage.getItem('freeTestsUsed')) || 0;
        localStorage.setItem('freeTestsUsed', freeTestsUsed + 1);
        updateFreeTestsCounter();
    }
}

// ==================== NAVIGATION ====================

function navigateTo(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Special handling for study material
    if (sectionId === 'study') {
        loadStudyMaterial();
    }
}

// ==================== LOGIN/LOGOUT ====================

function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
}

function handleLogin(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const studentClass = document.getElementById('studentClass').value;
    const password = document.getElementById('password').value;

    // Store user data
    localStorage.setItem('userName', name);
    localStorage.setItem('userClass', studentClass);
    localStorage.setItem('isLoggedIn', 'true');

    // Update UI
    updateLoginUI();
    closeLoginModal();
    document.getElementById('loginForm').reset();

    // Show success message
    alert(`Welcome ${name}! You now have unlimited test access. 🎉`);
}

function logout() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userName');
    localStorage.removeItem('userClass');
    updateLoginUI();
    navigateTo('dashboard');
}

function updateLoginUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginButton = document.getElementById('loginButton');
    const userProfile = document.getElementById('userProfile');
    const userName = localStorage.getItem('userName');

    if (isLoggedIn) {
        loginButton.classList.add('hidden');
        userProfile.classList.remove('hidden');
        document.getElementById('userName').textContent = `Welcome, ${userName}!`;
    } else {
        loginButton.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

// ==================== SYLLABUS SECTION ====================

function filterSyllabus(classNum) {
    const class11 = document.getElementById('class11Syllabus');
    const class12 = document.getElementById('class12Syllabus');

    // Update button states
    document.querySelectorAll('.class-selector .class-btn').forEach((btn, index) => {
        btn.classList.toggle('active', (index === 0 && classNum === 11) || (index === 1 && classNum === 12));
    });

    if (classNum === 11) {
        class11.classList.remove('hidden');
        class12.classList.add('hidden');
    } else {
        class11.classList.add('hidden');
        class12.classList.remove('hidden');
    }
}

function downloadSyllabus(className, subject) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        alert('Login required to download syllabus.');
        showLoginModal();
        return;
    }

    // Simulate PDF download
    alert(`📥 Downloading ${className} ${subject} Syllabus...\n\nIn a real app, this would download a PDF file.`);
}

// ==================== STUDY MATERIAL SECTION ====================

const studyMaterials = {
    'Physics': {
        '11': [
            { title: 'Kinematics Fundamentals', content: 'Motion equations, velocity, acceleration, projectile motion' },
            { title: 'Laws of Motion', content: 'Newtons laws, friction, circular motion, work and energy' },
            { title: 'Waves & Oscillations', content: 'Simple harmonic motion, wave properties, sound waves' },
            { title: 'Thermodynamics', content: 'Heat, temperature, first law, entropy, Carnot cycle' },
            { title: 'Gravitation', content: 'Newtons law, orbital motion, escape velocity, satellite motion' }
        ],
        '12': [
            { title: 'Electrostatics', content: 'Electric field, potential, capacitance, Gausss law' },
            { title: 'Current Electricity', content: 'Ohms law, EMF, internal resistance, Kirchhoffs laws' },
            { title: 'Magnetism', content: 'Magnetic field, force on charges, electromagnetic induction' },
            { title: 'Optics', content: 'Reflection, refraction, lenses, wave nature of light, interference' },
            { title: 'Modern Physics', content: 'Photoelectric effect, atoms, nucleus, radioactivity, X-rays' }
        ]
    },
    'Chemistry': {
        '11': [
            { title: 'Basic Concepts', content: 'Moles, molarity, normality, equivalent weights, stoichiometry' },
            { title: 'Atomic Structure', content: 'Bohr model, quantum numbers, electron configuration, orbitals' },
            { title: 'Chemical Bonding', content: 'Ionic, covalent, metallic bonds, hybridization, molecular geometry' },
            { title: 'Thermodynamics', content: 'Enthalpy, entropy, Gibbs free energy, spontaneity' },
            { title: 'Equilibrium', content: 'Le Chatliers principle, equilibrium constant, acid-base equilibrium' }
        ],
        '12': [
            { title: 'Electrochemistry', content: 'Redox reactions, electrodes, EMF, Nernst equation, electrolysis' },
            { title: 'Chemical Kinetics', content: 'Rate laws, order of reaction, activation energy, catalysis' },
            { title: 'Coordination Compounds', content: 'Ligands, coordination number, isomerism, CFSE theory' },
            { title: 'Organic Reactions', content: 'Substitution, elimination, addition, rearrangement reactions' },
            { title: 'Surface Chemistry', content: 'Adsorption, colloids, emulsions, catalysis, corrosion' }
        ]
    },
    'Mathematics': {
        '11': [
            { title: 'Sets and Functions', content: 'Set theory, relations, functions, domain, range, composition' },
            { title: 'Trigonometry', content: 'Trigonometric ratios, identities, equations, inverse functions' },
            { title: 'Sequences and Series', content: 'AP, GP, harmonic series, binomial expansion, summation' },
            { title: 'Permutations & Combinations', content: 'Counting principles, permutations, combinations, probability' },
            { title: 'Coordinate Geometry', content: 'Straight lines, circles, parabola, ellipse, hyperbola' }
        ],
        '12': [
            { title: 'Calculus Basics', content: 'Limits, continuity, derivatives, differentiation rules, applications' },
            { title: 'Integration', content: 'Indefinite integrals, definite integrals, integration techniques' },
            { title: 'Differential Equations', content: 'Separable equations, first order linear equations, applications' },
            { title: 'Linear Algebra', content: 'Matrices, determinants, eigenvalues, vector spaces' },
            { title: 'Probability', content: 'Probability distributions, binomial, normal distribution, hypothesis testing' }
        ]
    },
    'Biology': {
        '11': [
            { title: 'Cell Biology', content: 'Cell structure, organelles, cell division, mitosis, meiosis' },
            { title: 'Photosynthesis', content: 'Light and dark reactions, photosystems, electron transport' },
            { title: 'Respiration', content: 'Glycolysis, Krebs cycle, oxidative phosphorylation, fermentation' },
            { title: 'Plant Physiology', content: 'Nutrition, transport, phototropism, hormones' },
            { title: 'Animal Physiology', content: 'Digestion, circulation, respiration, excretion, nervous system' }
        ],
        '12': [
            { title: 'Genetics', content: 'Mendelian inheritance, chromosomal theory, gene mapping, mutations' },
            { title: 'Molecular Biology', content: 'DNA structure, replication, transcription, translation, gene expression' },
            { title: 'Evolution', content: 'Darwin theory, natural selection, speciation, molecular evolution' },
            { title: 'Ecology', content: 'Populations, communities, ecosystems, succession, biogeochemical cycles' },
            { title: 'Biotechnology', content: 'Genetic engineering, cloning, PCR, DNA sequencing applications' }
        ]
    }
};

function loadStudyMaterial() {
    const studyGrid = document.getElementById('studyGrid');
    const selectedSubject = document.querySelector('.subject-selector .subject-btn.active')?.textContent || 'Physics';

    // Get selected class
    const selectedClass = document.querySelector('.subject-selector').closest('.section').querySelector('.class-selector .class-btn.active');
    const classNum = selectedClass ? (selectedClass.textContent.includes('11') ? '11' : '12') : '11';

    const materials = studyMaterials[selectedSubject]?.[classNum] || [];

    studyGrid.innerHTML = materials.map((material, index) => `
        <div class="study-card">
            <h4>${material.title}</h4>
            <p>${material.content}</p>
            <button class="btn-primary" onclick="viewStudyTopic('${selectedSubject}', '${classNum}', '${material.title}')">
                View Full Notes →
            </button>
        </div>
    `).join('');
}

function filterBySubject(subject) {
    // Update active button
    document.querySelectorAll('.subject-selector .subject-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === subject);
    });

    loadStudyMaterial();
}

function filterStudy(classNum) {
    // Update active button
    document.querySelectorAll('.class-selector .class-btn').forEach((btn, index) => {
        btn.classList.toggle('active', (index === 0 && classNum === 11) || (index === 1 && classNum === 12));
    });

    loadStudyMaterial();
}

function viewStudyTopic(subject, classNum, topic) {
    alert(`📖 Full Notes: ${topic}\n\nSubject: ${subject}\nClass: ${classNum}\n\nIn a real app, this would show detailed notes, formulas, and explanations.`);
}

// ==================== TEST GENERATOR ====================

function generateTest() {
    // Check if user can generate test
    if (!canGenerateTest()) {
        document.getElementById('freeTestWarning').classList.remove('hidden');
        return;
    }

    // Get form values
    const selectedClass = document.getElementById('selectClass').value;
    const selectedSubject = document.getElementById('selectSubject').value;
    const selectedTopic = document.getElementById('selectTopic').value || 'General';
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const numQuestions = parseInt(document.getElementById('numQuestions').value);

    // Validate form
    if (!selectedClass || !selectedSubject) {
        alert('Please select Class and Subject');
        return;
    }

    // Increment free tests counter
    incrementFreeTestsUsed();
    updateFreeTestsCounter();

    // Generate questions
    const questions = generateQuestions(selectedClass, selectedSubject, selectedTopic, difficulty, numQuestions);

    // Display test
    displayTest(selectedClass, selectedSubject, selectedTopic, questions);
}

function generateQuestions(classNum, subject, topic, difficulty, numQuestions) {
    const sampleQuestions = {
        'Physics': {
            'Easy': [
                { type: 'MCQ', text: 'What is the SI unit of velocity?', options: ['m/s', 'km/h', 'cm/s', 'mm/s'], answer: 'A' },
                { type: 'MCQ', text: 'Velocity is a _____ quantity.', options: ['Scalar', 'Vector', 'Both', 'None'], answer: 'B' },
                { type: 'ShortAnswer', text: 'Define acceleration.', answer: 'Acceleration is the rate of change of velocity with respect to time.' }
            ],
            'Medium': [
                { type: 'MCQ', text: 'A car accelerates at 5 m/s². Find its velocity after 4 seconds.', options: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'], answer: 'C' },
                { type: 'Numerical', text: 'A stone is thrown upward with velocity 20 m/s. Find its time of flight (g=10 m/s²).', answer: '4 seconds' },
                { type: 'ShortAnswer', text: 'Explain Newtons first law of motion.', answer: 'An object continues in its state of rest or uniform motion unless acted upon by an external force.' }
            ],
            'Hard': [
                { type: 'MCQ', text: 'A projectile is launched at 45° with velocity 100 m/s. Find maximum height.', options: ['250 m', '500 m', '1000 m', '2000 m'], answer: 'B' },
                { type: 'Numerical', text: 'Two masses m1=2kg and m2=3kg connected by string. Find tension if system accelerates at 2 m/s².', answer: '12 N' },
                { type: 'ShortAnswer', text: 'Derive the equation v² = u² + 2as.', answer: 'Using kinematic equations and eliminating time.' }
            ]
        },
        'Chemistry': {
            'Easy': [
                { type: 'MCQ', text: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], answer: 'B' },
                { type: 'MCQ', text: 'How many electrons does Oxygen have?', options: ['6', '8', '10', '16'], answer: 'B' },
                { type: 'ShortAnswer', text: 'Define valency.', answer: 'Valency is the combining capacity of an element.' }
            ],
            'Medium': [
                { type: 'MCQ', text: 'What is the molar mass of H₂SO₄?', options: ['96 g/mol', '98 g/mol', '100 g/mol', '102 g/mol'], answer: 'B' },
                { type: 'Numerical', text: 'Calculate molarity of 1 mole NaOH in 500 ml solution.', answer: '2 M' },
                { type: 'ShortAnswer', text: 'Explain electronegativity.', answer: 'Electronegativity is the ability of an atom to attract electrons in a chemical bond.' }
            ],
            'Hard': [
                { type: 'MCQ', text: 'In a redox reaction, oxidation number of Cr increases from +3 to +6. This is...', options: ['Oxidation', 'Reduction', 'Both', 'Neither'], answer: 'A' },
                { type: 'Numerical', text: 'Calculate pH of 0.001 M HCl solution.', answer: '3' },
                { type: 'ShortAnswer', text: 'Explain hybridization in methane.', answer: 'Carbon undergoes sp³ hybridization forming 4 sigma bonds with hydrogen atoms.' }
            ]
        },
        'Mathematics': {
            'Easy': [
                { type: 'MCQ', text: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], answer: 'B' },
                { type: 'Numerical', text: 'Find the value of 5! (factorial).', answer: '120' },
                { type: 'ShortAnswer', text: 'Define a function.', answer: 'A function is a relation between inputs and outputs where each input has exactly one output.' }
            ],
            'Medium': [
                { type: 'MCQ', text: 'Find the derivative of x² + 3x.', options: ['2x', '2x + 3', 'x + 3', '3x'], answer: 'B' },
                { type: 'Numerical', text: 'Solve: 2x + 5 = 15', answer: '5' },
                { type: 'ShortAnswer', text: 'Explain arithmetic progression.', answer: 'An AP is a sequence where the difference between consecutive terms is constant.' }
            ],
            'Hard': [
                { type: 'MCQ', text: 'Integrate: ∫ x² dx', options: ['x³/3 + C', 'x³ + C', '3x³ + C', 'x + C'], answer: 'A' },
                { type: 'Numerical', text: 'Find the sum of first 10 terms of AP: 2, 5, 8...', answer: '155' },
                { type: 'ShortAnswer', text: 'Prove that √2 is irrational.', answer: 'Assume √2 is rational: √2 = p/q (in lowest terms). Then 2q² = p², proving p and q both even - contradiction.' }
            ]
        },
        'Biology': {
            'Easy': [
                { type: 'MCQ', text: 'The powerhouse of the cell is...', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], answer: 'B' },
                { type: 'MCQ', text: 'Photosynthesis occurs in which organelle?', options: ['Mitochondria', 'Ribosome', 'Chloroplast', 'Nucleus'], answer: 'C' },
                { type: 'ShortAnswer', text: 'Define cell membrane.', answer: 'The cell membrane is a semi-permeable barrier that controls the entry and exit of substances.' }
            ],
            'Medium': [
                { type: 'MCQ', text: 'In mitosis, sister chromatids separate in which phase?', options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], answer: 'C' },
                { type: 'Numerical', text: 'If parent cell has 46 chromosomes, how many will daughter cells have after mitosis?', answer: '46' },
                { type:
