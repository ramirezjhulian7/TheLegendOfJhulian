// ============================================
// BossScene.js
// Reusable boss arena scene
// Receives config via scene init data
// ============================================

class BossScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BossScene' });
    }

    init(data) {
        this.bossConfig = data.bossConfig || {
            name: 'Jefe',
            health: 15,
            speed: 70,
            damage: 2,
            pattern: 'charge',
            color: 0x9944cc,
            size: 64
        };
        this.winMessage = data.winMessage || ['¡Victoria!'];
        this.nextScene = data.nextScene || 'TitleScene';
        this.bgColor = data.bgColor || '#1a1a2a';
        this.arenaColor = data.arenaColor || 0x1a1a2a;
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(600);
        this.cameras.main.setBackgroundColor(this.bgColor);

        // --- Touch Controls ---
        this.touchControls = new TouchControls(this);

        // --- Arena border ---
        const arena = this.add.graphics();
        arena.lineStyle(3, 0x7744aa, 0.6);
        arena.strokeRect(40, 40, width - 80, height - 120);
        // Arena floor
        arena.fillStyle(this.arenaColor, 0.5);
        arena.fillRect(40, 40, width - 80, height - 120);
        arena.setDepth(0);

        // Corner accents
        const accentSize = 12;
        const corners = [
            [40, 40], [width - 40, 40],
            [40, height - 80], [width - 40, height - 80]
        ];
        for (const [cx, cy] of corners) {
            arena.fillStyle(0x9944cc, 0.4);
            arena.fillRect(cx - accentSize / 2, cy - accentSize / 2, accentSize, accentSize);
        }

        // --- Player ---
        this.player = new Player(this, 100, height / 2 - 30);
        this.player.sprite.body.setBoundsRectangle(new Phaser.Geom.Rectangle(45, 45, width - 90, height - 130));

        // --- HUD ---
        this.hud = new HUD(this, this.player.maxHealth);
        this.hud.setMission('⚔ ' + this.bossConfig.name);

        // --- Dialogue ---
        this.dialogueManager = new DialogueManager(this);

        // --- Boss ---
        this.boss = new Boss(this, width - 150, height / 2 - 30, this.bossConfig);

        // --- Collisions ---
        // Player vs Boss (contact damage)
        this.physics.add.overlap(this.player.sprite, this.boss.sprite, () => {
            if (this.boss.alive) {
                this.player.takeDamage(this.boss.damage);
            }
        });

        // Player attack vs Boss
        this.events.on('playerAttack', (hitbox) => {
            this.physics.add.overlap(hitbox, this.boss.sprite, () => {
                if (this.boss.alive) {
                    this.boss.takeDamage(2);
                }
            });
        });

        // --- Events ---
        this.events.on('playerDamaged', (hp) => {
            this.hud.setHealth(hp);
        });

        this.events.on('playerDied', () => {
            this.scene.start('GameOverScene', { restartScene: 'BossScene', bossData: this.scene.settings.data });
        });

        this.events.on('bossDefeated', () => {
            // Victory!
            // Grant extra heart (increase maxHealth by 2)
            const currentMax = this.registry.get('maxHealth') || 6;
            this.registry.set('maxHealth', currentMax + 2);

            this.time.delayedCall(1000, () => {
                this.dialogueManager.show('✨', this.winMessage, () => {
                    this.cameras.main.fadeOut(1000, 0, 0, 0);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start(this.nextScene);
                    });
                });
            });
        });

        // --- Boss entrance dialogue ---
        this.time.delayedCall(500, () => {
            this.dialogueManager.show('', [
                '¡' + this.bossConfig.name + ' aparece!',
                '¡Prepárate para la batalla!'
            ]);
        });
    }

    update(time) {
        if (this.dialogueManager.isActive) return;

        this.player.update(time);
        this.boss.update(time, this.player);
    }
}
