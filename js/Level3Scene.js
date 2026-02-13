// ============================================
// Level3Scene.js
// Misión 3: El Camino al Reencuentro
// Final level — reach Jhulian
// ============================================

class Level3Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3Scene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(1200);

        // --- Touch Controls ---
        this.touchControls = new TouchControls(this);

        // --- Warm meadow background ---
        this.cameras.main.setBackgroundColor('#3a6622');

        // Grass
        for (let i = 0; i < 50; i++) {
            const g = this.add.graphics();
            const colors = [0x4a8832, 0x5a9940, 0x6aaa50];
            g.fillStyle(colors[Math.floor(Math.random() * colors.length)], 0.3 + Math.random() * 0.4);
            g.fillCircle(
                Math.random() * width,
                Math.random() * height,
                6 + Math.random() * 15
            );
            g.setDepth(0);
        }

        // Path (lighter strip going right)
        const path = this.add.graphics();
        path.fillStyle(0xccaa77, 0.3);
        path.fillRect(0, 260, width, 80);
        // Path border lines
        path.lineStyle(1, 0xbb9966, 0.2);
        path.lineBetween(0, 260, width, 260);
        path.lineBetween(0, 340, width, 340);
        path.setDepth(0);

        // --- Flowers everywhere ---
        for (let i = 0; i < 30; i++) {
            const fx = 50 + Math.random() * (width - 100);
            const fy = Math.random() * height;
            // Avoid placing on path
            if (fy > 250 && fy < 350) continue;
            GraphicsFactory.createFlower(this, fx, fy);
        }

        // --- Player ---
        this.player = new Player(this, 60, 300);

        // --- HUD ---
        this.hud = new HUD(this, this.player.maxHealth);
        this.hud.setMission('Misión 3: El Camino al Reencuentro');

        // --- Dialogue Manager ---
        this.dialogueManager = new DialogueManager(this);

        // --- NPCs along the path with uplifting messages ---
        this.npcs = [];

        const npc1 = new NPC(this, 200, 300, {
            name: 'Mariposa de Luz',
            dialogues: [
                'El camino más difícil ya quedó atrás.',
                'Cada paso te acerca a la felicidad.'
            ],
            interactionRange: 55,
            scale: 2.0
        });
        this.npcs.push(npc1);

        const npc2 = new NPC(this, 450, 300, {
            name: 'Brisa Cálida',
            dialogues: [
                'El amor verdadero no conoce distancias...',
                'Ni obstáculos que no pueda superar.'
            ],
            interactionRange: 55,
            scale: 2.0
        });
        this.npcs.push(npc2);

        // --- Jhulian (at the end) — use actual sprite ---
        this.jhulian = this.add.sprite(720, 300, 'jhulian_walk', 26);
        this.jhulian.setScale(2.5);
        this.jhulian.setDepth(10);
        this.jhulian.anims.play('jhulian-idle-down', true);

        // Physics body for overlap detection
        this.physics.add.existing(this.jhulian);
        this.jhulian.body.setImmovable(true);
        this.jhulian.body.setSize(32, 32);

        // Jhulian label
        this.jhulianLabel = this.add.text(720, 255, 'Jhulian', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#44cc44',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.jhulianLabel.setOrigin(0.5);
        this.jhulianLabel.setDepth(20);

        // Jhulian gentle float
        this.tweens.add({
            targets: [this.jhulian, this.jhulianLabel],
            y: '-=3',
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Heart particles around Jhulian
        for (let i = 0; i < 5; i++) {
            const heart = this.add.graphics();
            GraphicsFactory.drawHeart(heart, 0, 0, 6, true);
            heart.setPosition(
                720 + (Math.random() - 0.5) * 60,
                300 + (Math.random() - 0.5) * 60
            );
            heart.setDepth(2);
            heart.setAlpha(0.5);

            this.tweens.add({
                targets: heart,
                y: heart.y - 30,
                alpha: 0,
                duration: 2000 + Math.random() * 1500,
                repeat: -1,
                delay: Math.random() * 2000
            });
        }

        // --- Jhulian overlap detection ---
        this.jhulianZone = this.add.zone(720, 300, 50, 50);
        this.physics.add.existing(this.jhulianZone, true);

        this.meetingTriggered = false;
        this.physics.add.overlap(this.player.sprite, this.jhulianZone, () => {
            if (!this.meetingTriggered) {
                this.meetingTriggered = true;
                this._triggerMeeting();
            }
        });

        // --- Events ---
        this.events.on('playerDamaged', (hp) => {
            this.hud.setHealth(hp);
        });

        // --- Intro dialogue ---
        this.time.delayedCall(500, () => {
            this.dialogueManager.show('', [
                'Misión 3: El Camino al Reencuentro',
                'El sol brilla sobre el prado...',
                'Alguien especial te espera al final del camino.'
            ]);
        });
    }

    _triggerMeeting() {
        this.player.sprite.body.setVelocity(0);

        // Dramatic pause
        this.time.delayedCall(300, () => {
            this.dialogueManager.show('Jhulian', [
                '¡Dani! Sabía que llegarías.',
                'Has cruzado bosques de incertidumbre, cuevas de soledad...',
                'Y aquí estás. Más fuerte que nunca.',
                'Juntos, cualquier carga es más ligera.',
                'Te amo. Feliz Aniversario. 💜'
            ], () => {
                // Transition to victory
                this.cameras.main.fadeOut(1500, 255, 255, 255);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('VictoryScene');
                });
            });
        });
    }

    update(time) {
        if (this.dialogueManager.isActive) return;

        this.player.update(time);

        for (const npc of this.npcs) {
            npc.update(this.player);
        }

        // NPC interaction
        const touch = this.touchControls || {};
        const interactPressed = Phaser.Input.Keyboard.JustDown(this.player.interactKey) || (touch.interact && !this.lastTouchInteract);
        this.lastTouchInteract = touch.interact;

        if (this.player.interactKey && interactPressed) {
            for (const npc of this.npcs) {
                const dist = Phaser.Math.Distance.Between(
                    this.player.sprite.x, this.player.sprite.y,
                    npc.sprite.x, npc.sprite.y
                );
                if (dist < npc.interactionRange) {
                    npc.interact(this.dialogueManager);
                    break;
                }
            }
        }
    }
}
