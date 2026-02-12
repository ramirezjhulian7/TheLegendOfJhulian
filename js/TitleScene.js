// ============================================
// TitleScene.js
// Intro / Start screen
// ============================================

class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.cameras.main.setBackgroundColor('#0a0a1a');

        // Animated stars
        this.stars = [];
        for (let i = 0; i < 60; i++) {
            const star = this.add.graphics();
            const size = 1 + Math.random() * 2;
            star.fillStyle(0xaaaacc, 0.3 + Math.random() * 0.7);
            star.fillCircle(0, 0, size);
            star.setPosition(Math.random() * width, Math.random() * height);
            this.stars.push(star);

            this.tweens.add({
                targets: star,
                alpha: { from: 0.2, to: 0.8 },
                duration: 1000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }

        // Floating particles
        for (let i = 0; i < 15; i++) {
            const p = this.add.graphics();
            p.fillStyle(0x7744aa, 0.4);
            p.fillCircle(0, 0, 2 + Math.random() * 3);
            p.setPosition(Math.random() * width, height + 20);

            this.tweens.add({
                targets: p,
                y: -20,
                x: p.x + (Math.random() - 0.5) * 100,
                duration: 4000 + Math.random() * 4000,
                repeat: -1,
                delay: Math.random() * 3000
            });
        }

        // Title
        const titleShadow = this.add.text(width / 2 + 3, 143, 'La Leyenda de\nJhulian', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#220044',
            align: 'center',
            lineSpacing: 12
        });
        titleShadow.setOrigin(0.5);

        const title = this.add.text(width / 2, 140, 'La Leyenda de\nJhulian', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#cc88ff',
            align: 'center',
            lineSpacing: 12,
            stroke: '#4400aa',
            strokeThickness: 3
        });
        title.setOrigin(0.5);

        // Pulsing glow
        this.tweens.add({
            targets: title,
            alpha: { from: 0.85, to: 1 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtitle
        const subtitle = this.add.text(width / 2, 220, 'Una historia de amor y superación', {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#88aacc',
            align: 'center'
        });
        subtitle.setOrigin(0.5);
        subtitle.setAlpha(0);

        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 2000,
            delay: 500
        });

        // Decorative divider
        const divider = this.add.graphics();
        divider.lineStyle(1, 0x7744aa, 0.5);
        divider.lineBetween(width / 2 - 120, 250, width / 2 + 120, 250);

        // Dani character preview
        const daniPreview = this.add.sprite(width / 2 - 40, 310, 'dani_walk', 0);
        daniPreview.setScale(2);
        daniPreview.anims.play('dani-walk-down', true);

        // Jhulian character preview
        const jhulianPreview = this.add.sprite(width / 2 + 40, 310, 'jhulian_walk', 0);
        jhulianPreview.setScale(2);
        jhulianPreview.anims.play('jhulian-walk-down', true);

        this.tweens.add({
            targets: [daniPreview, jhulianPreview],
            y: 305,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Character names
        this.add.text(width / 2 - 40, 345, 'Dani', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ff6644'
        }).setOrigin(0.5);

        this.add.text(width / 2 + 40, 345, 'Jhulian', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#44aa44'
        }).setOrigin(0.5);

        // Controls info
        this.add.text(width / 2, 420, '⬆ ⬇ ⬅ ➡  Mover', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#667788'
        }).setOrigin(0.5);

        this.add.text(width / 2, 445, 'ESPACIO  Atacar    E  Hablar', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#667788'
        }).setOrigin(0.5);

        // Start prompt
        const startText = this.add.text(width / 2, 520, 'Presiona ENTER para comenzar', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#cc88ff'
        });
        startText.setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: { from: 0.3, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Input
        this.input.keyboard.on('keydown-ENTER', () => {
            // Initialize global game state
            this.registry.set('maxHealth', 6);

            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Level1Scene');
            });
        });
    }
}
