// AgendyFix Landing Page JS

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const body = document.querySelector('body');

    if (mobileMenu && navLinks && body) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            body.classList.toggle('nav-open');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                body.classList.remove('nav-open');
            }

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // WhatsApp integration for "Solicitar Demo"
    // Botón "Solicitar Demo"
    const demoButtons = [
        ...document.querySelectorAll('.cta-button'),
        ...document.querySelectorAll('.hero-secondary')
    ];
    demoButtons.forEach(btn => {
        if (btn.textContent.trim().toLowerCase().includes('demo')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://wa.me/529995768092?text=Hola%2C%20quiero%20solicitar%20una%20demo%20de%20AgendyFix', '_blank');
            });
        }
    });

    // Botón "Pruébalo Gratis"
    document.querySelectorAll('.cta-button').forEach(btn => {
        if (btn.textContent.trim().toLowerCase().includes('pruébalo gratis')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://wa.me/529995768092?text=Hola%2C%20me%20gustaría%20probar%20AgendyFix%20gratis', '_blank');
            });
        }
    });

    // Botón "Empezar Gratis" (final)
    document.querySelectorAll('.cta-button-white').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://wa.me/529995768092?text=Hola%2C%20me%20gustaría%20probar%20AgendyFix%20gratis', '_blank');
        });
    });
});
