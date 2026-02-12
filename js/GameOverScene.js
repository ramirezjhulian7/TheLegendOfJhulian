// ============================================
// GameOverScene.js
// Game Over with encouraging retry
// ============================================

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.restartScene = data.restartScene || 'Level1Scene';
        this.bossData = data.bossData || null;
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.setBackgroundColor('#0a0008');

        // Vignette effect
        const vig = this.add.graphics();
        vig.fillStyle(0x220011, 0.5);
        vig.fillRect(0, 0, width, height);

        // --- Falling particles (sadness) ---
        for (let i = 0; i < 15; i++) {
            const p = this.add.graphics();
            p.fillStyle(0x5533aa, 0.4);
            p.fillCircle(0, 0, 1.5 + Math.random() * 2);
            p.setPosition(Math.random() * width, -10);

            this.tweens.add({
                targets: p,
                y: height + 10,
                duration: 3000 + Math.random() * 3000,
                repeat: -1,
                delay: Math.random() * 2000
            });
        }

        // --- Game Over text ---
        const gameOverShadow = this.add.text(width / 2 + 3, height / 2 - 77, 'Game Over', {
            fontFamily: '"Press Start 2P"',
            fontSize: '28px',
            color: '#220011'
        });
        gameOverShadow.setOrigin(0.5);

        const gameOverText = this.add.text(width / 2, height / 2 - 80, 'Game Over', {
            fontFamily: '"Press Start 2P"',
            fontSize: '28px',
            color: '#cc3355',
            stroke: '#440011',
            strokeThickness: 4
        });
        gameOverText.setOrigin(0.5);

        // Pulsing
        this.tweens.add({
            targets: gameOverText,
            alpha: { from: 0.7, to: 1 },
            duration: 1200,
            yoyo: true,
            repeat: -1
        });

        // --- Encouraging message ---
        const encourageText = this.add.text(width / 2, height / 2 - 10, 'No te rindas, Dani.\nCada caída te hace más fuerte.', {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#8866aa',
            align: 'center',
            lineSpacing: 8
        });
        encourageText.setOrigin(0.5);
        encourageText.setAlpha(0);

        this.tweens.add({
            targets: encourageText,
            alpha: 1,
            duration: 1500,
            delay: 800
        });

        // --- Retry prompt ---
        const retryText = this.add.text(width / 2, height / 2 + 80, 'Presiona ENTER para\nintentar de nuevo', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#cc88ff',
            align: 'center',
            lineSpacing: 6
        });
        retryText.setOrigin(0.5);
        retryText.setAlpha(0);

        this.tweens.add({
            targets: retryText,
            alpha: 1,
            duration: 1000,
            delay: 2000,
            onComplete: () => {
                this.tweens.add({
                    targets: retryText,
                    alpha: { from: 0.5, to: 1 },
                    duration: 600,
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        // --- Input ---
        this.input.keyboard.on('keydown-ENTER', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                if (this.restartScene === 'BossScene' && this.bossData) {
                    this.scene.start('BossScene', this.bossData);
                } else {
                    this.scene.start(this.restartScene);
                }
            });
        });
    }
}
