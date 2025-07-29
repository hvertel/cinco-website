/**
 * CINCO - Centro de Innovación y Conocimiento
 * JavaScript para funcionalidades de la página web
 */

// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    initSmoothScrolling();
    initScrollAnimations();
    initProgramTabs();
    initCounterAnimations();
    initHeaderEffects();
    initMobileMenu();
    initFormHandlers();
    initLazyLoading();
    initAccessibility();
    initPerformanceOptimizations();
}

// ===== NAVEGACIÓN SUAVE =====
function initSmoothScrolling() {
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
}

// ===== ANIMACIONES AL HACER SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===== PESTAÑAS DE PROGRAMAS =====
function initProgramTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const programGrids = document.querySelectorAll('.program-grid');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase activa de todos los botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase activa al botón clickeado
            this.classList.add('active');
            
            // Ocultar todas las grids
            programGrids.forEach(grid => {
                grid.style.display = 'none';
                grid.classList.remove('active');
            });
            
            // Mostrar la grid correspondiente
            const tabName = this.getAttribute('data-tab');
            const selectedGrid = document.querySelector(`.program-grid.${tabName}`);
            if (selectedGrid) {
                selectedGrid.style.display = 'grid';
                selectedGrid.classList.add('active');
                
                // Opcional: Añadir animaciones a las cards
                animateProgramCards(tabName);
            }
        });
    });
}
// Función opcional para animaciones
function animateProgramCards(tabName) {
    const cards = document.querySelectorAll(`.program-grid.${tabName} .program-card`);
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
    });
}
// Inicializar las pestañas al cargar la página
document.addEventListener('DOMContentLoaded', initProgramTabs);

// ===== ANIMACIONES DE CONTADORES =====
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        
        // Preservar el símbolo original
        const originalText = element.getAttribute('data-original') || element.textContent;
        const hasPercent = originalText.includes('%');
        const hasPlus = originalText.includes('+');
        
        element.textContent = current + (hasPercent ? '%' : hasPlus ? '+' : '');
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initCounterAnimations() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    // Guardar el texto original si no se ha guardado ya
                    if (!stat.getAttribute('data-original')) {
                        stat.setAttribute('data-original', stat.textContent);
                    }
                    
                    const text = stat.getAttribute('data-original');
                    const number = parseInt(text.replace(/\D/g, ''));
                    const hasPercent = text.includes('%');
                    const hasPlus = text.includes('+');
                    
                    // Resetear contador
                    stat.textContent = '0' + (hasPercent ? '%' : hasPlus ? '+' : '');
                    
                    // Iniciar animación
                    animateCounter(stat, 0, number, 2000);
                });
                
                // Solo animar una vez
                statsObserver.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// ===== EFECTOS DEL HEADER =====
function initHeaderEffects() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const currentScrollY = window.scrollY;
        
        // Cambiar fondo del header al hacer scroll
        if (currentScrollY > 100) {
            header.style.background = 'rgba(2, 48, 71, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = '0 4px 30px rgba(2, 48, 71, 0.4)';
        } else {
            header.style.background = '#023047';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 2px 20px rgba(2, 48, 71, 0.3)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== MENÚ MÓVIL =====
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const isVisible = navLinks.style.display === 'flex';
    
    navLinks.style.display = isVisible ? 'none' : 'flex';
    
    // Agregar clase para animación
    if (!isVisible) {
        navLinks.classList.add('mobile-menu-open');
    } else {
        navLinks.classList.remove('mobile-menu-open');
    }
}

function initMobileMenu() {
    // Verificar si ya existe el botón móvil
    const existingButton = document.querySelector('.mobile-menu-button');
    if (existingButton) return;
    
    // Crear botón de menú móvil si es necesario
    if (window.innerWidth <= 768) {
        createMobileMenuButton();
    }
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', debounce(() => {
        const mobileButton = document.querySelector('.mobile-menu-button');
        
        if (window.innerWidth <= 768 && !mobileButton) {
            createMobileMenuButton();
        } else if (window.innerWidth > 768 && mobileButton) {
            mobileButton.remove();
            // Restaurar navegación normal
            document.querySelector('.nav-links').style.display = 'flex';
        }
    }, 250));
}

