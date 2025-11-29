
// Custom popup manager
class PopupManager {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        this.createOverlay();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'popup-overlay';
        this.overlay.innerHTML = `
            <div class="popup">
                <button class="popup-close">&times;</button>
                <div class="popup-content"></div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        
        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });

        // Close on X button
        this.overlay.querySelector('.popup-close').addEventListener('click', () => {
            this.hide();
        });
    }

    show(content, options = {}) {
        const popup = this.overlay.querySelector('.popup');
        const popupContent = this.overlay.querySelector('.popup-content');
        
        // Apply custom classes
        popup.className = 'popup';
        if (options.className) {
            popup.classList.add(options.className);
        }
        
        popupContent.innerHTML = content;
        this.overlay.classList.add('active');
        
        // Auto-close if specified
        if (options.autoClose) {
            setTimeout(() => {
                this.hide();
            }, options.autoClose);
        }
    }

    hide() {
        this.overlay.classList.remove('active');
    }

    showLoading(message = 'Loading...') {
        this.show(`
            <div class="popup-icon">
                <div class="loading-spinner"></div>
            </div>
            <h3 class="popup-title">${message}</h3>
            <p>Please wait while we process your request...</p>
        `, { className: 'popup-loading' });
    }

    showSuccess(message, details = '') {
        this.show(`
            <div class="popup-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="popup-title">Success!</h3>
            <p>${message}</p>
            ${details ? `<p class="popup-details">${details}</p>` : ''}
        `, { 
            className: 'popup-success',
            autoClose: 3000 
        });
    }

    showError(message, details = '') {
        this.show(`
            <div class="popup-icon">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h3 class="popup-title">Error</h3>
            <p>${message}</p>
            ${details ? `<p class="popup-details">${details}</p>` : ''}
            <div class="popup-buttons">
                <button class="btn" onclick="popupManager.hide()">OK</button>
            </div>
        `, { className: 'popup-error' });
    }

    showConfirm(message, onConfirm, onCancel = null) {
        this.show(`
            <h3 class="popup-title">Confirm</h3>
            <p>${message}</p>
            <div class="popup-buttons">
                <button class="btn btn-outline" onclick="popupManager.hide(); ${onCancel ? onCancel() : ''}">Cancel</button>
                <button class="btn" onclick="popupManager.hide(); ${onConfirm()}">Confirm</button>
            </div>
        `);
    }
}

// Initialize popup manager
const popupManager = new PopupManager();
