// ============================================
// Level2Scene.js
// Misión 2: La Cueva del Aislamiento
// ============================================

class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(800);

        // --- Dark cave background ---
        this.cameras.main.setBackgroundColor('#0a0a15');

        // Cave floor patches
        for (let i = 0; i < 30; i++) {
            const g = this.add.graphics();
            g.fillStyle(0x151520, 0.5 + Math.random() * 0.3);
            g.fillCircle(
                Math.random() * width,
                Math.random() * height,
                10 + Math.random() * 25
            );
            g.setDepth(0);
        }

        // --- Rocks (obstacles) ---
        this.obstacles = this.physics.add.staticGroup();
        const rockPositions = [
            [50, 50], [200, 30], [400, 60], [620, 40], [760, 80],
            [30, 250], [770, 200], [50, 450], [700, 400],
            [30, 560], [300, 570], [500, 560], [760, 550],
            [350, 300], [150, 150]
        ];
        for (const [rx, ry] of rockPositions) {
            const rock = GraphicsFactory.createRock(this, rx, ry);
            this.obstacles.add(rock);
        }

        // --- Vision mask effect (darkness with light around player) ---
        this.darkness = this.add.graphics();
        this.darkness.setDepth(50);

        // --- Player ---
        this.player = new Player(this, 100, 300);
        this.physics.add.collider(this.player.sprite, this.obstacles);

        // --- HUD ---
        this.hud = new HUD(this, this.player.maxHealth);
        this.hud.setMission('Misión 2: La Cueva del Aislamiento');

        // --- Dialogue Manager ---
        this.dialogueManager = new DialogueManager(this);

        // --- NPC ---
        this.npc = new NPC(this, 200, 450, {
            name: 'Eco Amistoso',
            type: 'echo',
            dialogues: [
                'No dejes que el silencio te consuma...',
                'Incluso aquí, en la oscuridad, no estás sola.',
                'Sigue adelante, Dani. La luz te espera.'
            ],
            interactionRange: 55
        });
        this.physics.add.collider(this.npc.sprite, this.obstacles);

        // --- Enemies (faster, more of them) ---
        this.enemies = [];
        this.enemySprites = this.physics.add.group();
        const enemyPositions = [
            [300, 150], [500, 200], [400, 350],
            [600, 250], [350, 500], [550, 450],
            [650, 150], [250, 300]
        ];
        for (const [ex, ey] of enemyPositions) {
            const enemy = new Enemy(this, ex, ey, {
                name: 'Eco del Silencio',
                type: 'bat',
                health: 3,
                speed: 65,
                damage: 1,
                color: 0x2233aa,
                detectionRange: 110,
                size: 24
            });
            this.enemies.push(enemy);
            this.enemySprites.add(enemy.sprite);
            this.physics.add.collider(enemy.sprite, this.obstacles);
        }
        this.enemiesKilled = 0;
        this.totalEnemies = this.enemies.length;

        // --- Exit zone ---
        this.exitZone = this.add.graphics();
        this.exitZone.fillStyle(0x44ff44, 0.15);
        this.exitZone.fillRect(-20, -20, 40, 40);
        this.exitZone.setPosition(750, 300);
        this.exitZone.setDepth(51);
        this.exitZone.setVisible(false);

        this.exitZoneBody = this.add.zone(750, 300, 40, 40);
        this.physics.add.existing(this.exitZoneBody, true);
        this.exitActive = false;

        this.exitArrow = this.add.text(750, 270, '▼', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#44ff44'
        });
        this.exitArrow.setOrigin(0.5);
        this.exitArrow.setVisible(false);
        this.exitArrow.setDepth(52);

        // --- Collisions ---
        this.physics.add.overlap(this.player.sprite, this.enemySprites, (playerSprite, enemySprite) => {
            if (enemySprite.enemyRef && enemySprite.enemyRef.alive) {
                this.player.takeDamage(enemySprite.enemyRef.damage);
            }
        });

        this.physics.add.overlap(this.player.sprite, this.exitZoneBody, () => {
            if (this.exitActive) {
                this._goToBoss();
            }
        });

        // --- Events ---
        this.events.on('playerAttack', (hitbox) => {
            this.physics.add.overlap(hitbox, this.enemySprites, (hb, enemySprite) => {
                if (enemySprite.enemyRef && enemySprite.enemyRef.alive) {
                    enemySprite.enemyRef.takeDamage(2);
                }
            });
        });

        this.events.on('enemyKilled', () => {
            this.enemiesKilled++;
            if (this.enemiesKilled >= Math.ceil(this.totalEnemies * 0.6)) {
                this._openExit();
            }
        });

        this.events.on('playerDamaged', (hp) => {
            this.hud.setHealth(hp);
        });

        this.events.on('playerDied', () => {
            this.scene.start('GameOverScene', { restartScene: 'Level2Scene' });
        });

        // --- Intro dialogue ---
        this.time.delayedCall(500, () => {
            this.dialogueManager.show('', [
                'Misión 2: La Cueva del Aislamiento',
                'Los Ecos del Silencio resuenan en la oscuridad...',
                'Encuentra tu camino a través de las sombras.'
            ]);
        });
    }

    _openExit() {
        if (this.exitActive) return;
        this.exitActive = true;
        this.exitZone.setVisible(true);
        this.exitArrow.setVisible(true);

        this.tweens.add({
            targets: this.exitArrow,
            y: 275,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: this.exitZone,
            alpha: { from: 0.1, to: 0.4 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }

    _goToBoss() {
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('BossScene', {
                bossConfig: {
                    name: 'El Golem de la Tristeza',
                    health: 10,
                    speed: 60,
                    damage: 2,
                    pattern: 'area',
                    color: 0x6633aa,
                    type: 'ice',
                    size: 90
                },
                winMessage: [
                    'Has destruido al Golem de la Tristeza.',
                    'Incluso en los días más oscuros, tu luz interior sigue brillando.',
                    'No tienes que cargar el mundo sola.'
                ],
                nextScene: 'TitleScene', // Loop back to title for now if Level 3 doesn't exist
                bgColor: '#0a0a20',
                arenaColor: 0x0a0a15
            });
        });
    }

    update(time, delta) {
        if (this.dialogueManager.isActive) return;

        this.player.update(time);

        for (const enemy of this.enemies) {
            enemy.update(time, this.player);
        }

        this.npc.update(this.player);

        // NPC interaction
        if (this.player.interactKey && Phaser.Input.Keyboard.JustDown(this.player.interactKey)) {
            const dist = Phaser.Math.Distance.Between(
                this.player.sprite.x, this.player.sprite.y,
                this.npc.sprite.x, this.npc.sprite.y
            );
            if (dist < this.npc.interactionRange) {
                this.npc.interact(this.dialogueManager);
            }
        }

        // --- Darkness / vision effect ---
        this._drawDarkness();
    }

    _drawDarkness() {
        this.darkness.clear();

        const px = this.player.sprite.x;
        const py = this.player.sprite.y;
        const radius = 120;
        const { width, height } = this.cameras.main;

        // Draw dark overlay with a hole around the player
        this.darkness.fillStyle(0x000000, 0.75);

        // Top
        this.darkness.fillRect(0, 0, width, Math.max(0, py - radius));
        // Bottom
        this.darkness.fillRect(0, py + radius, width, height - py - radius);
        // Left
        this.darkness.fillRect(0, py - radius, Math.max(0, px - radius), radius * 2);
        // Right
        this.darkness.fillRect(px + radius, py - radius, width - px - radius, radius * 2);

        // Soft circular gradient (approximate with concentric semi-transparent rings)
        for (let r = radius; r > radius * 0.6; r -= 8) {
            const alpha = 0.3 * ((radius - r) / (radius * 0.4));
            this.darkness.fillStyle(0x000000, alpha);
            this.darkness.fillCircle(px, py, r);
        }
    }
}
