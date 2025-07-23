class Utils {
    static formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-AR', options);
    }

    static showElement(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    static hideElement(id) {
        document.getElementById(id).classList.add('hidden');
    }

    static async fetchWithTimeout(resource, options = {}) {
        const { timeout = 5000 } = options;
        
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal  
        });
        
        clearTimeout(id);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
    }
}