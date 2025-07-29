/**
 * JavaScript específico para la página Equipo
 */

document.addEventListener('DOMContentLoaded', function() {
    initTeamTabs();
    initTeamAnimations();
});

// Función para las pestañas de docentes
function initTeamTabs() {
    const tabs = document.querySelectorAll('.team-tab');
    const educacionGrid = document.getElementById('docentes-educacion');
    const psicologiaGrid = document.getElementById('docentes-psicologia');
    const agropecuariaGrid = document.getElementById('docentes-agropecuaria');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase activa de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Agregar clase activa a la pestaña clickeada
            this.classList.add('active');
            
            // Obtener el área seleccionada
            const area = this.getAttribute('data-area');
            
            // Ocultar todas las grids
            educacionGrid.style.display = 'none';
            psicologiaGrid.style.display = 'none';
            agropecuariaGrid.style.display = 'none';
            
            // Mostrar la grid correspondiente
            switch(area) {
                case 'educacion':
                    educacionGrid.style.display = 'grid';
                    animateTeamMembers(educacionGrid);
                    break;
                case 'psicologia':
                    psicologiaGrid.style.display = 'grid';
                    animateTeamMembers(psicologiaGrid);
                    break;
                case 'agropecuaria':
                    agropecuariaGrid.style.display = 'grid';
                    animateTeamMembers(agropecuariaGrid);
                    break;
            }
        });
    });
}

// Función para animar los miembros del equipo
function animateTeamMembers(grid) {
    const members = grid.querySelectorAll('.team-member');
    members.forEach((member, index) => {
        member.style.opacity = '0';
        member.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            member.style.transition = 'all 0.5s ease';
            member.style.opacity = '1';
            member.style.transform = 'scale(1)';
        }, index * 100);
    });
}

// Animaciones adicionales para la página
function initTeamAnimations() {
    // Animación para el hero
    const heroElements = document.querySelectorAll('.team-hero h1, .team-hero p');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Observer para animaciones al scroll (reutilizando el del archivo principal)
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

    document.querySelectorAll('.team-member').forEach(el => {
        observer.observe(el);
    });
}