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

// Footer Theme Switcher
const footerThemeToggle = document.getElementById('footer-theme-toggle');
const footerThemeMenu = document.getElementById('footer-theme-menu');

// Footer theme configurations
const footerThemes = {
    'dark-blue': {
        gradient: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #581c87 100%)',
        textColor: 'text-gray-100',
        linkColor: 'text-gray-200',
        borderColor: 'border-gray-700'
    },
    'purple-haze': {
        gradient: 'linear-gradient(135deg, #581c87 0%, #6b21a8 50%, #831843 100%)',
        textColor: 'text-purple-100',
        linkColor: 'text-purple-200',
        borderColor: 'border-purple-700'
    },
    'green-forest': {
        gradient: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #134e4a 100%)',
        textColor: 'text-green-100',
        linkColor: 'text-green-200',
        borderColor: 'border-green-700'
    },
    'red-velvet': {
        gradient: 'linear-gradient(135deg, #7f1d1d 0%, #9a3412 50%, #7c2d12 100%)',
        textColor: 'text-red-100',
        linkColor: 'text-red-200',
        borderColor: 'border-red-700'
    },
    'gray-scale': {
        gradient: 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)',
        textColor: 'text-gray-200',
        linkColor: 'text-gray-300',
        borderColor: 'border-gray-600'
    }
};

// Toggle footer theme menu
footerThemeToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    footerThemeMenu.classList.toggle('hidden');
});

// Close footer theme menu when clicking outside
document.addEventListener('click', () => {
    footerThemeMenu.classList.add('hidden');
});

// Set footer theme function
function setFooterTheme(themeName) {
    const theme = footerThemes[themeName];
    if (!theme) return;
    
    const footer = document.getElementById('main-footer');
    const gradientBg = footer.querySelector('.footer-gradient-bg');
    
    // Update background gradient
    if (gradientBg) {
        gradientBg.style.background = theme.gradient;
    }
    
    // Update text colors
    const footerText = footer.querySelector('.footer-text');
    if (footerText) {
        footerText.className = footerText.className.replace(/text-\w+-\d+/g, theme.textColor);
    }
    
    // Update link colors
    const footerLinks = footer.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
        link.className = link.className.replace(/text-\w+-\d+/g, theme.linkColor);
    });
    
    // Update border color
    const borderTop = footer.querySelector('.border-t');
    if (borderTop) {
        borderTop.className = borderTop.className.replace(/border-\w+-\d+/g, theme.borderColor);
    }
    
    // Update social icon hover effects
    updateFooterSocialIcons(themeName);
    
    // Save footer theme preference
    localStorage.setItem('selectedFooterTheme', themeName);
    
    // Close menu
    footerThemeMenu.classList.add('hidden');
}

// Update footer social icons based on theme
function updateFooterSocialIcons(themeName) {
    const iconColors = {
        'dark-blue': 'hover:bg-blue-600',
        'purple-haze': 'hover:bg-purple-600',
        'green-forest': 'hover:bg-green-600',
        'red-velvet': 'hover:bg-orange-600',
        'gray-scale': 'hover:bg-gray-600'
    };
    
    const socialIcons = document.querySelectorAll('#main-footer .hover\\:bg-opacity-30');
    socialIcons.forEach(icon => {
        // Remove existing hover classes
        icon.className = icon.className.replace(/hover:bg-\w+-\d+/g, '');
        // Add new hover class
        icon.classList.add(iconColors[themeName]);
    });
}

// Load saved footer theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedFooterTheme = localStorage.getItem('selectedFooterTheme') || 'dark-blue';
    setFooterTheme(savedFooterTheme);
});

// Contact Theme Switcher
const contactThemeToggle = document.getElementById('contact-theme-toggle');
const contactThemeMenu = document.getElementById('contact-theme-menu');

// Contact theme configurations
const contactThemes = {
    galaxy: {
        background: 'from-indigo-900 via-purple-800 to-pink-900',
        shapes: ['rgba(147, 51, 234, 0.3)', 'rgba(236, 72, 153, 0.3)'],
        accent: 'purple'
    },
    aurora: {
        background: 'from-green-900 via-teal-800 to-blue-900',
        shapes: ['rgba(34, 197, 94, 0.3)', 'rgba(59, 130, 246, 0.3)'],
        accent: 'green'
    },
    sunset: {
        background: 'from-orange-900 via-red-800 to-pink-900',
        shapes: ['rgba(251, 146, 60, 0.3)', 'rgba(236, 72, 153, 0.3)'],
        accent: 'orange'
    },
    ocean: {
        background: 'from-blue-900 via-cyan-800 to-teal-900',
        shapes: ['rgba(59, 130, 246, 0.3)', 'rgba(20, 184, 166, 0.3)'],
        accent: 'blue'
    },
    cosmic: {
        background: 'from-indigo-900 via-purple-900 to-pink-900',
        shapes: ['rgba(99, 102, 241, 0.3)', 'rgba(168, 85, 247, 0.3)'],
        accent: 'indigo'
    }
};

