document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const moonIcon = themeToggle.querySelector('i');

    // Check for saved user preference, system preference, and auto mode
    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const autoMode = localStorage.getItem('autoMode') === 'true';
        
        if (autoMode) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return savedTheme || 'light';
    };

    // Apply theme and manage auto mode
    const applyTheme = (theme, isAuto = false) => {
        document.body.setAttribute('data-theme', theme);
        moonIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', theme);
        localStorage.setItem('autoMode', isAuto);
    };

    // Initialize theme
    applyTheme(getPreferredTheme());

    // Toggle theme with double-click for auto mode
    let lastClickTime = 0;
    themeToggle.addEventListener('click', (e) => {
        const currentTime = new Date().getTime();
        const isDoubleClick = currentTime - lastClickTime < 300;
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        
        applyTheme(
            isDoubleClick ? getPreferredTheme() : (currentTheme === 'light' ? 'dark' : 'light'),
            isDoubleClick
        );
        
        lastClickTime = currentTime;
    });

    // Handle system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('autoMode') === 'true') {
            applyTheme(e.matches ? 'dark' : 'light', true);
        }
    });

    // Mobile menu toggle with improved performance
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    const toggleMenu = (show) => {
        if (show) {
            navLinks.style.display = 'flex';
            // Trigger reflow to ensure the transition works
            navLinks.offsetHeight;
            navLinks.classList.add('active');
        } else {
            navLinks.classList.remove('active');
            // Wait for transition to complete before hiding
            setTimeout(() => {
                if (!navLinks.classList.contains('active')) {
                    navLinks.style.display = 'none';
                }
            }, 300);
        }
        hamburger.classList.toggle('active', show);
    };

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.style.display === 'flex';
        toggleMenu(!isOpen);
    });

    document.addEventListener('click', (e) => {
        if (navLinks.style.display === 'flex' && !e.target.closest('.navbar')) {
            toggleMenu(false);
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking a link
                if (isMenuOpen) {
                    isMenuOpen = false;
                    navLinks.style.display = 'none';
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Simplified animation handling
    document.querySelectorAll('section, .skill-card, .project-card').forEach(el => {
        el.classList.add('fade-in');
    });

    // Add active state to navigation links based on scroll position
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    // Throttled scroll handler for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (window.scrollY >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });

                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href').slice(1) === current) {
                        item.classList.add('active');
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });
});