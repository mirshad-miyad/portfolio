/* ========================================
   PORTFOLIO - MAIN JAVASCRIPT
   Mohamed Mirshad | Full Stack Developer
   ======================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM ELEMENTS =====
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');
    const backToTop = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    const formError = document.getElementById('form-error');
    const sendAnotherBtn = document.getElementById('send-another-btn');
    const submitBtn = document.getElementById('submit-btn');
    const skillFilters = document.querySelectorAll('.skills__filter');
    const skillCards = document.querySelectorAll('.skill__card');
    const yearSpan = document.getElementById('current-year');
    const animatedElements = document.querySelectorAll('[data-animate]');

    // ===== MOBILE NAV OVERLAY =====
    let navOverlay = document.querySelector('.nav__overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.classList.add('nav__overlay');
        document.body.appendChild(navOverlay);
    }

    // ===== SET CURRENT YEAR =====
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ===== MOBILE NAVIGATION =====
    function openMenu() {
        navMenu.classList.add('show-menu');
        navOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('show-menu');
        navOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', openMenu);
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active-link'));
            link.classList.add('active-link');
            closeMenu();
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
            closeMenu();
        }
    });

    // ===== HEADER SCROLL EFFECT =====
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ===== ACTIVE NAVIGATION LINK ON SCROLL =====
    function handleActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }

    // ===== BACK TO TOP BUTTON =====
    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== SCROLL EVENT HANDLER =====
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                handleActiveLink();
                handleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial call
    handleHeaderScroll();
    handleActiveLink();

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // ===== SKILLS FILTER =====
    skillFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active filter
            skillFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            const category = filter.getAttribute('data-filter');

            skillCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category');

                if (category === 'all') {
                    card.classList.remove('hidden');
                    card.style.animation = 'fade-in-up 0.4s ease forwards';
                } else if (cardCategories && cardCategories.includes(category)) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fade-in-up 0.4s ease forwards';
                } else {
                    card.classList.add('hidden');
                    card.style.animation = '';
                }
            });
        });
    });

    // ===== CONTACT FORM =====
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function showError(fieldId, message) {
        const errorSpan = document.getElementById(`${fieldId}-error`);
        const input = document.getElementById(fieldId);
        if (errorSpan) {
            errorSpan.textContent = message;
        }
        if (input) {
            input.classList.add('error');
        }
    }

    function clearError(fieldId) {
        const errorSpan = document.getElementById(`${fieldId}-error`);
        const input = document.getElementById(fieldId);
        if (errorSpan) {
            errorSpan.textContent = '';
        }
        if (input) {
            input.classList.remove('error');
        }
    }

    function clearAllErrors() {
        ['name', 'email', 'subject', 'message'].forEach(clearError);
        if (formError) {
            formError.textContent = '';
            formError.style.display = 'none';
        }
    }

    // Real-time validation on input
    ['name', 'email', 'subject', 'message'].forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', () => {
                clearError(fieldId);
            });

            input.addEventListener('blur', () => {
                validateField(fieldId);
            });
        }
    });

    function validateField(fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return true;

        const value = input.value.trim();

        switch (fieldId) {
            case 'name':
                if (!value) {
                    showError('name', 'Please enter your name');
                    return false;
                }
                if (value.length < 2) {
                    showError('name', 'Name must be at least 2 characters');
                    return false;
                }
                break;
            case 'email':
                if (!value) {
                    showError('email', 'Please enter your email');
                    return false;
                }
                if (!validateEmail(value)) {
                    showError('email', 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'subject':
                if (!value) {
                    showError('subject', 'Please enter a subject');
                    return false;
                }
                break;
            case 'message':
                if (!value) {
                    showError('message', 'Please enter your message');
                    return false;
                }
                if (value.length < 10) {
                    showError('message', 'Message must be at least 10 characters');
                    return false;
                }
                break;
        }
        return true;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllErrors();

            let isValid = true;

            ['name', 'email', 'subject', 'message'].forEach(fieldId => {
                if (!validateField(fieldId)) {
                    isValid = false;
                }
            });

            if (!isValid) return;

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Sync subject with title and subject_line variables for EmailJS templates
            const subjectInput = document.getElementById('subject');
            const hiddenTitle = document.getElementById('hidden-title');
            const hiddenSubjectLine = document.getElementById('hidden-subject-line');
            if (subjectInput && hiddenTitle) hiddenTitle.value = subjectInput.value;
            if (subjectInput && hiddenSubjectLine) hiddenSubjectLine.value = subjectInput.value;

            // Send form via EmailJS
            emailjs.sendForm('service_smbbd6p', 'template_iti7o1t', contactForm, 'g9BVp_3jz8keDYtFn')
                .then((response) => {
                    console.log('EmailJS Success:', response.status, response.text);
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;

                    // Show success state
                    contactForm.style.display = 'none';
                    contactSuccess.classList.add('show');

                    // Reset form
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;

                    // Show error message
                    if (formError) {
                        formError.textContent = 'Something went wrong. Please try again.';
                        formError.style.display = 'block';
                    }
                    alert('Something went wrong. Please try again.');
                });
        });
    }

    // Send another message
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', () => {
            contactSuccess.classList.remove('show');
            contactForm.style.display = 'flex';
            clearAllErrors();
        });
    }

    // ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== TYPING EFFECT FOR HERO SUBTITLE =====
    const heroSubtitle = document.querySelector('.hero__subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.borderRight = '2px solid var(--accent-primary)';

        let charIndex = 0;

        function typeCharacter() {
            if (charIndex < text.length) {
                heroSubtitle.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeCharacter, 80);
            } else {
                setTimeout(deleteCharacter, 1800);
            }
        }

        function deleteCharacter() {
            if (charIndex > 0) {
                charIndex--;
                heroSubtitle.textContent = text.substring(0, charIndex);
                setTimeout(deleteCharacter, 45);
            } else {
                setTimeout(typeCharacter, 400);
            }
        }

        // Start typing immediately when the page loads
        typeCharacter();
    }

    // ===== PARALLAX EFFECT FOR HERO PARTICLES =====
    const heroSection = document.querySelector('.hero');

    if (heroSection && window.matchMedia('(min-width: 768px)').matches) {
        document.addEventListener('mousemove', (e) => {
            const particles = document.querySelectorAll('.particle');
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.5;
                particle.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
            });
        });
    }
});
