// ============================================
// Level1Scene.js
// Misión 1: El Bosque de la Incertidumbre
// ============================================

class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(800);

        // --- Touch Controls ---
        this.touchControls = new TouchControls(this);

        // --- Background ---
        this.cameras.main.setBackgroundColor('#1a3322');

        // Ground texture (grass patches)
        for (let i = 0; i < 40; i++) {
            const g = this.add.graphics();
            g.fillStyle(0x2a5533, 0.3 + Math.random() * 0.3);
            g.fillCircle(
                Math.random() * width,
                Math.random() * height,
                8 + Math.random() * 20
            );
            g.setDepth(0);
        }

        // --- Trees (obstacles) ---
        this.obstacles = this.physics.add.staticGroup();
        const treePositions = [
            [60, 60], [180, 40], [350, 50], [550, 30], [700, 70],
            [30, 200], [750, 180], [100, 400], [680, 350],
            [30, 500], [200, 560], [450, 570], [730, 530],
            [400, 120], [600, 450]
        ];
        this.trees = [];
        for (const [tx, ty] of treePositions) {
            const tree = GraphicsFactory.createTree(this, tx, ty);
            this.obstacles.add(tree);
            this.trees.push(tree);
        }

        // --- Player ---
        this.player = new Player(this, 100, 300);
        this.physics.add.collider(this.player.sprite, this.obstacles);

        // --- HUD ---
        this.hud = new HUD(this, this.player.maxHealth);
        this.hud.setMission('Misión 1: El Bosque de la Incertidumbre');

        // --- Dialogue Manager ---
        this.dialogueManager = new DialogueManager(this);

        // --- NPC ---
        this.npc = new NPC(this, 250, 200, {
            name: 'Espíritu del Bosque',
            type: 'echo',
            scale: 2.5,
            dialogues: [
                'Bienvenida, Dani. Este bosque está lleno de dudas y sombras...',
                'Pero recuerda: cada paso que das te acerca a la luz.',
                'Derrota a las sombras y encuentra la salida. ¡Tú puedes!'
            ],
            interactionRange: 55
        });
        this.physics.add.collider(this.npc.sprite, this.obstacles);

        // --- Enemies ---
        this.enemies = [];
        this.enemySprites = this.physics.add.group();
        const enemyPositions = [
            [350, 250], [500, 180], [420, 400],
            [600, 300], [300, 450], [550, 500]
        ];
        for (const [ex, ey] of enemyPositions) {
            const enemy = new Enemy(this, ex, ey, {
                name: 'Sombra de Duda',
                type: 'bat',
                health: 3,
                speed: 50,
                damage: 1,
                color: 0x3344aa,
                detectionRange: 130
            });
            this.enemies.push(enemy);
            this.enemySprites.add(enemy.sprite);
            this.physics.add.collider(enemy.sprite, this.obstacles);
        }
        this.enemiesKilled = 0;
        this.totalEnemies = this.enemies.length;

        // --- Exit zone (locked until enough enemies killed) ---
        this.exitZone = this.add.graphics();
        this.exitZone.fillStyle(0x44ff44, 0.15);
        this.exitZone.fillRect(-20, -20, 40, 40);
        this.exitZone.setPosition(750, 300);
        this.exitZone.setDepth(1);
        this.exitZone.setVisible(false);

        this.exitZoneBody = this.add.zone(750, 300, 40, 40);
        this.physics.add.existing(this.exitZoneBody, true);
        this.exitActive = false;

        // Exit glow indicator
        this.exitArrow = this.add.text(750, 270, '▼', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#44ff44'
        });
        this.exitArrow.setOrigin(0.5);
        this.exitArrow.setVisible(false);
        this.exitArrow.setDepth(20);

        // --- Collisions ---
        // Player vs Enemy (contact damage)
        this.physics.add.overlap(this.player.sprite, this.enemySprites, (playerSprite, enemySprite) => {
            if (enemySprite.enemyRef && enemySprite.enemyRef.alive) {
                this.player.takeDamage(enemySprite.enemyRef.damage);
            }
        });

        // Player vs Exit
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
            this.scene.start('GameOverScene', { restartScene: 'Level1Scene' });
        });

        // --- Intro dialogue ---
        this.time.delayedCall(500, () => {
            this.dialogueManager.show('', [
                'Misión 1: El Bosque de la Incertidumbre',
                'Las Sombras de Duda acechan entre los árboles...',
                'Derrota a las sombras para abrir el camino.'
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
                    name: 'El Guardián del Miedo',
                    health: 10,
                    speed: 70,
                    damage: 2,
                    pattern: 'charge',
                    color: 0x7733aa,
                    type: 'slime',
                    size: 80
                },
                winMessage: [
                    'Has vencido al Guardián del Miedo.',
                    'Pensionarte no es el final, es el comienzo de una etapa donde tu única tarea es cuidarte.',
                    'Eres valiosa por quien eres, no por lo que haces.'
                ],
                nextScene: 'Level2Scene',
                bgColor: '#1a2222',
                arenaColor: 0x1a3322
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
        const touch = this.touchControls || {};
        const interactPressed = Phaser.Input.Keyboard.JustDown(this.player.interactKey) || (touch.interact && !this.lastTouchInteract);
        this.lastTouchInteract = touch.interact;

        if (this.player.interactKey && interactPressed) {
            const dist = Phaser.Math.Distance.Between(
                this.player.sprite.x, this.player.sprite.y,
                this.npc.sprite.x, this.npc.sprite.y
            );
            if (dist < this.npc.interactionRange) {
                this.npc.interact(this.dialogueManager);
            }
        }
    }
}
