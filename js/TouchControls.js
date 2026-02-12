// ============================================
// TouchControls.js
// On-screen controls for mobile devices
// D-pad on left, Action buttons on right
// ============================================

class TouchControls {
    constructor(scene) {
        this.scene = scene;

        // Input state
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.attack = false;
        this.interact = false;

        // Check if touch is supported/active
        if (this.scene.sys.game.device.os.desktop === false || this.scene.sys.game.config.input.activePointers > 1) {
            this.createControls();
        }
    }

    createControls() {
        const { width, height } = this.scene.cameras.main;
        const padX = 80;
        const padY = height - 80;
        const btnX = width - 80;
        const btnY = height - 80;
        const radius = 35;
        const color = 0xffffff;
        const alpha = 0.3;

        // --- D-PAD ---

        // Left
        this._createButton(padX - 50, padY, radius, '⬅', () => this.left = true, () => this.left = false);
        // Right
        this._createButton(padX + 50, padY, radius, '➡', () => this.right = true, () => this.right = false);
        // Up
        this._createButton(padX, padY - 50, radius, '⬆', () => this.up = true, () => this.up = false);
        // Down
        this._createButton(padX, padY + 50, radius, '⬇', () => this.down = true, () => this.down = false);

        // --- ACTION BUTTONS ---

        // Attack (Space) - Big button
        this._createButton(btnX, btnY, radius + 10, '⚔', () => this.attack = true, () => this.attack = false, 0xff4444);

        // Interact (E) - Smaller button above
        this._createButton(btnX - 10, btnY - 90, radius, '✋', () => this.interact = true, () => this.interact = false, 0x44ff44);
    }

    _createButton(x, y, radius, label, onDown, onUp, tint = 0xffffff) {
        const btn = this.scene.add.container(x, y);
        btn.setScrollFactor(0);
        btn.setDepth(100);

        const circle = this.scene.add.graphics();
        circle.fillStyle(tint, 0.3);
        circle.fillCircle(0, 0, radius);
        circle.lineStyle(2, tint, 0.6);
        circle.strokeCircle(0, 0, radius);

        const text = this.scene.add.text(0, 0, label, {
            fontSize: (radius) + 'px',
            color: '#ffffff'
        });
        text.setOrigin(0.5);

        btn.add([circle, text]);

        // Interaction
        const zone = this.scene.add.zone(x, y, radius * 2.5, radius * 2.5); // Larger hit area
        zone.setScrollFactor(0);
        zone.setDepth(101);
        zone.setInteractive();

        zone.on('pointerdown', () => {
            circle.alpha = 0.6;
            onDown();
        });

        zone.on('pointerup', () => {
            circle.alpha = 1;
            onUp();
        });

        zone.on('pointerout', () => {
            circle.alpha = 1;
            onUp();
        });
    }
}
