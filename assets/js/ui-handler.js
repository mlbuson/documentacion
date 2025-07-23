class UIHandler {
    static setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remover clase activa de todos los links
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Agregar clase activa al link clickeado
                this.classList.add('active');
                
                // Desplazamiento suave a la sección
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    static setupPrintButton() {
        document.getElementById('print-btn').addEventListener('click', function() {
            window.print();
        });
    }

    static setupRetryButton() {
        document.getElementById('retry-btn').addEventListener('click', function() {
            ContentLoader.loadDocumentation();
        });
    }
}