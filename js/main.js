$(document).ready(function() {
    const darkMode = localStorage.getItem('darkMode');
    
    if (darkMode === 'enabled') {
        $('body').addClass('dark-mode');
        $('.accordion-item, .form-control, .btn-outline-primary').addClass('dark-mode');
        $('#theme-toggle').html('<i class="fas fa-sun"></i>');
    } else {
        $('#theme-toggle').html('<i class="fas fa-moon"></i>');
    }

    const themeToggle = `
        <li class="nav-item">
            <button class="nav-link btn btn-link" id="theme-toggle">
                <i class="fas fa-moon"></i>
            </button>
        </li>
    `;
    $('.navbar-nav').append(themeToggle);

    $('#theme-toggle').click(function() {
        if ($('body').hasClass('dark-mode')) {
            $('body').removeClass('dark-mode');
            $('.accordion-item, .form-control, .btn-outline-primary').removeClass('dark-mode');
            localStorage.setItem('darkMode', null);
            $(this).html('<i class="fas fa-moon"></i>');
        } else {
            $('body').addClass('dark-mode');
            $('.accordion-item, .form-control, .btn-outline-primary').addClass('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            $(this).html('<i class="fas fa-sun"></i>');
        }
    });

    var elementosAnimados = $('.service-card, .testimonial-card, .team-card, .value-card, .process-card');
    
    function verificarScroll() {
        var alturaTrigger = $(window).height() * 0.8;
        
        elementosAnimados.each(function() {
            var posicionElemento = $(this).offset().top;
            if ($(window).scrollTop() + alturaTrigger > posicionElemento) {
                $(this).addClass('fade-in');
            }
        });
    }

    verificarScroll();

    $(window).scroll(verificarScroll);

    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        var destino = $(this).attr('href');
        if (destino === '#') return;
        
        $('html, body').animate({
            scrollTop: $(destino).offset().top - 70 
        }, 800);
    });
    
    if (typeof $.fn.tooltip !== 'undefined') {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }
});