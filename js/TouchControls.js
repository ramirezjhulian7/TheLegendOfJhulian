// ============================================
// TouchControls.js
// On-screen controls for mobile/touch devices
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

        // Detect touch support: mobile OS OR touch events available
        const isMobile = !scene.sys.game.device.os.desktop;
        const hasTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

        if (isMobile || hasTouch) {
            this.createControls();
        }
    }

    createControls() {
        const { width, height } = this.scene.cameras.main;
        const padX = 90;
        const padY = height - 90;
        const btnX = width - 80;
        const btnY = height - 90;
        const btnRadius = 30;
        const dpadSpacing = 55;

        // --- D-PAD ---
        this._createButton(padX - dpadSpacing, padY, btnRadius, '◀', () => this.left = true, () => this.left = false, 0xffffff);
        this._createButton(padX + dpadSpacing, padY, btnRadius, '▶', () => this.right = true, () => this.right = false, 0xffffff);
        this._createButton(padX, padY - dpadSpacing, btnRadius, '▲', () => this.up = true, () => this.up = false, 0xffffff);
        this._createButton(padX, padY + dpadSpacing, btnRadius, '▼', () => this.down = true, () => this.down = false, 0xffffff);

        // --- ACTION BUTTONS ---
        // Attack (⚔) - Big red button
        this._createButton(btnX, btnY, btnRadius + 8, '⚔', () => this.attack = true, () => this.attack = false, 0xff4444);

        // Interact (E) - Green button above attack
        this._createButton(btnX, btnY - 85, btnRadius, 'E', () => this.interact = true, () => this.interact = false, 0x44ff44);
    }

    _createButton(x, y, radius, label, onDown, onUp, tint = 0xffffff) {
        // Container fixed to camera
        const btn = this.scene.add.container(x, y);
        btn.setScrollFactor(0);
        btn.setDepth(200);

        // Circle background
        const circle = this.scene.add.graphics();
        circle.fillStyle(tint, 0.2);
        circle.fillCircle(0, 0, radius);
        circle.lineStyle(2, tint, 0.5);
        circle.strokeCircle(0, 0, radius);

        // Label text
        const text = this.scene.add.text(0, 0, label, {
            fontFamily: '"Press Start 2P"',
            fontSize: Math.max(12, radius * 0.6) + 'px',
            color: '#ffffff'
        });
        text.setOrigin(0.5);
        text.setAlpha(0.7);

        btn.add([circle, text]);

        // Interactive zone (bigger than visible for easier tapping)
        const zone = this.scene.add.zone(x, y, radius * 2.8, radius * 2.8);
        zone.setScrollFactor(0);
        zone.setDepth(201);
        zone.setInteractive();

        zone.on('pointerdown', () => {
            circle.clear();
            circle.fillStyle(tint, 0.5);
            circle.fillCircle(0, 0, radius);
            circle.lineStyle(2, tint, 0.9);
            circle.strokeCircle(0, 0, radius);
            text.setAlpha(1);
            onDown();
        });

        zone.on('pointerup', () => {
            circle.clear();
            circle.fillStyle(tint, 0.2);
            circle.fillCircle(0, 0, radius);
            circle.lineStyle(2, tint, 0.5);
            circle.strokeCircle(0, 0, radius);
            text.setAlpha(0.7);
            onUp();
        });

        zone.on('pointerout', () => {
            circle.clear();
            circle.fillStyle(tint, 0.2);
            circle.fillCircle(0, 0, radius);
            circle.lineStyle(2, tint, 0.5);
            circle.strokeCircle(0, 0, radius);
            text.setAlpha(0.7);
            onUp();
        });
    }
}
