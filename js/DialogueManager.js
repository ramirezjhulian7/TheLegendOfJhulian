// ============================================
// DialogueManager.js
// DOM-based dialogue system with typewriter effect
// ============================================

class DialogueManager {
    constructor(scene) {
        this.scene = scene;
        this.isActive = false;
        this.messages = [];
        this.currentIndex = 0;
        this.currentChar = 0;
        this.typingSpeed = 30; // ms per character
        this.typingTimer = null;
        this.overlay = null;
        this.onComplete = null;
        this.speakerName = '';
    }

    /**
     * Show a sequence of dialogue messages
     * @param {string} speaker - Speaker name
     * @param {string[]} messages - Array of message strings
     * @param {Function} onComplete - Callback when all messages are done
     */
    show(speaker, messages, onComplete) {
        if (this.isActive) return;

        this.isActive = true;
        this.messages = messages;
        this.currentIndex = 0;
        this.speakerName = speaker;
        this.onComplete = onComplete || null;

        // Pause game physics
        this.scene.physics.pause();

        this._createOverlay();
        this._typeMessage();
    }

    _createOverlay() {
        // Get the game canvas parent
        const container = document.getElementById('game-container');
        if (!container) return;

        this.overlay = document.createElement('div');
        this.overlay.className = 'dialogue-overlay';
        this.overlay.innerHTML = `
            <div class="dialogue-box" id="dialogue-box">
                <div class="speaker-name">${this.speakerName}</div>
                <div class="dialogue-text" id="dialogue-text"></div>
                <div class="dialogue-continue">▼ Click para continuar</div>
            </div>
        `;

        container.appendChild(this.overlay);

        // Click to advance
        this.overlay.addEventListener('click', () => this._advance());

        // Keyboard to advance
        this._keyHandler = (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
                this._advance();
            }
        };
        document.addEventListener('keydown', this._keyHandler);
    }

    _typeMessage() {
        const textEl = document.getElementById('dialogue-text');
        if (!textEl) return;

        const msg = this.messages[this.currentIndex];
        this.currentChar = 0;
        textEl.textContent = '';

        this.typingTimer = setInterval(() => {
            if (this.currentChar < msg.length) {
                textEl.textContent += msg[this.currentChar];
                this.currentChar++;
            } else {
                clearInterval(this.typingTimer);
                this.typingTimer = null;
            }
        }, this.typingSpeed);
    }

    _advance() {
        // If still typing, complete the message instantly
        if (this.typingTimer) {
            clearInterval(this.typingTimer);
            this.typingTimer = null;
            const textEl = document.getElementById('dialogue-text');
            if (textEl) {
                textEl.textContent = this.messages[this.currentIndex];
            }
            return;
        }

        // Next message
        this.currentIndex++;
        if (this.currentIndex < this.messages.length) {
            this._typeMessage();
        } else {
            this._close();
        }
    }

    _close() {
        this.isActive = false;

        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }

        if (this._keyHandler) {
            document.removeEventListener('keydown', this._keyHandler);
            this._keyHandler = null;
        }

        // Resume physics
        this.scene.physics.resume();

        if (this.onComplete) {
            this.onComplete();
        }
    }

    destroy() {
        if (this.typingTimer) clearInterval(this.typingTimer);
        if (this.overlay) this.overlay.remove();
        if (this._keyHandler) {
            document.removeEventListener('keydown', this._keyHandler);
        }
        this.isActive = false;
    }
}