// Toggle contact theme menu
contactThemeToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    contactThemeMenu.classList.toggle('hidden');
});

// Close contact theme menu when clicking outside
document.addEventListener('click', () => {
    contactThemeMenu.classList.add('hidden');
});

// Set contact theme function
function setContactTheme(themeName) {
    const theme = contactThemes[themeName];
    if (!theme) return;
    
    const contactSection = document.getElementById('contact');
    const backgroundDiv = contactSection.querySelector('.bg-gradient-to-br');
    
    if (backgroundDiv) {
        // Remove existing background classes
        backgroundDiv.className = backgroundDiv.className.replace(/from-\w+-\d+ via-\w+-\d+ to-\w+-\d+/g, '');
        backgroundDiv.classList.add('absolute', 'inset-0', 'bg-gradient-to-br', ...theme.background.split(' '));
    }
    
    // Update floating shapes colors
    updateFloatingShapes(theme);
    
    // Update contact form elements
    updateContactFormElements(theme);
    
    // Save contact theme preference
    localStorage.setItem('selectedContactTheme', themeName);
    
    // Close menu
    contactThemeMenu.classList.add('hidden');
}

// Update floating shapes colors
function updateFloatingShapes(theme) {
    const style = document.createElement('style');
    style.textContent = `
        .floating-shapes::before {
            background: radial-gradient(circle, ${theme.shapes[0]} 0%, transparent 70%);
        }
        .floating-shapes::after {
            background: radial-gradient(circle, ${theme.shapes[1]} 0%, transparent 70%);
        }
    `;
    
    // Remove existing floating shapes style
    const existingStyle = document.querySelector('style[data-floating-shapes]');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    style.setAttribute('data-floating-shapes', 'true');
    document.head.appendChild(style);
}

// Update contact form elements based on theme
function updateContactFormElements(theme) {
    const contactSection = document.getElementById('contact');
    
    // Update form inputs focus color
    const inputs = contactSection.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.className = input.className.replace(/focus:ring-\w+-\d+/g, `focus:ring-${theme.accent}-400`);
    });
    
    // Update send button gradient
    const sendButton = contactSection.querySelector('button[type="submit"]');
    if (sendButton) {
        sendButton.className = sendButton.className.replace(/from-\w+-\d+.to-\w+-\d+/g, '');
        const buttonGradients = {
            purple: 'from-purple-500 to-pink-500',
            green: 'from-green-500 to-teal-500',
            orange: 'from-orange-500 to-pink-500',
            blue: 'from-blue-500 to-cyan-500',
            indigo: 'from-indigo-500 to-purple-500'
        };
        sendButton.classList.add('bg-gradient-to-r', ...buttonGradients[theme.accent].split(' '));
    }
}

// Load saved contact theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedContactTheme = localStorage.getItem('selectedContactTheme') || 'galaxy';
    setContactTheme(savedContactTheme);
});

// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const themeMenu = document.getElementById('theme-menu');
const body = document.body;

// Theme configurations
const themes = {
    default: {
        body: 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900',
        about: 'bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900',
        brand: 'from-purple-400 to-pink-400',
        accent: 'purple'
    },
    ocean: {
        body: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900',
        about: 'bg-gradient-to-r from-blue-800 via-cyan-700 to-teal-800',
        brand: 'from-blue-400 to-cyan-400',
        accent: 'blue'
    },
    sunset: {
        body: 'bg-gradient-to-br from-orange-900 via-red-900 to-pink-900',
        about: 'bg-gradient-to-r from-orange-800 via-red-800 to-pink-800',
        brand: 'from-orange-400 to-red-400',
        accent: 'orange'
    },
    forest: {
        body: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900',
        about: 'bg-gradient-to-r from-green-800 via-emerald-800 to-teal-800',
        brand: 'from-green-400 to-emerald-400',
        accent: 'green'
    },
    midnight: {
        body: 'bg-gradient-to-br from-gray-900 via-black to-gray-800',
        about: 'bg-gradient-to-r from-gray-800 via-black to-gray-900',
        brand: 'from-gray-400 to-gray-600',
        accent: 'gray'
    },
    candy: {
        body: 'bg-gradient-to-br from-pink-900 via-purple-900 to-rose-900',
        about: 'bg-gradient-to-r from-pink-800 via-purple-800 to-rose-800',
        brand: 'from-pink-400 to-rose-400',
        accent: 'pink'
    }
};

// Toggle theme menu
themeToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('hidden');
});

// Close theme menu when clicking outside
document.addEventListener('click', () => {
    themeMenu.classList.add('hidden');
});

