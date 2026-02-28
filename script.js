// Decision Tree Algorithm for Engagement Prediction
class EngagementPredictor {
    constructor() {
        // Decision tree rules based on educational research
        this.rules = {
            high: {
                attendance: 85,
                interaction: 15,
                quiz: 75
            },
            medium: {
                attendance: 70,
                interaction: 8,
                quiz: 60
            }
        };
    }

    predict(attendance, interaction, quizScore) {
        // Normalize inputs
        const att = Math.min(100, Math.max(0, attendance));
        const inter = Math.min(50, Math.max(0, interaction));
        const quiz = Math.min(100, Math.max(0, quizScore));

        // Decision tree logic
        if (att >= this.rules.high.attendance && 
            inter >= this.rules.high.interaction && 
            quiz >= this.rules.high.quiz) {
            return {
                level: 'High',
                confidence: this.calculateConfidence(att, inter, quiz, 'high'),
                color: '#10b981',
                description: 'Student shows excellent engagement across all metrics',
                recommendations: [
                    'Continue providing challenging material',
                    'Consider leadership opportunities',
                    'Encourage peer mentoring'
                ]
            };
        } else if (att >= this.rules.medium.attendance && 
                   inter >= this.rules.medium.interaction && 
                   quiz >= this.rules.medium.quiz) {
            return {
                level: 'Medium',
                confidence: this.calculateConfidence(att, inter, quiz, 'medium'),
                color: '#f59e0b',
                description: 'Student shows moderate engagement with room for improvement',
                recommendations: [
                    'Increase interactive elements',
                    'Provide more frequent feedback',
                    'Create small group activities'
                ]
            };
        } else {
            return {
                level: 'Low',
                confidence: this.calculateConfidence(att, inter, quiz, 'low'),
                color: '#ef4444',
                description: 'Student requires additional support to improve engagement',
                recommendations: [
                    'Schedule one-on-one sessions',
                    'Identify potential barriers to engagement',
                    'Adjust teaching approach to learning style'
                ]
            };
        }
    }

    calculateConfidence(attendance, interaction, quizScore, level) {
        const thresholds = this.rules[level];
        if (!thresholds) return 0.5;

        const attScore = Math.min(1, attendance / thresholds.attendance);
        const interScore = Math.min(1, interaction / thresholds.interaction);
        const quizScoreNorm = Math.min(1, quizScore / thresholds.quiz);

        const avgScore = (attScore + interScore + quizScoreNorm) / 3;
        return Math.min(0.95, Math.max(0.6, avgScore));
    }
}

// Initialize the predictor
const predictor = new EngagementPredictor();

// DOM elements
const form = document.getElementById('prediction-form');
const resultsDiv = document.getElementById('results');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');

// Mobile menu toggle
mobileMenuBtn?.addEventListener('click', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu?.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const attendance = parseFloat(document.getElementById('attendance').value);
    const interaction = parseFloat(document.getElementById('interaction').value);
    const quizScore = parseFloat(document.getElementById('quiz-score').value);
    
    // Show loading state
    resultsDiv.innerHTML = `
        <div class="text-center py-12">
            <div class="loading mx-auto mb-4"></div>
            <p class="text-gray-400">Analyzing engagement patterns...</p>
        </div>
    `;
    
    // Simulate processing time for better UX
    setTimeout(() => {
        const prediction = predictor.predict(attendance, interaction, quizScore);
        displayResults(prediction, { attendance, interaction, quizScore });
    }, 1500);
});

function displayResults(prediction, inputs) {
    const confidencePercent = Math.round(prediction.confidence * 100);
    
    resultsDiv.innerHTML = `
        <div class="space-y-6 animate-slide-in">
            <!-- Main Result -->
            <div class="text-center p-6 rounded-xl" style="background: ${prediction.color}20; border: 2px solid ${prediction.color}">
                <div class="text-5xl font-bold mb-2" style="color: ${prediction.color}">
                    ${prediction.level}
                </div>
                <div class="text-lg text-gray-300 mb-4">
                    Engagement Level
                </div>
                <div class="text-sm text-gray-400">
                    Confidence: ${confidencePercent}%
                </div>
            </div>
            
            <!-- Confidence Bar -->
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-400">Confidence</span>
                    <span class="text-gray-300">${confidencePercent}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000 ease-out"
                         style="width: ${confidencePercent}%; background: ${prediction.color}">
                    </div>
                </div>
            </div>
            
            <!-- Input Summary -->
            <div class="bg-white bg-opacity-5 rounded-lg p-4 space-y-2">
                <h4 class="font-semibold text-purple-300 mb-3">Input Summary</h4>
                <div class="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <div class="text-gray-400">Attendance</div>
                        <div class="font-semibold">${inputs.attendance}%</div>
                    </div>
                    <div>
                        <div class="text-gray-400">Interactions</div>
                        <div class="font-semibold">${inputs.interaction}/class</div>
                    </div>
                    <div>
                        <div class="text-gray-400">Quiz Score</div>
                        <div class="font-semibold">${inputs.quizScore}%</div>
                    </div>
                </div>
            </div>
            
            <!-- Description -->
            <div class="bg-white bg-opacity-5 rounded-lg p-4">
                <h4 class="font-semibold text-purple-300 mb-2">Analysis</h4>
                <p class="text-gray-300 text-sm leading-relaxed">
                    ${prediction.description}
                </p>
            </div>
            
            <!-- Recommendations -->
            <div class="bg-white bg-opacity-5 rounded-lg p-4">
                <h4 class="font-semibold text-purple-300 mb-3">Recommendations</h4>
                <ul class="space-y-2">
                    ${prediction.recommendations.map(rec => `
                        <li class="flex items-start text-sm text-gray-300">
                            <i class="fas fa-lightbulb text-yellow-400 mt-1 mr-3 flex-shrink-0"></i>
                            <span>${rec}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4">
                <button onclick="resetForm()" 
                        class="flex-1 py-2 px-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                    Try Again
                </button>
                <button onclick="exportResults('${prediction.level}', ${confidencePercent})" 
                        class="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg transition-all text-sm">
                    Export Results
                </button>
            </div>
        </div>
    `;
}

function resetForm() {
    form?.reset();
    resultsDiv.innerHTML = `
        <div class="text-center py-12">
            <i class="fas fa-robot text-6xl text-purple-400 mb-4"></i>
            <p class="text-gray-400">Enter student data and click "Predict Engagement" to see results</p>
        </div>
    `;
}

function exportResults(level, confidence) {
    const data = {
        timestamp: new Date().toISOString(),
        engagement_level: level,
        confidence: confidence,
        inputs: {
            attendance: document.getElementById('attendance').value,
            interaction: document.getElementById('interaction').value,
            quiz_score: document.getElementById('quiz-score').value
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `engagement-prediction-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-in');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('#home');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('#home h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// Add hover effect to cards
document.querySelectorAll('.card-hover').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

console.log('🚀 ECO Personal Website loaded successfully!');
console.log('🤖 AI Engagement Predictor initialized');
