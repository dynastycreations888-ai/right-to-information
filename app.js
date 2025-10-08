class RTIPresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 9;
        this.isTransitioning = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.addAccessibilityFeatures();
        this.addLegalEducationFeatures();
    }
    
    initializeElements() {
        this.slidesContainer = document.getElementById('slidesContainer');
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideEl = document.getElementById('currentSlide');
        this.totalSlidesEl = document.getElementById('totalSlides');
        this.progressFill = document.querySelector('.progress-fill');
        
        // Verify elements exist
        if (!this.slidesContainer || !this.prevBtn || !this.nextBtn) {
            console.error('Critical elements not found');
            return;
        }
        
        // Set total slides display
        this.totalSlidesEl.textContent = this.totalSlides;
        
        // Initialize slide data for RTI presentation
        this.slideData = {
            1: { title: "Title Slide - Lekshmi Prakash", type: "title" },
            2: { title: "Introduction & Constitutional Basis", type: "constitutional_foundation" },
            3: { title: "Right to Information Act 2005", type: "rti_act_overview" },
            4: { title: "Institutional Framework", type: "institutional_framework" },
            5: { title: "Key Provisions & Procedure", type: "provisions_procedure" },
            6: { title: "Exemptions & Limitations", type: "exemptions_limitations" },
            7: { title: "Landmark Supreme Court Cases", type: "case_law" },
            8: { title: "Implementation Challenges & Reforms", type: "challenges_reforms" },
            9: { title: "Thank You - Lekshmi Prakash", type: "thank_you" }
        };

        // Key RTI sections and provisions
        this.rtiSections = {
            'Section 2': 'Definitions - Public Authority, Information, Right to Information',
            'Section 3': 'Right to information - Subject to provisions of this Act',
            'Section 4': 'Obligations of public authorities - Proactive disclosure',
            'Section 6': 'Request for information - Written application to PIO',
            'Section 7': 'Disposal of request - 30 days normal, 48 hours urgent',
            'Section 8': 'Exemption from disclosure - National security, commercial confidence',
            'Section 9': 'Grounds for rejection - Cabinet papers protection',
            'Section 12': 'Constitution of Central Information Commission',
            'Section 15': 'Constitution of State Information Commission',
            'Section 18': 'Powers and functions of Information Commissions',
            'Section 19': 'Appeal - First appeal and second appeal process',
            'Section 20': 'Penalties - For not providing information'
        };

        // Important RTI case law
        this.landmarkCases = {
            'S.P. Gupta v. Union of India (1981)': 'First judicial recognition of RTI as fundamental right',
            'State of U.P. v. Raj Narain (1975)': 'Right to know is basic to democratic way of life',
            'Central Information Commissioner v. State of Manipur (2012)': 'CIC power to impose penalties',
            'Institute of Chartered Accountants v. Shaunak Satya (2021)': 'Professional bodies under RTI',
            'Subhash Chandra Agarwal v. Indian National Congress (2013)': 'Political parties as public authorities',
            'CBSE v. Aditya Bandopadhyay (2011)': 'RTI and privacy balance'
        };

        console.log('RTI Presentation initialized with', this.totalSlides, 'slides');
    }
    
    bindEvents() {
        // Button navigation with explicit event prevention
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Previous button clicked');
            this.previousSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Next button clicked');
            this.nextSlide();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Click navigation on slides
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                // Don't navigate if clicking on corner section references
                if (e.target.closest('.corner-section-ref')) {
                    this.showSectionInfo(e.target.textContent);
                    return;
                }
                
                const rect = slide.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const slideWidth = rect.width;
                
                if (clickX > slideWidth / 2) {
                    console.log('Right side click - next slide');
                    this.nextSlide();
                } else {
                    console.log('Left side click - previous slide');
                    this.previousSlide();
                }
            });
        });
        
        // Touch/swipe support for mobile devices
        this.initializeTouchEvents();
        
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        console.log('Event handlers bound successfully');
    }
    
    initializeTouchEvents() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        this.slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        this.slidesContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            this.handleSwipe(startX, startY, endX, endY, endTime - startTime);
        }, { passive: true });
    }
    
    handleSwipe(startX, startY, endX, endY, duration) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        const maxSwipeTime = 1000;
        
        // Only handle horizontal swipes within time limit
        if (Math.abs(deltaX) > Math.abs(deltaY) && 
            Math.abs(deltaX) > minSwipeDistance && 
            duration < maxSwipeTime) {
            
            if (deltaX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
    }
    
    handleKeyPress(e) {
        if (this.isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
            case 'PageDown':
                e.preventDefault();
                console.log('Keyboard next:', e.key);
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'Backspace':
            case 'PageUp':
                e.preventDefault();
                console.log('Keyboard previous:', e.key);
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                this.exitFullscreen();
                break;
            case 'F5':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'p':
            case 'P':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.printPresentation();
                }
                break;
            case 'h':
            case 'H':
                e.preventDefault();
                this.showKeyboardHelp();
                break;
            case 'n':
            case 'N':
                e.preventDefault();
                this.toggleNotes();
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                this.toggleRTIReference();
                break;
            case 'c':
            case 'C':
                e.preventDefault();
                this.toggleCaseReference();
                break;
        }
        
        // Number keys for direct slide navigation (1-9)
        if (e.key >= '1' && e.key <= '9') {
            const slideNumber = parseInt(e.key);
            if (slideNumber <= this.totalSlides) {
                this.goToSlide(slideNumber);
            }
        }
    }
    
    nextSlide() {
        console.log('nextSlide called, current:', this.currentSlide, 'total:', this.totalSlides);
        if (this.currentSlide < this.totalSlides && !this.isTransitioning) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            console.log('Cannot go to next slide - at end or transitioning');
        }
    }
    
    previousSlide() {
        console.log('previousSlide called, current:', this.currentSlide);
        if (this.currentSlide > 1 && !this.isTransitioning) {
            this.goToSlide(this.currentSlide - 1);
        } else {
            console.log('Cannot go to previous slide - at start or transitioning');
        }
    }
    
    goToSlide(slideNumber) {
        console.log('goToSlide called:', slideNumber, 'from:', this.currentSlide);
        
        if (slideNumber < 1 || slideNumber > this.totalSlides || 
            slideNumber === this.currentSlide || this.isTransitioning) {
            console.log('Invalid slide transition request');
            return;
        }
        
        this.isTransitioning = true;
        console.log('Starting transition to slide', slideNumber);
        
        // Remove active class from current slide
        const currentSlideEl = document.querySelector('.slide.active');
        if (currentSlideEl) {
            currentSlideEl.classList.remove('active');
            console.log('Removed active class from current slide');
        }
        
        // Add active class to new slide
        const newSlideEl = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (newSlideEl) {
            console.log('Found new slide element for slide', slideNumber);
            newSlideEl.classList.add('active');
            this.currentSlide = slideNumber;
            this.updateDisplay();
            
            // Trigger slide-specific animations after a short delay
            setTimeout(() => {
                this.handleSlideSpecificEffects();
                this.isTransitioning = false;
                console.log('Transition complete to slide', slideNumber);
            }, 300);
        } else {
            console.error('Could not find slide element for slide', slideNumber);
            this.isTransitioning = false;
        }
        
        // Log slide navigation for study tracking
        this.logSlideNavigation(slideNumber);
    }
    
    updateDisplay() {
        console.log('Updating display for slide', this.currentSlide);
        
        // Update slide counter
        if (this.currentSlideEl) {
            this.currentSlideEl.textContent = this.currentSlide;
        }
        
        // Update progress bar (11.11% per slide for 9 slides)
        const progressPercentage = (this.currentSlide / this.totalSlides) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progressPercentage}%`;
        }
        
        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        }
        
        // Update page title with current slide info
        const slideInfo = this.slideData[this.currentSlide];
        if (slideInfo) {
            document.title = `${slideInfo.title} - Right to Information - Administrative Law`;
        }
        
        // Update ARIA labels for accessibility
        this.updateAriaLabels();
        
        // Update quick navigation if available
        this.updateQuickNavigation();
        
        // Highlight corner section reference for current slide
        this.highlightCornerSectionRef();
        
        console.log('Display updated successfully');
    }
    
    highlightCornerSectionRef() {
        const currentSlideEl = document.querySelector('.slide.active');
        const cornerRef = currentSlideEl ? currentSlideEl.querySelector('.corner-section-ref') : null;
        
        if (cornerRef) {
            cornerRef.style.animation = 'subtlePulse 2s ease-in-out';
            setTimeout(() => {
                if (cornerRef) cornerRef.style.animation = '';
            }, 2000);
        }
        
        // Add subtle pulse animation if not already defined
        if (!document.querySelector('style[data-pulse-animation]')) {
            const pulseStyles = document.createElement('style');
            pulseStyles.setAttribute('data-pulse-animation', 'true');
            pulseStyles.textContent = `
                @keyframes subtlePulse {
                    0%, 100% { opacity: 0.8; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
            `;
            document.head.appendChild(pulseStyles);
        }
    }
    
    showSectionInfo(sectionText) {
        const sectionInfo = this.getRTISectionDetailsFromText(sectionText);
        if (sectionInfo) {
            this.showNotification(`${sectionText}: ${sectionInfo}`, 'info');
        }
    }
    
    getRTISectionDetailsFromText(text) {
        const sectionMap = {
            'Article 19(1)(a)': 'Constitutional foundation - Freedom of speech and expression includes right to information',
            'RTI Act 2005': 'Comprehensive law for transparency and accountability in governance',
            'Sections 12-18': 'Institutional framework - Information Commissions structure and powers',
            'Sections 6-7': 'Application procedure and response timeline for RTI requests',
            'Sections 8-9': 'Exemptions from disclosure and grounds for rejection of requests',
            'Case Law': 'Supreme Court and High Court precedents on right to information',
            'Modern Challenges': 'Contemporary issues in RTI implementation and reforms'
        };
        return sectionMap[text] || null;
    }
    
    handleSlideSpecificEffects() {
        const currentSlideEl = document.querySelector('.slide.active');
        if (!currentSlideEl) return;
        
        // Animate list items with staggered entrance
        const listItems = currentSlideEl.querySelectorAll('.feature-list li');
        listItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 200 + (index * 80));
        });
        
        // Animate cards with subtle bounce effect
        const cards = currentSlideEl.querySelectorAll('.section-card, .exemption-card, .judgment-card, .institution-card, .challenge-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.98)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 250 + (index * 100));
        });
    }
    
    addAccessibilityFeatures() {
        // Add ARIA labels
        const presentation = document.querySelector('.presentation-container');
        if (presentation) {
            presentation.setAttribute('role', 'application');
            presentation.setAttribute('aria-label', 'Right to Information - Administrative Law - LLB Presentation - 9 Slides');
        }
        
        // Add keyboard navigation instructions
        const instructions = document.createElement('div');
        instructions.className = 'sr-only';
        instructions.textContent = 'Use arrow keys, spacebar, or navigation buttons to control slides. Press F5 for fullscreen, H for help, N for notes, R for RTI reference, C for case law reference. Numbers 1-9 for direct slide access.';
        document.body.appendChild(instructions);
        
        // Add skip navigation
        const skipNav = document.createElement('a');
        skipNav.href = '#slidesContainer';
        skipNav.textContent = 'Skip to presentation content';
        skipNav.className = 'sr-only';
        skipNav.addEventListener('focus', () => skipNav.classList.remove('sr-only'));
        skipNav.addEventListener('blur', () => skipNav.classList.add('sr-only'));
        document.body.insertBefore(skipNav, document.body.firstChild);
    }
    
    updateAriaLabels() {
        const currentSlideEl = document.querySelector('.slide.active');
        if (currentSlideEl) {
            currentSlideEl.setAttribute('aria-current', 'step');
            currentSlideEl.setAttribute('aria-label', 
                `Slide ${this.currentSlide} of ${this.totalSlides}: ${this.slideData[this.currentSlide].title}`);
        }
        
        // Remove aria-current from other slides
        this.slides.forEach((slide, index) => {
            if (index + 1 !== this.currentSlide) {
                slide.removeAttribute('aria-current');
            }
        });
    }
    
    addLegalEducationFeatures() {
        // Add basic features only to avoid breaking navigation
        this.addPresentationTimer();
        this.highlightLegalTerms();
    }
    
    updateQuickNavigation() {
        // Stub for future implementation
    }
    
    toggleNotes() {
        // Stub for future implementation
    }
    
    showKeyboardHelp() {
        // Stub for future implementation
    }
    
    toggleRTIReference() {
        // Stub for future implementation
    }
    
    toggleCaseReference() {
        // Stub for future implementation
    }
    
    addPresentationTimer() {
        const timerContainer = document.createElement('div');
        timerContainer.className = 'presentation-timer';
        timerContainer.innerHTML = `
            <div class="timer-label">Time:</div>
            <div class="timer-display">00:00</div>
        `;
        
        const timerStyles = document.createElement('style');
        timerStyles.textContent = `
            .presentation-timer {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--color-surface);
                border: 1px solid rgba(var(--color-primary-rgb, 33, 128, 141), 0.3);
                border-radius: var(--radius-sm);
                padding: var(--space-4);
                font-family: var(--font-family-mono);
                z-index: 999;
                text-align: center;
                opacity: 0.8;
            }
            .timer-label {
                font-size: 8px;
                color: var(--color-text-secondary);
                font-weight: var(--font-weight-bold);
            }
            .timer-display {
                font-size: 10px;
                color: var(--color-text-secondary);
                font-weight: var(--font-weight-bold);
            }
            @media (max-width: 768px) {
                .presentation-timer {
                    top: 10px;
                    right: 10px;
                    padding: var(--space-2);
                }
            }
        `;
        
        document.head.appendChild(timerStyles);
        document.body.appendChild(timerContainer);
        
        let startTime = Date.now();
        const timerDisplay = timerContainer.querySelector('.timer-display');
        
        setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    highlightLegalTerms() {
        const rtiTerms = [
            'Right to Information Act', 'Article 19', 'public authority', 'information',
            'Central Information Commission', 'State Information Commission',
            'Public Information Officer', 'PIO', 'transparency', 'accountability',
            'exemption', 'national security', 'commercial confidence', 'appeal',
            'Supreme Court', 'constitutional', 'fundamental right', 'administrative law',
            'good governance', 'S.P. Gupta', 'Raj Narain', 'proactive disclosure'
        ];
        
        // Wait for slides to be loaded before highlighting
        setTimeout(() => {
            document.querySelectorAll('.slide-content').forEach(slide => {
                let content = slide.innerHTML;
                rtiTerms.forEach(term => {
                    const regex = new RegExp(`\\b(${term})\\b`, 'gi');
                    content = content.replace(regex, '<mark class="legal-term">$1</mark>');
                });
                slide.innerHTML = content;
            });
        }, 1000);
        
        const termStyles = document.createElement('style');
        termStyles.textContent = `
            .legal-term {
                background: rgba(255, 140, 0, 0.2);
                padding: var(--space-1) var(--space-1);
                border-radius: var(--radius-sm);
                font-weight: var(--font-weight-medium);
                color: var(--color-text);
            }
        `;
        document.head.appendChild(termStyles);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const notificationStyles = document.createElement('style');
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 80px;
                right: 20px;
                padding: var(--space-8) var(--space-12);
                border-radius: var(--radius-sm);
                color: white;
                font-weight: var(--font-weight-semibold);
                font-size: 11px;
                z-index: 9998;
                box-shadow: var(--shadow-sm);
                transform: translateX(100%);
                transition: transform var(--duration-normal) var(--ease-standard);
                max-width: 200px;
            }
            .notification-success {
                background: var(--color-success);
            }
            .notification-error {
                background: var(--color-error);
            }
            .notification-info {
                background: var(--color-primary);
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        
        if (!document.querySelector('style[data-notification-styles]')) {
            notificationStyles.setAttribute('data-notification-styles', 'true');
            document.head.appendChild(notificationStyles);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    printPresentation() {
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .slide { 
                    position: relative !important; 
                    page-break-after: always; 
                    opacity: 1 !important;
                    transform: none !important;
                }
                .navigation-controls, .progress-bar, .presentation-timer,
                .corner-section-ref { 
                    display: none !important; 
                }
                .slide-content { 
                    max-height: none !important; 
                    overflow: visible !important; 
                    border: 2px solid #000000 !important;
                }
                .slide-title {
                    padding-right: 0 !important;
                }
                body { background: white !important; }
                * { color: black !important; }
            }
        `;
        document.head.appendChild(printStyles);
        
        setTimeout(() => {
            window.print();
            printStyles.remove();
        }, 100);
    }
    
    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateDisplay();
        }, 250);
    }
    
    logSlideNavigation(slideNumber) {
        console.log(`Navigated to slide ${slideNumber}: ${this.slideData[slideNumber].title}`);
        
        // Track study progress
        const studyProgress = {
            currentSlide: slideNumber,
            title: this.slideData[slideNumber].title,
            timestamp: new Date().toISOString(),
            totalSlides: this.totalSlides,
            subject: 'Right to Information - Administrative Law'
        };
    }
    
    // Public API methods
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            percentage: (this.currentSlide / this.totalSlides) * 100,
            title: this.slideData[this.currentSlide].title,
            type: this.slideData[this.currentSlide].type
        };
    }
    
    jumpToSlideByType(type) {
        const slideNumber = Object.keys(this.slideData).find(key => 
            this.slideData[key].type === type
        );
        if (slideNumber) {
            this.goToSlide(parseInt(slideNumber));
        }
    }
    
    getRTISection(sectionNumber) {
        return this.rtiSections[`Section ${sectionNumber}`] || null;
    }
    
    getLandmarkCase(caseName) {
        return this.landmarkCases[caseName] || null;
    }
}

