// ============================================
// VictoryScene.js
// Final celebration screen
// ============================================

class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(2000, 255, 255, 255);
        this.cameras.main.setBackgroundColor('#0a0a1a');

        // --- Starfield background ---
        for (let i = 0; i < 80; i++) {
            const star = this.add.graphics();
            const size = 0.5 + Math.random() * 2;
            star.fillStyle(0xccccee, 0.3 + Math.random() * 0.7);
            star.fillCircle(0, 0, size);
            star.setPosition(Math.random() * width, Math.random() * height);

            this.tweens.add({
                targets: star,
                alpha: { from: 0.2, to: 0.9 },
                duration: 800 + Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }

        // --- Floating hearts ---
        for (let i = 0; i < 20; i++) {
            const heart = this.add.graphics();
            const heartSize = 4 + Math.random() * 6;
            GraphicsFactory.drawHeart(heart, 0, 0, heartSize, true);
            heart.setPosition(Math.random() * width, height + 50);
            heart.setAlpha(0.4 + Math.random() * 0.4);
            heart.setDepth(2);

            this.tweens.add({
                targets: heart,
                y: -50,
                x: heart.x + (Math.random() - 0.5) * 80,
                duration: 5000 + Math.random() * 5000,
                repeat: -1,
                delay: Math.random() * 4000
            });
        }

        // --- Characters together (using actual sprites) ---
        // Dani
        const dani = this.add.sprite(width / 2 - 40, 220, 'dani_walk', 26);
        dani.setScale(3);
        dani.setDepth(10);
        dani.anims.play('dani-walk-down', true);

        // Jhulian
        const jhulian = this.add.sprite(width / 2 + 40, 220, 'jhulian_walk', 26);
        jhulian.setScale(3);
        jhulian.setDepth(10);
        jhulian.anims.play('jhulian-walk-down', true);

        // Together bob animation
        this.tweens.add({
            targets: [dani, jhulian],
            y: 215,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Heart between them
        const bigHeart = this.add.graphics();
        GraphicsFactory.drawHeart(bigHeart, 0, 0, 10, true);
        bigHeart.setPosition(width / 2, 195);
        bigHeart.setDepth(11);

        this.tweens.add({
            targets: bigHeart,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // --- Messages ---
        const messageLine1 = this.add.text(width / 2, 300, 'Juntos, cualquier carga', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#cc88ff',
            stroke: '#220044',
            strokeThickness: 3,
            align: 'center'
        });
        messageLine1.setOrigin(0.5);
        messageLine1.setAlpha(0);

        const messageLine2 = this.add.text(width / 2, 325, 'es más ligera.', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#cc88ff',
            stroke: '#220044',
            strokeThickness: 3,
            align: 'center'
        });
        messageLine2.setOrigin(0.5);
        messageLine2.setAlpha(0);

        const loveText = this.add.text(width / 2, 370, 'Te amo.', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ff6688',
            stroke: '#330022',
            strokeThickness: 3
        });
        loveText.setOrigin(0.5);
        loveText.setAlpha(0);

        const anniText = this.add.text(width / 2, 405, 'Feliz Aniversario 💜', {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#ffcc88',
            stroke: '#332200',
            strokeThickness: 3
        });
        anniText.setOrigin(0.5);
        anniText.setAlpha(0);

        // Sequenced fade-in
        this.tweens.add({ targets: messageLine1, alpha: 1, duration: 1500, delay: 1500 });
        this.tweens.add({ targets: messageLine2, alpha: 1, duration: 1500, delay: 2500 });
        this.tweens.add({ targets: loveText, alpha: 1, duration: 1500, delay: 4000 });
        this.tweens.add({
            targets: anniText,
            alpha: 1,
            duration: 1500,
            delay: 5500
        });

        // Pulsing love text
        this.time.delayedCall(5500, () => {
            this.tweens.add({
                targets: loveText,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // --- Credits / thanks ---
        const thanksText = this.add.text(width / 2, 490, 'Gracias por jugar', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#667788'
        });
        thanksText.setOrigin(0.5);
        thanksText.setAlpha(0);

        this.tweens.add({ targets: thanksText, alpha: 0.7, duration: 1500, delay: 7000 });

        // --- Restart option ---
        const hasTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
        const restartMsg = hasTouch ? 'Toca para jugar de nuevo' : 'Presiona ENTER para jugar de nuevo';
        const restartText = this.add.text(width / 2, 550, restartMsg, {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#556677'
        });
        restartText.setOrigin(0.5);
        restartText.setAlpha(0);

        this.tweens.add({
            targets: restartText,
            alpha: 0.5,
            duration: 1500,
            delay: 8000,
            onComplete: () => {
                this.tweens.add({
                    targets: restartText,
                    alpha: { from: 0.3, to: 0.6 },
                    duration: 800,
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        let restarted = false;
        const doRestart = () => {
            if (restarted) return;
            restarted = true;
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('TitleScene');
            });
        };
        this.input.keyboard.on('keydown-ENTER', doRestart);
        this.input.on('pointerdown', doRestart);
    }
}
