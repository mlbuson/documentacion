class PrintManager {
    static init() {
        // Configurar estilos específicos para impresión
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                body {
                    font-size: 12pt;
                    line-height: 1.5;
                    color: #000;
                    background: none;
                }
                
                .main-header, .main-nav, .main-footer, .no-print {
                    display: none !important;
                }
                
                .container {
                    width: 100%;
                    padding: 0;
                }
                
                .doc-section {
                    page-break-inside: avoid;
                    margin-bottom: 20pt;
                }
                
                h1, h2, h3 {
                    page-break-after: avoid;
                }
                
                img {
                    max-width: 100% !important;
                    height: auto !important;
                }
                
                .step-image {
                    page-break-inside: avoid;
                }
                
                .print-footer {
                    display: block;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-size: 10pt;
                    border-top: 1pt solid #ddd;
                    padding-top: 5pt;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Agregar footer para impresión
        window.addEventListener('beforeprint', () => {
            const printFooter = document.createElement('div');
            printFooter.className = 'print-footer';
            printFooter.innerHTML = `
                Documentación JBoss - Cablevisión | 
                Versión: ${document.getElementById('doc-version').textContent} | 
                Impreso el: ${new Date().toLocaleDateString('es-AR')} | 
                Página <span class="page-number"></span>
            `;
            document.body.appendChild(printFooter);
        });
        
        window.addEventListener('afterprint', () => {
            const footer = document.querySelector('.print-footer');
            if (footer) footer.remove();
        });
    }
}

// Inicializar al cargar
PrintManager.init();