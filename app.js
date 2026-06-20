import { quizData } from './questions.js';

// --- State Variables ---
let currentUser = '';
let currentChapterId = '';
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;

// --- DOM Elements ---
const screens = {
    welcome: document.getElementById('welcomeScreen'),
    chapters: document.getElementById('chapterScreen'),
    quiz: document.getElementById('quizScreen'),
    result: document.getElementById('resultScreen')
};

const loginForm = document.getElementById('loginForm');
const studentNameInput = document.getElementById('studentName');
const userProfile = document.getElementById('userProfile');
const userNameDisplay = document.getElementById('userNameDisplay');
const chapterGrid = document.getElementById('chapterGrid');

// Quiz Elements
const questionCountDisplay = document.getElementById('questionCount');
const progressBar = document.getElementById('progressBar');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const nextBtn = document.getElementById('nextBtn');
const backToChaptersBtn = document.getElementById('backToChaptersBtn');

// Result Elements
const scoreDisplay = document.getElementById('scoreDisplay');
const scoreMessage = document.getElementById('scoreMessage');
const retryBtn = document.getElementById('retryBtn');
const homeBtn = document.getElementById('homeBtn');

// --- Navigation Functions ---
function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// --- Initialization ---
function init() {
    // Check if user is already logged in (session memory)
    const savedUser = sessionStorage.getItem('compTiaStudent');
    if (savedUser) {
        loginUser(savedUser);
    }

    renderChapters();
    setupEventListeners();
}

// --- Logic Functions ---
function loginUser(name) {
    currentUser = name;
    sessionStorage.setItem('compTiaStudent', name);
    userNameDisplay.textContent = name;
    userProfile.style.display = 'block';
    showScreen('chapters');
}

function renderChapters() {
    chapterGrid.innerHTML = '';
    for (const [id, data] of Object.entries(quizData)) {
        const card = document.createElement('div');
        card.className = 'chapter-card';
        card.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <p style="margin-top: 10px; font-weight: bold; font-size: 0.8rem; color: var(--primary);">
                ${data.questions.length} Questions
            </p>
        `;
        card.addEventListener('click', () => startQuiz(id));
        chapterGrid.appendChild(card);
    }
}

function startQuiz(chapterId) {
    currentChapterId = chapterId;
    currentQuestionIndex = 0;
    score = 0;
    showScreen('quiz');
    loadQuestion();
}

function loadQuestion() {
    const chapter = quizData[currentChapterId];
    const question = chapter.questions[currentQuestionIndex];
    selectedOptionIndex = null;
    nextBtn.disabled = true;

    // Update Progress
    questionCountDisplay.textContent = `Question ${currentQuestionIndex + 1} of ${chapter.questions.length}`;
    const progress = ((currentQuestionIndex) / chapter.questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Render Question
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';

    question.options.forEach((optText, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = optText;
        btn.addEventListener('click', () => selectOption(index, btn));
        optionsContainer.appendChild(btn);
    });
}

function selectOption(index, btnElement) {
    // Prevent changing answer once selected
    if (selectedOptionIndex !== null) return;

    selectedOptionIndex = index;
    const chapter = quizData[currentChapterId];
    const question = chapter.questions[currentQuestionIndex];
    const isCorrect = index === question.correctAnswer;

    // Styling
    const allOptions = optionsContainer.querySelectorAll('.option-btn');
    allOptions.forEach(btn => btn.style.cursor = 'default');
    
    if (isCorrect) {
        btnElement.classList.add('correct');
        score++;
    } else {
        btnElement.classList.add('wrong');
        // Highlight correct answer
        allOptions[question.correctAnswer].classList.add('correct');
    }

    nextBtn.disabled = false;
    
    if (currentQuestionIndex === chapter.questions.length - 1) {
        nextBtn.textContent = 'Finish Quiz';
    } else {
        nextBtn.textContent = 'Next Question';
    }
}

function handleNext() {
    const chapter = quizData[currentChapterId];
    if (currentQuestionIndex < chapter.questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const chapter = quizData[currentChapterId];
    const total = chapter.questions.length;
    const percentage = Math.round((score / total) * 100);

    progressBar.style.width = '100%';
    
    scoreDisplay.textContent = `${percentage}%`;
    
    if (percentage === 100) {
        scoreMessage.textContent = 'Perfect score! Outstanding job! 🏆';
    } else if (percentage >= 80) {
        scoreMessage.textContent = 'Great work! You are almost ready. 🌟';
    } else {
        scoreMessage.textContent = 'Keep practicing! You will get it next time. 📚';
    }

    showScreen('result');

    // Here we would call Firebase to save the score!
    // saveScoreToFirebase(currentUser, currentChapterId, score, total);
}

// --- Event Listeners ---
function setupEventListeners() {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = studentNameInput.value.trim();
        if (name) loginUser(name);
    });

    backToChaptersBtn.addEventListener('click', () => {
        if(confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
            showScreen('chapters');
        }
    });

    nextBtn.addEventListener('click', handleNext);

    retryBtn.addEventListener('click', () => startQuiz(currentChapterId));
    
    homeBtn.addEventListener('click', () => showScreen('chapters'));
}

// Start the app
init();
