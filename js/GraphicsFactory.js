// ============================================
// GraphicsFactory.js
// Creates placeholder graphic entities.
// Swap these methods to load sprites later.
// ============================================

class GraphicsFactory {

    /**
     * Create the player (Dani) using sprite sheet
     */
    static createPlayer(scene, x, y) {
        // Start with idle texture
        const sprite = scene.physics.add.sprite(x, y, 'dani_idle', 0);
        sprite.setDepth(10);
        sprite.setCollideWorldBounds(true);
        // Smaller hitbox at feet for better collision feel
        sprite.body.setSize(20, 16);
        sprite.body.setOffset(22, 44);
        return sprite;
    }

    /**
     * Create an enemy placeholder or sprite
     */
    static createEnemy(scene, x, y, config = {}) {
        const size = config.size || 28;
        const color = config.color || 0x4444ff;
        const type = config.type || 'generic';

        if (type === 'bat') {
            const sprite = scene.physics.add.sprite(x, y, 'enemy_bat');
            sprite.setDisplaySize(size * 1.5, size * 1.5);
            sprite.body.setSize(size, size);
            // Slight hover animation
            scene.tweens.add({
                targets: sprite,
                y: y - 5,
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            return sprite;
        }

        const gfx = scene.add.graphics();
        gfx.fillStyle(color, 1);
        gfx.fillRoundedRect(-size / 2, -size / 2, size, size, 3);
        // Eyes
        gfx.fillStyle(0xffffff, 0.8);
        gfx.fillCircle(-5, -4, 3);
        gfx.fillCircle(5, -4, 3);
        gfx.fillStyle(0x000000, 1);
        gfx.fillCircle(-5, -4, 1.5);
        gfx.fillCircle(5, -4, 1.5);

        const container = scene.add.container(x, y, [gfx]);
        scene.physics.add.existing(container);
        container.body.setSize(size, size);
        container.body.setOffset(-size / 2, -size / 2);
        container.body.setCollideWorldBounds(true);
        return container;
    }

    /**
     * Create a boss placeholder — large purple square
     */
    /**
     * Create a boss with unique visuals based on type
     */
    static createBoss(scene, x, y, config = {}) {
        const size = config.size || 64;
        const color = config.color || 0x9944cc;
        const type = config.type || 'generic';

        if (type === 'slime') {
            const sprite = scene.physics.add.sprite(x, y, 'boss_slime');
            sprite.setDisplaySize(size * 1.2, size * 1.2);
            sprite.body.setSize(size, size);
            // Pulse animation
            scene.tweens.add({
                targets: sprite,
                scaleX: { from: sprite.scaleX, to: sprite.scaleX * 1.1 },
                scaleY: { from: sprite.scaleY, to: sprite.scaleY * 0.9 },
                duration: 800,
                yoyo: true,
                repeat: -1
            });
            return sprite;
        }

        const container = scene.add.container(x, y);
        const gfx = scene.add.graphics();
        container.add(gfx);

        switch (type) {
            case 'slime': // Forest Boss
                // Green, blobby shape
                gfx.fillStyle(0x44aa44, 1);
                gfx.fillCircle(0, 0, size / 2);
                gfx.fillStyle(0x66cc66, 0.8);
                gfx.fillCircle(-size / 4, -size / 4, size / 6); // Highlight
                // Core
                gfx.fillStyle(0x228822, 1);
                gfx.fillCircle(0, 0, size / 4);
                // Eyes
                gfx.fillStyle(0xffff00, 1);
                gfx.fillCircle(-10, -5, 4);
                gfx.fillCircle(10, -5, 4);
                gfx.fillStyle(0x000000, 1);
                gfx.fillCircle(-10, -5, 1.5);
                gfx.fillCircle(10, -5, 1.5);
                break;

            case 'ice': // Ice Boss
                // Cyan, crystal/spiky shape
                gfx.fillStyle(0x44ccff, 0.8);
                gfx.beginPath();
                gfx.moveTo(0, -size / 2 - 10); // Top
                gfx.lineTo(size / 2 + 5, 0);   // Right
                gfx.lineTo(0, size / 2 + 10);  // Bottom
                gfx.lineTo(-size / 2 - 5, 0);  // Left
                gfx.closePath();
                gfx.fillPath();
                gfx.lineStyle(3, 0xffffff, 0.8);
                gfx.strokePath();
                // Inner cold
                gfx.fillStyle(0xffffff, 0.5);
                gfx.fillCircle(0, 0, size / 3);
                // Eyes (cold blue)
                gfx.fillStyle(0x000055, 1);
                gfx.fillCircle(-10, -5, 4);
                gfx.fillCircle(10, -5, 4);
                break;

            case 'fire': // Fire Boss
                // Red/Orange, pulsating core look
                gfx.fillStyle(0xff4422, 1);
                // Draw a star/flame shape
                const points = [
                    { x: 0, y: -size / 1.5 }, { x: size / 4, y: -size / 4 },
                    { x: size / 1.5, y: -size / 4 }, { x: size / 3, y: size / 4 },
                    { x: size / 2, y: size / 1.5 }, { x: 0, y: size / 2 },
                    { x: -size / 2, y: size / 1.5 }, { x: -size / 3, y: size / 4 },
                    { x: -size / 1.5, y: -size / 4 }, { x: -size / 4, y: -size / 4 }
                ];
                gfx.fillPoints(points, true);

                // Inner heat
                gfx.fillStyle(0xffaa00, 0.8);
                gfx.fillCircle(0, 0, size / 3);
                // Eyes (burning)
                gfx.fillStyle(0xffff00, 1);
                gfx.fillCircle(-8, 0, 5);
                gfx.fillCircle(8, 0, 5);
                break;

            default: // Generic purple square (fallback)
                gfx.fillStyle(color, 1);
                gfx.fillRoundedRect(-size / 2, -size / 2, size, size, 6);
                gfx.lineStyle(2, 0xcc66ff, 0.6);
                gfx.strokeRoundedRect(-size / 2 - 2, -size / 2 - 2, size + 4, size + 4, 8);
                gfx.fillStyle(0xff0000, 0.9);
                gfx.fillCircle(-12, -8, 5);
                gfx.fillCircle(12, -8, 5);
                gfx.fillStyle(0xffff00, 1);
                gfx.fillCircle(-12, -8, 2.5);
                gfx.fillCircle(12, -8, 2.5);
                break;
        }

        scene.physics.add.existing(container);
        container.body.setSize(size, size);
        container.body.setOffset(-size / 2, -size / 2);
        container.body.setCollideWorldBounds(true);
        return container;
    }

    /**
     * Create Jhulian placeholder — green square
     */
    static createJhulian(scene, x, y) {
        const size = 32;
        const gfx = scene.add.graphics();
        gfx.fillStyle(0x44cc44, 1);
        gfx.fillRoundedRect(-size / 2, -size / 2, size, size, 4);
        // Heart on chest
        gfx.fillStyle(0xff4444, 1);
        gfx.fillCircle(-3, 2, 3);
        gfx.fillCircle(3, 2, 3);
        gfx.fillTriangle(-6, 3, 6, 3, 0, 9);

        const container = scene.add.container(x, y, [gfx]);
        scene.physics.add.existing(container);
        container.body.setSize(size, size);
        container.body.setOffset(-size / 2, -size / 2);
        container.body.setImmovable(true);
        return container;
    }

    /**
     * Create NPC placeholder or sprite
     */
    static createNPC(scene, x, y, config = {}) {
        const type = config.type || 'generic';

        if (type === 'echo') {
            const sprite = scene.physics.add.sprite(x, y, 'npc_echo');
            sprite.setDisplaySize(32, 32);
            sprite.body.setSize(24, 24);
            // Floating animation
            scene.tweens.add({
                targets: sprite,
                y: y - 5,
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            sprite.body.setImmovable(true);
            return sprite;
        }

        const size = 28;
        const gfx = scene.add.graphics();
        gfx.fillStyle(0xffcc44, 1);
        gfx.fillRoundedRect(-size / 2, -size / 2, size, size, 3);
        // Friendly face
        gfx.fillStyle(0x000000, 1);
        gfx.fillCircle(-5, -4, 2);
        gfx.fillCircle(5, -4, 2);
        // Smile
        gfx.lineStyle(1.5, 0x000000, 1);
        gfx.beginPath();
        gfx.arc(0, 1, 6, 0, Math.PI, false);
        gfx.strokePath();

        const container = scene.add.container(x, y, [gfx]);
        scene.physics.add.existing(container);
        container.body.setSize(size, size);
        container.body.setOffset(-size / 2, -size / 2);
        container.body.setImmovable(true);
        return container;
    }

    /**
     * Create a sword attack hitbox
     */
    static createSwordHitbox(scene, x, y, direction) {
        const width = 38;
        const height = 14;
        const gfx = scene.add.graphics();
        gfx.fillStyle(0xffffff, 0.7);

        let offsetX = 0, offsetY = 0;
        let w = width, h = height;

        switch (direction) {
            case 'right':
                offsetX = 20; offsetY = 0;
                break;
            case 'left':
                offsetX = -20; offsetY = 0;
                break;
            case 'down':
                offsetX = 0; offsetY = 20;
                w = height; h = width;
                break;
            case 'up':
                offsetX = 0; offsetY = -20;
                w = height; h = width;
                break;
        }

        gfx.fillRoundedRect(-w / 2, -h / 2, w, h, 2);

        const container = scene.add.container(x + offsetX, y + offsetY, [gfx]);
        scene.physics.add.existing(container);
        container.body.setSize(w, h);
        container.body.setOffset(-w / 2, -h / 2);
        container.body.setImmovable(true);
        container.setDepth(11);

        // Flash effect
        scene.tweens.add({
            targets: gfx,
            alpha: { from: 0.9, to: 0 },
            duration: 150,
            onComplete: () => container.destroy()
        });

        return container;
    }

    /**
     * Create a heart icon for HUD
     */
    static drawHeart(graphics, x, y, size, filled) {
        graphics.fillStyle(filled ? 0xff2255 : 0x333355, 1);
        graphics.fillCircle(x - size * 0.3, y - size * 0.2, size * 0.4);
        graphics.fillCircle(x + size * 0.3, y - size * 0.2, size * 0.4);
        graphics.fillTriangle(
            x - size * 0.65, y,
            x + size * 0.65, y,
            x, y + size * 0.6
        );
        if (filled) {
            graphics.lineStyle(1, 0xff5577, 0.5);
            graphics.strokeCircle(x - size * 0.3, y - size * 0.2, size * 0.4);
            graphics.strokeCircle(x + size * 0.3, y - size * 0.2, size * 0.4);
        }
    }

    /**
     * Create decorative tree (for forest level)
     */
    static createTree(scene, x, y) {
        const gfx = scene.add.graphics();
        // Trunk
        gfx.fillStyle(0x5c3a1e, 1);
        gfx.fillRect(-4, 0, 8, 16);
        // Canopy
        gfx.fillStyle(0x2d7a3a, 1);
        gfx.fillCircle(0, -6, 16);
        gfx.fillStyle(0x3a9e4a, 0.7);
        gfx.fillCircle(-5, -10, 10);
        gfx.fillCircle(6, -8, 11);

        const container = scene.add.container(x, y, [gfx]);
        scene.physics.add.existing(container, true); // static body
        container.body.setSize(16, 16);
        container.body.setOffset(-8, -4);
        container.setDepth(5);
        return container;
    }

    /**
     * Create decorative rock (for cave level)
     */
    static createRock(scene, x, y) {
        const gfx = scene.add.graphics();
        gfx.fillStyle(0x555566, 1);
        gfx.fillCircle(0, 0, 12);
        gfx.fillStyle(0x666677, 1);
        gfx.fillCircle(-3, -3, 8);

        const container = scene.add.container(x, y, [gfx]);
        scene.physics.add.existing(container, true);
        container.body.setSize(20, 20);
        container.body.setOffset(-10, -10);
        container.setDepth(5);
        return container;
    }

    /**
     * Create decorative flower (for final level)
     */
    static createFlower(scene, x, y) {
        const gfx = scene.add.graphics();
        const colors = [0xff6688, 0xffaa44, 0xff44aa, 0xffdd44, 0xff6644];
        const color = colors[Math.floor(Math.random() * colors.length)];
        // Petals
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            gfx.fillStyle(color, 0.9);
            gfx.fillCircle(Math.cos(angle) * 5, Math.sin(angle) * 5, 4);
        }
        // Center
        gfx.fillStyle(0xffee44, 1);
        gfx.fillCircle(0, 0, 3);

        const container = scene.add.container(x, y, [gfx]);
        container.setDepth(1);

        // Gentle sway
        scene.tweens.add({
            targets: container,
            angle: { from: -5, to: 5 },
            duration: 1500 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return container;
    }
}