// Set theme function
function setTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;
    
    // Remove all theme classes
    Object.values(themes).forEach(t => {
        body.classList.remove(...t.body.split(' '));
    });
    
    // Add new theme classes
    body.classList.add(...theme.body.split(' '));
    
    // Update about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        // Remove existing about classes
        aboutSection.className = aboutSection.className.replace(/bg-gradient-to-r from-\w+-\d+ via-\w+-\d+ to-\w+-\d+/g, '');
        aboutSection.classList.add('py-20', 'px-6', 'relative', 'overflow-hidden');
        aboutSection.classList.add(...theme.about.split(' '));
    }
    
    // Update brand colors
    updateBrandColors(theme);
    
    // Save theme preference
    localStorage.setItem('selectedTheme', themeName);
    
    // Close menu
    themeMenu.classList.add('hidden');
    
    // Add transition effect
    body.style.transition = 'background 0.5s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 500);
}

// Update brand colors throughout the site
function updateBrandColors(theme) {
    // Update logo gradient
    const logoElements = document.querySelectorAll('.bg-gradient-to-r.from-purple-400.to-pink-400');
    logoElements.forEach(el => {
        el.className = el.className.replace(/from-\w+-\d+.to-\w+-\d+/g, theme.brand);
    });
    
    // Update accent colors
    const accentElements = document.querySelectorAll('[class*="text-purple-"], [class*="border-purple-"], [class*="bg-purple-"]');
    accentElements.forEach(el => {
        el.className = el.className.replace(/purple/g, theme.accent);
    });
    
    // Update contact section elements
    updateContactSection(theme);
}

// Update contact section theme
function updateContactSection(theme) {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;
    
    // Update contact form background
    const contactForm = contactSection.querySelector('.bg-white.bg-opacity-10');
    if (contactForm) {
        contactForm.className = contactForm.className.replace(/bg-gradient-to-r from-\w+-\d+ via-\w+-\d+ to-\w+-\d+/g, '');
        contactForm.classList.add('bg-white', 'bg-opacity-10', 'backdrop-blur-lg', 'rounded-2xl', 'p-8', 'border', 'border-white', 'border-opacity-20');
    }
    
    // Update contact info icons
    const iconContainers = contactSection.querySelectorAll('.bg-purple-500.bg-opacity-20');
    iconContainers.forEach(container => {
        container.className = container.className.replace(/bg-\w+-\d+/g, '');
        container.classList.add('bg-' + theme.accent + '-500', 'bg-opacity-20');
    });
    
    // Update icon colors
    const icons = contactSection.querySelectorAll('.text-purple-400');
    icons.forEach(icon => {
        icon.className = icon.className.replace(/text-\w+-\d+/g, '');
        icon.classList.add('text-' + theme.accent + '-400');
    });
    
    // Update contact title
    const contactTitle = contactSection.querySelector('h3');
    if (contactTitle) {
        contactTitle.className = contactTitle.className.replace(/text-\w+-\d+/g, '');
        contactTitle.classList.add('text-' + theme.accent + '-300');
    }
    
    // Update send button gradient
    const sendButton = contactSection.querySelector('button[type="submit"]');
    if (sendButton) {
        sendButton.className = sendButton.className.replace(/from-\w+-\d+.to-\w+-\d+/g, '');
        sendButton.classList.add('bg-gradient-to-r', ...theme.brand.split(' '));
    }
    
    // Update hover effects for contact items
    const contactItems = contactSection.querySelectorAll('.group');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.bg-opacity-20');
            if (icon) {
                icon.classList.add('bg-opacity-30');
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.bg-opacity-30');
            if (icon) {
                icon.classList.remove('bg-opacity-30');
                icon.classList.add('bg-opacity-20');
            }
        });
    });
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    setTheme(savedTheme);
});

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

// EmailJS Contact Form Handler
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await emailjs.send(
            'service_fgtf4xh',  // Your service ID
            'template_tpnqow2', // Your template ID
            {
                from_name: formData.get('from_name'),
                from_email: formData.get('from_email'),
                message: formData.get('message'),
                subject: 'Contact Form Message from Website',
                to_name: 'ECO', // Your name
            }
        );
        
        // Show success message
        showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        showMessage('Failed to send message. Please try again or contact directly via email.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

function showMessage(text, type) {
    const messageDiv = formMessage.querySelector('div');
    messageDiv.textContent = text;
    
    // Style based on type
    if (type === 'success') {
        messageDiv.className = 'p-4 rounded-lg text-center bg-green-500 bg-opacity-20 border border-green-500 text-green-300';
    } else {
        messageDiv.className = 'p-4 rounded-lg text-center bg-red-500 bg-opacity-20 border border-red-500 text-red-300';
    }
    
    // Show message
    formMessage.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
}

console.log('🚀 ECO Personal Website loaded successfully!');
console.log('🤖 AI Engagement Predictor initialized');
console.log('📧 EmailJS contact form initialized');
