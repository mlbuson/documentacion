document.addEventListener('DOMContentLoaded', function() {
    // Elementos de la UI
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const closeBtn = document.getElementById('close-editor');
    const previewBtn = document.getElementById('preview-btn');
    const contentContainer = document.getElementById('content-container');
    const editorContainer = document.getElementById('editor-container');
    const contentEditor = document.getElementById('content-editor');
    const lastUpdateSpan = document.getElementById('last-update');

    // Cargar contenido inicial
    function loadContent() {
        fetch('content.json')
            .then(response => response.json())
            .then(data => {
                renderContent(data);
                contentEditor.value = JSON.stringify(data, null, 2);
                updateLastModified();
            })
            .catch(error => {
                console.error('Error cargando contenido:', error);
                contentContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Error cargando la documentación</h3>
                        <p>${error.message}</p>
                    </div>
                `;
            });
    }

    // Renderizar el contenido
    function renderContent(data) {
        let html = '';
        
        data.sections.forEach((section, index) => {
            html += `
                <div class="section-card" id="section-${index}">
                    <div class="section-header">
                        <h2>${section.title}</h2>
                        <span class="section-number">Paso ${index + 1}</span>
                    </div>
                    <div class="section-body">
                        ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
                        
                        ${section.steps ? `
                            <ol class="step-list">
                                ${section.steps.map(step => `
                                    <li class="step-item">
                                        ${step.text}
                                        ${step.image ? `
                                            <div class="step-image-container">
                                                <img src="assets/img/${step.image}" alt="${step.alt || ''}" class="step-img">
                                                ${step.caption ? `<p class="image-caption">${step.caption}</p>` : ''}
                                            </div>
                                        ` : ''}
                                    </li>
                                `).join('')}
                            </ol>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        contentContainer.innerHTML = html;
    }

    // Actualizar fecha de última modificación
    function updateLastModified() {
        fetch('content.json', { method: 'HEAD' })
            .then(response => {
                const lastModified = new Date(response.headers.get('Last-Modified'));
                lastUpdateSpan.textContent = lastModified.toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            });
    }

    // Event Listeners
    editBtn.addEventListener('click', function() {
        editorContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', function() {
        editorContainer.classList.add('hidden');
        document.body.style.overflow = '';
    });

    saveBtn.addEventListener('click', function() {
        try {
            const updatedContent = JSON.parse(contentEditor.value);
            
            fetch('/.netlify/functions/save-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: updatedContent })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderContent(updatedContent);
                    editorContainer.classList.add('hidden');
                    document.body.style.overflow = '';
                    updateLastModified();
                    
                    // Mostrar notificación de éxito
                    showNotification('Cambios guardados correctamente', 'success');
                } else {
                    throw new Error(data.message || 'Error al guardar');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification(`Error: ${error.message}`, 'error');
            });
        } catch (e) {
            showNotification('Error en el formato JSON: ' + e.message, 'error');
        }
    });

    previewBtn.addEventListener('click', function() {
        try {
            const previewContent = JSON.parse(contentEditor.value);
            renderContent(previewContent);
            showNotification('Vista previa actualizada', 'info');
        } catch (e) {
            showNotification('Error en el formato JSON: ' + e.message, 'error');
        }
    });

    // Mostrar notificaciones
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Inicializar
    loadContent();
});