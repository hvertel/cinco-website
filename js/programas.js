/**
 * JavaScript específico para la página Programas
 */

document.addEventListener('DOMContentLoaded', function() {
    initProgramFilters();
    initProgramAnimations();
    addPlaceholderImages();
});

// Función para los filtros de programas
function initProgramFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const programItems = document.querySelectorAll('.program-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase activa al botón clickeado
            this.classList.add('active');
            
            // Obtener categoría a filtrar
            const filterCategory = this.getAttribute('data-filter');
            
            // Filtrar programas
            programItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterCategory === 'todos' || itemCategory === filterCategory) {
                    item.style.display = 'grid';
                    // Reiniciar animación
                    item.style.animation = 'none';
                    setTimeout(() => {
                        item.style.animation = 'fadeInUp 0.6s ease forwards';
                    }, 10);
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Scroll suave al catálogo
            const catalogSection = document.querySelector('.programs-catalog');
            if (catalogSection) {
                catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Animaciones para la página
function initProgramAnimations() {
    // Animación del hero
    const heroElements = document.querySelectorAll('.programs-hero h1, .programs-hero p');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Observer para animaciones al scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animar los elementos hijos también
                const features = entry.target.querySelectorAll('.program-features li');
                features.forEach((feature, index) => {
                    setTimeout(() => {
                        feature.style.opacity = '0';
                        feature.style.transform = 'translateX(-20px)';
                        feature.style.transition = 'all 0.5s ease';
                        
                        setTimeout(() => {
                            feature.style.opacity = '1';
                            feature.style.transform = 'translateX(0)';
                        }, 50);
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.program-item').forEach(el => {
        observer.observe(el);
    });
}

// Agregar imágenes placeholder para las que faltan
function addPlaceholderImages() {
    const programImages = document.querySelectorAll('.program-image img');
    
    programImages.forEach(img => {
        // Si la imagen no existe o falla al cargar
        img.addEventListener('error', function() {
            const category = this.closest('.program-item').getAttribute('data-category');
            const title = this.closest('.program-item').querySelector('h2').textContent;
            
            // Crear un placeholder con las iniciales
            const initials = title.split(' ').map(word => word[0]).join('').substring(0, 2);
            
            // Reemplazar la imagen con un div placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = initials;
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #023047, #014157);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffb703;
                font-size: 4rem;
                font-weight: bold;
                text-transform: uppercase;
            `;
            
            this.parentElement.replaceChild(placeholder, this);
        });
        
        // Si no hay src, crear placeholder inmediatamente
        if (!img.src || img.src === window.location.href) {
            img.dispatchEvent(new Event('error'));
        }
    });
}

// Función para destacar programa desde URL
function highlightProgramFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const programId = urlParams.get('programa');
    
    if (programId) {
        // Buscar el programa por título o categoría
        const programItems = document.querySelectorAll('.program-item');
        programItems.forEach(item => {
            const title = item.querySelector('h2').textContent.toLowerCase().replace(/\s+/g, '-');
            if (title.includes(programId.toLowerCase())) {
                // Scroll al programa
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Destacar temporalmente
                    item.style.border = '3px solid #ffb703';
                    setTimeout(() => {
                        item.style.border = '';
                    }, 3000);
                }, 500);
            }
        });
    }
}

// Ejecutar al cargar
window.addEventListener('load', highlightProgramFromURL);

// Función para compartir programa
function shareProgram(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `Mira este programa de CINCO: ${title}`,
            url: url
        }).catch(console.error);
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(url).then(() => {
            showNotification('¡Enlace copiado al portapapeles!', 'success');
        });
    }
}

// Exportar funciones si es necesario
window.ProgramsPage = {
    shareProgram,
    highlightProgramFromURL
};