function createMobileMenuButton() {
    const nav = document.querySelector('nav');
    const mobileButton = document.createElement('button');
    
    mobileButton.innerHTML = '☰';
    mobileButton.className = 'mobile-menu-button';
    mobileButton.setAttribute('aria-label', 'Abrir menú de navegación');
    mobileButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        display: block;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background 0.3s ease;
    `;
    
    mobileButton.addEventListener('click', toggleMobileMenu);
    mobileButton.addEventListener('mouseenter', () => {
        mobileButton.style.background = 'rgba(255, 183, 3, 0.2)';
    });
    mobileButton.addEventListener('mouseleave', () => {
        mobileButton.style.background = 'none';
    });
    
    nav.appendChild(mobileButton);
}

// ===== MANEJADORES DE FORMULARIOS =====
function initFormHandlers() {
    document.querySelectorAll('.cta-button').forEach(button => {
        if (button.textContent.includes('Información') || button.textContent.includes('Más')) {
            button.addEventListener('click',handleProgramInquiry);
        }
    });
}

/*function handleProgramInquiry(e) {
    e.preventDefault();
    
    // Obtener información del programa desde el elemento padre
    const programCard = e.target.closest('.program-card');
    let programName = 'un programa';
    
    if (programCard) {
        const titleElement = programCard.querySelector('h3');
        if (titleElement) {
            programName = titleElement.textContent;
        }
    }
    
    // Mostrar mensaje personalizado
    showNotification(
        `¡Gracias por tu interés en "${programName}"! En breve te contactaremos con más información.`,
        'success'
    );
}*/

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===== LAZY LOADING DE IMÁGENES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function initPerformanceOptimizations() {
    // Optimizar eventos de scroll
    const debouncedScrollHandler = debounce(() => {
        // Aquí se pueden agregar animaciones adicionales basadas en scroll
        updateScrollProgress();
    }, 16); // ~60fps
    
    window.addEventListener('scroll', debouncedScrollHandler);
}

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Crear o actualizar barra de progreso (opcional)
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${scrollPercent}%;
            height: 3px;
            background: linear-gradient(90deg, #ffb703, #ffd60a);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    } else {
        progressBar.style.width = scrollPercent + '%';
    }
}

// ===== MEJORAS DE ACCESIBILIDAD =====
function initAccessibility() {
    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Escape para cerrar menús
        if (e.key === 'Escape') {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.style.display === 'flex' && window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Estilos dinámicos para navegación por teclado
    addKeyboardNavigationStyles();
    
    // Configurar ARIA labels dinámicamente
    setupARIALabels();
}

function addKeyboardNavigationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid #ffb703 !important;
            outline-offset: 2px;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .mobile-menu-open {
            animation: slideInRight 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .nav-links {
                position: fixed;
                top: 80px;
                right: 20px;
                background: #023047;
                flex-direction: column;
                padding: 1rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                min-width: 200px;
            }
        }
    `;
    document.head.appendChild(style);
}

function setupARIALabels() {
    // Agregar labels ARIA a elementos interactivos
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (!link.getAttribute('aria-label')) {
            link.setAttribute('aria-label', `Navegar a ${link.textContent}`);
        }
    });
    
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent);
        }
    });
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (e) => {
    console.error('Error en la página:',e.error);
    // Aquí se podría enviar el error a un servicio de monitoreo
});

// ===== EXPORTAR FUNCIONES PARA USO EXTERNO =====
window.CINCOWebsite = {
    toggleMobileMenu,
    showNotification,
    animateCounter,
    debounce,
    throttle
};