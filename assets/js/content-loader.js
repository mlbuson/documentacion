class ContentLoader {
    static async loadDocumentation() {
        try {
            Utils.showElement('content-loading');
            Utils.hideElement('error-message');
            
            const response = await Utils.fetchWithTimeout('content.json');
            const data = await response.json();
            
            this.renderContent(data);
            this.updateMetadata(data);
            
            Utils.hideElement('content-loading');
            Utils.showElement('documentation-content');
        } catch (error) {
            console.error('Error loading documentation:', error);
            Utils.hideElement('content-loading');
            Utils.showElement('error-message');
            document.getElementById('error-details').textContent = error.message;
        }
    }

    static renderContent(data) {
        const container = document.getElementById('documentation-content');
        let html = '';
        
        // Renderizar cada sección
        data.sections.forEach((section, index) => {
            html += this.renderSection(section, index);
        });
        
        // Renderizar apéndice
        if (data.appendix) {
            html += this.renderAppendix(data.appendix);
        }
        
        container.innerHTML = html;
    }

    static renderSection(section, index) {
        return `
            <section id="section-${index}" class="doc-section">
                <div class="section-header">
                    <h2>${section.title}</h2>
                    ${section.critical ? '<span class="badge critical"><i class="fas fa-exclamation-triangle"></i> Crítico</span>' : ''}
                    ${section.emergency ? '<span class="badge emergency"><i class="fas fa-ambulance"></i> Emergencia</span>' : ''}
                </div>
                
                <div class="section-body">
                    ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
                    
                    ${this.renderSteps(section.steps)}
                    
                    ${section.note ? `<div class="note-box"><i class="fas fa-info-circle"></i> ${section.note}</div>` : ''}
                    ${section.warning ? `<div class="warning-box"><i class="fas fa-exclamation-triangle"></i> ${section.warning}</div>` : ''}
                </div>
            </section>
        `;
    }

    static renderSteps(steps) {
        if (!steps || steps.length === 0) return '';
        
        return `
            <div class="steps-container">
                ${steps.map(step => this.renderStep(step)).join('')}
            </div>
        `;
    }

    static renderStep(step) {
        return `
            <div class="step">
                <div class="step-header">
                    <span class="step-number">${step.number}</span>
                    <h3 class="step-title">${step.text}</h3>
                </div>
                
                <div class="step-content">
                    ${step.details ? `<p class="step-details">${typeof step.details === 'object' ? this.renderObjectDetails(step.details) : step.details}</p>` : ''}
                    
                    ${step.items ? `<ul class="step-items">${step.items.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
                    
                    ${step.substeps ? `<ol class="substeps">${step.substeps.map(substep => `<li>${substep}</li>`).join('')}</ol>` : ''}
                    
                    ${step.image ? `
                        <div class="step-image">
                            <img src="assets/img/${step.image}" alt="${step.alt || ''}" loading="lazy">
                            ${step.caption ? `<p class="image-caption">${step.caption}</p>` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    static renderObjectDetails(obj) {
        return Object.entries(obj).map(([key, value]) => 
            `<strong>${key}:</strong> ${value}`
        ).join('<br>');
    }

    static renderAppendix(appendix) {
        return `
            <section id="appendix" class="appendix-section">
                <h2><i class="fas fa-book"></i> Apéndice</h2>
                
                ${appendix.contact ? `
                    <div class="appendix-block">
                        <h3><i class="fas fa-address-card"></i> Contacto</h3>
                        <div class="contact-grid">
                            ${Object.entries(appendix.contact).map(([type, value]) => `
                                <div class="contact-item">
                                    <span class="contact-type">${type}:</span>
                                    <span class="contact-value">${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${appendix.references ? `
                    <div class="appendix-block">
                        <h3><i class="fas fa-link"></i> Referencias</h3>
                        <ul class="references-list">
                            ${appendix.references.map(ref => `<li>${ref}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </section>
        `;
    }

    static updateMetadata(data) {
        if (data.metadata) {
            if (data.metadata.version) {
                document.getElementById('doc-version').textContent = data.metadata.version;
            }
            
            if (data.metadata.lastUpdated) {
                document.getElementById('doc-date').textContent = Utils.formatDate(data.metadata.lastUpdated);
            }
        }
    }
}