// Initialize presentation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing RTI presentation...');
    
    // Wait a moment for all elements to be properly rendered
    setTimeout(() => {
        // Initialize main presentation
        window.rtiApp = new RTIPresentationApp();
        
        // Add loading completion indicator
        document.body.classList.add('presentation-loaded');
        
        // Add smooth scrolling for all slide content
        document.querySelectorAll('.slide-content').forEach(content => {
            content.style.scrollBehavior = 'smooth';
        });
        
        // Log initialization success
        console.log('📋 Right to Information - Administrative Law Presentation Initialized (9 Slides)');
        console.log('👩‍🎓 Student: Lekshmi Prakash - 3 LLB (Sem 5) - PDEA Law College, Hadapsar');
        console.log('⚖️ Features: Navigation, Timer, Legal Term Highlighting');
        console.log('⌨️ Shortcuts: Arrow keys, Space, Home/End, F5 (fullscreen), 1-9 (direct slides)');
        console.log('📱 Mobile: Swipe gestures supported');
        console.log('📚 Content: RTI Act 2005, Constitutional Basis, Institutional Framework, Case Law');
        console.log('🏛️ Administrative Law: Transparency, Accountability, Good Governance');
        
        // Add presentation metadata
        window.presentationMetadata = {
            title: 'Right to Information - Administrative Law',
            subtitle: 'RTI Act 2005 and Administrative Governance',
            student: {
                name: 'Lekshmi Prakash',
                class: '3 LLB (Sem 5)', 
                college: 'PDEA Law College, Hadapsar'
            },
            subject: 'Administrative Law',
            primaryLegislation: 'Right to Information Act, 2005',
            constitutionalBasis: 'Article 19(1)(a) - Freedom of Speech and Expression',
            totalSlides: 9,
            keyTopics: [
                'Constitutional Foundation - Article 19(1)(a)',
                'RTI Act 2005 - Objectives and Scope',
                'Institutional Framework - CIC and SIC',
                'Application Procedure and Response Timeline',
                'Exemptions and Public Interest Test',
                'Supreme Court Jurisprudence',
                'Implementation Challenges and Reforms'
            ],
            landmarkCases: [
                'S.P. Gupta v. Union of India (1981)',
                'State of U.P. v. Raj Narain (1975)',
                'Central Information Commissioner v. State of Manipur (2012)',
                'Institute of Chartered Accountants v. Shaunak Satya (2021)',
                'Subhash Chandra Agarwal v. Indian National Congress (2013)',
                'CBSE v. Aditya Bandopadhyay (2011)'
            ],
            version: 'Fixed navigation version - 9-slide comprehensive RTI presentation'
        };
    }, 100);
});

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
    document.body.classList.toggle('fullscreen-mode', !!document.fullscreenElement);
});

// Handle print preparation
window.addEventListener('beforeprint', () => {
    document.body.classList.add('print-mode');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-mode');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        RTIPresentationApp
    };
}