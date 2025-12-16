document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    // Hero Carousel
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 5000;
    let slideTimer;

    const showSlide = (n) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (n + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlide - 1);
    };

    if (slides.length > 0) {
        // Event Listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetTimer();
            });
        });

        // Auto Play
        const startTimer = () => {
            slideTimer = setInterval(nextSlide, slideInterval);
        };

        const resetTimer = () => {
            clearInterval(slideTimer);
            startTimer();
        };

        startTimer();
    }

    // News Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const newsLists = document.querySelectorAll('.news-list');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and lists
            tabBtns.forEach(b => b.classList.remove('active'));
            newsLists.forEach(l => l.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show target content
            const target = btn.getAttribute('data-target');
            const targetList = document.getElementById(target);
            if (targetList) {
                targetList.classList.add('active');
            } else {
                // If specific target not found, maybe show first one/placeholder (optional)
                // For demo, if 'activity' clicked but id='activity' exists, it works.
                // We only implemented 'general' and 'activity' in HTML.
                // Fallback for others to show nothing or a placeholder could be added.
            }
        });
    });

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
