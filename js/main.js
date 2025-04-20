// main.js - Script principal para el sitio web de ConIngenio

document.addEventListener('DOMContentLoaded', function() {
    // Agregar clases de animación al hacer scroll
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .team-card, .value-card, .process-card');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('fade-in');
            }
        });
    }
    
    // Verificar elementos al cargar la página
    checkScroll();
    
    // Verificar elementos al hacer scroll
    window.addEventListener('scroll', checkScroll);
    
    // Smooth scrolling para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Ajustar por navbar fixed
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Cambiar estado activo en navbar según la sección visible
    function setActiveNavItem() {
        const sections = document.querySelectorAll('main section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 100)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.navbar-nav .nav-link').forEach(navLink => {
            navLink.classList.remove('active');
            if (currentSection && navLink.getAttribute('href') === '#' + currentSection) {
                navLink.classList.add('active');
            }
        });
    }
    
    // Detectar la sección actual al hacer scroll
    window.addEventListener('scroll', setActiveNavItem);
    
    // Inicializar tooltips de Bootstrap si existen
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});