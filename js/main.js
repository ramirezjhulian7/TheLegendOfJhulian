// ============================================
// main.js
// Phaser 3 Game Configuration
// ============================================

const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#0a0a1a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        TitleScene,
        Level1Scene,
        Level2Scene,
        Level3Scene,
        BossScene,
        VictoryScene,
        GameOverScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: false,
    roundPixels: true
};

// Launch!
const game = new Phaser.Game(gameConfig);
