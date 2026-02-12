// ============================================
// HUD.js
// Heads-Up Display: hearts and mission title
// ============================================

class HUD {
    constructor(scene, maxHealth) {
        this.scene = scene;
        this.maxHealth = maxHealth || 6;
        this.currentHealth = this.maxHealth;
        this.heartsGraphics = null;
        this.missionText = null;

        this._create();
    }

    _create() {
        // Hearts container
        this.heartsGraphics = this.scene.add.graphics();
        this.heartsGraphics.setScrollFactor(0);
        this.heartsGraphics.setDepth(100);

        // Mission title
        this.missionText = this.scene.add.text(400, 16, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ccbbee',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.missionText.setOrigin(0.5, 0);
        this.missionText.setScrollFactor(0);
        this.missionText.setDepth(100);

        this._drawHearts();
    }

    setMission(text) {
        this.missionText.setText(text);
    }

    setHealth(hp) {
        this.currentHealth = Math.max(0, Math.min(hp, this.maxHealth));
        this._drawHearts();
    }

    _drawHearts() {
        this.heartsGraphics.clear();
        const totalHearts = this.maxHealth / 2; // Each heart = 2 HP
        const startX = 24;
        const startY = 22;
        const spacing = 28;
        const heartSize = 12;

        for (let i = 0; i < totalHearts; i++) {
            const hpForThisHeart = (i + 1) * 2;
            const filled = this.currentHealth >= hpForThisHeart;
            const halfFilled = !filled && this.currentHealth >= hpForThisHeart - 1;

            if (filled) {
                GraphicsFactory.drawHeart(this.heartsGraphics, startX + i * spacing, startY, heartSize, true);
            } else if (halfFilled) {
                // Draw half heart
                GraphicsFactory.drawHeart(this.heartsGraphics, startX + i * spacing, startY, heartSize, true);
                // Overwrite right half with empty
                this.heartsGraphics.fillStyle(0x333355, 1);
                this.heartsGraphics.fillRect(startX + i * spacing, startY - heartSize, heartSize, heartSize * 2);
            } else {
                GraphicsFactory.drawHeart(this.heartsGraphics, startX + i * spacing, startY, heartSize, false);
            }
        }
    }

    destroy() {
        if (this.heartsGraphics) this.heartsGraphics.destroy();
        if (this.missionText) this.missionText.destroy();
    }
}
