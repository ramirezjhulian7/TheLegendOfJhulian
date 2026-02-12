// ============================================
// BootScene.js
// Preload / boot — loads sprite sheets and assets
// ============================================

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // --- Dani Sprite Sheets ---
        // Walk: 832x256
        // Idle: 832x256 (Original)
        // Slash: 832x256
        // Hurt: 832x64

        this.load.spritesheet('dani_walk', 'characters/Dani/walk.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('dani_idle', 'characters/Dani/idle.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('dani_slash', 'characters/Dani/slash.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('dani_hurt', 'characters/Dani/hurt.png', { frameWidth: 64, frameHeight: 64 });

        // --- Jhulian Sprite Sheets ---
        this.load.spritesheet('jhulian_walk', 'characters/Jhulian/walk.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jhulian_idle', 'characters/Jhulian/idle.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jhulian_slash', 'characters/Jhulian/slash.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jhulian_hurt', 'characters/Jhulian/hurt.png', { frameWidth: 64, frameHeight: 64 });

        // --- Enemies, NPCs, Bosses ---
        this.load.image('enemy_bat', 'characters/Enemies/bat.png');
        this.load.image('npc_echo', 'characters/NPCs/friendly_echo.png');
        this.load.image('boss_slime', 'characters/Bosses/slime_king.png');
    }

    create() {
        const anims = this.anims;

        // ========================================================================================
        // DANI ANIMATIONS
        // ========================================================================================

        // --- Walk ---
        anims.create({
            key: 'dani-walk-down',
            frames: anims.generateFrameNumbers('dani_walk', { start: 27, end: 34 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'dani-walk-left',
            frames: anims.generateFrameNumbers('dani_walk', { start: 14, end: 21 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'dani-walk-right',
            frames: anims.generateFrameNumbers('dani_walk', { start: 40, end: 47 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'dani-walk-up',
            frames: anims.generateFrameNumbers('dani_walk', { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // --- Idle (Original idle.png) ---
        // Typically 4 dirs: Row 0: Up, Row 1: Left, Row 2: Down, Row 3: Right
        anims.create({
            key: 'dani-idle-down',
            frames: anims.generateFrameNumbers('dani_idle', { start: 26, end: 27 }), // Row 2
            frameRate: 2,
            repeat: -1
        });
        anims.create({
            key: 'dani-idle-left',
            frames: anims.generateFrameNumbers('dani_idle', { start: 13, end: 14 }), // Row 1
            frameRate: 2,
            repeat: -1
        });
        anims.create({
            key: 'dani-idle-right',
            frames: anims.generateFrameNumbers('dani_idle', { start: 39, end: 40 }), // Row 3
            frameRate: 2,
            repeat: -1
        });
        anims.create({
            key: 'dani-idle-up',
            frames: anims.generateFrameNumbers('dani_idle', { start: 0, end: 1 }), // Row 0
            frameRate: 2,
            repeat: -1
        });

        // --- Attack (Slash) ---
        anims.create({
            key: 'dani-attack-down',
            frames: anims.generateFrameNumbers('dani_slash', { start: 26, end: 31 }),
            frameRate: 15,
            repeat: 0
        });
        anims.create({
            key: 'dani-attack-left',
            frames: anims.generateFrameNumbers('dani_slash', { start: 13, end: 18 }),
            frameRate: 15,
            repeat: 0
        });
        anims.create({
            key: 'dani-attack-right',
            frames: anims.generateFrameNumbers('dani_slash', { start: 39, end: 44 }),
            frameRate: 15,
            repeat: 0
        });
        anims.create({
            key: 'dani-attack-up',
            frames: anims.generateFrameNumbers('dani_slash', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: 0
        });

        anims.create({
            key: 'dani-hurt',
            frames: anims.generateFrameNumbers('dani_hurt', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });


        // ========================================================================================
        // JHULIAN ANIMATIONS
        // ========================================================================================

        // --- Walk ---
        anims.create({
            key: 'jhulian-walk-down',
            frames: anims.generateFrameNumbers('jhulian_walk', { start: 27, end: 34 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'jhulian-walk-left',
            frames: anims.generateFrameNumbers('jhulian_walk', { start: 14, end: 21 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'jhulian-walk-right',
            frames: anims.generateFrameNumbers('jhulian_walk', { start: 40, end: 47 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'jhulian-walk-up',
            frames: anims.generateFrameNumbers('jhulian_walk', { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // --- Idle (Original) ---
        anims.create({
            key: 'jhulian-idle-down',
            frames: anims.generateFrameNumbers('jhulian_idle', { start: 26, end: 27 }),
            frameRate: 2,
            repeat: -1
        });
        anims.create({
            key: 'jhulian-idle-left',
            frames: anims.generateFrameNumbers('jhulian_idle', { start: 13, end: 14 }),
            frameRate: 2,
            repeat: -1
        });
        anims.create({
            key: 'jhulian-idle-right',
            frames: anims.generateFrameNumbers('jhulian_idle', { start: 39, end: 40 }),
            frameRate: 2,
            repeat: -1
        });
        anims.create({
            key: 'jhulian-idle-up',
            frames: anims.generateFrameNumbers('jhulian_idle', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        // --- Attack ---
        anims.create({
            key: 'jhulian-attack-down',
            frames: anims.generateFrameNumbers('jhulian_slash', { start: 26, end: 31 }),
            frameRate: 15,
            repeat: 0
        });
        anims.create({
            key: 'jhulian-attack-left',
            frames: anims.generateFrameNumbers('jhulian_slash', { start: 13, end: 18 }),
            frameRate: 15,
            repeat: 0
        });
        anims.create({
            key: 'jhulian-attack-right',
            frames: anims.generateFrameNumbers('jhulian_slash', { start: 39, end: 44 }),
            frameRate: 15,
            repeat: 0
        });
        anims.create({
            key: 'jhulian-attack-up',
            frames: anims.generateFrameNumbers('jhulian_slash', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: 0
        });

        anims.create({
            key: 'jhulian-hurt',
            frames: anims.generateFrameNumbers('jhulian_hurt', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        // Quick loading text
        const loadingText = this.add.text(400, 300, 'Cargando...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#7744aa'
        });
        loadingText.setOrigin(0.5);

        this.tweens.add({
            targets: loadingText,
            alpha: { from: 0.3, to: 1 },
            duration: 500,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.scene.start('TitleScene');
            }
        });
    }
}
