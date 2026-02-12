// ============================================
// NPC.js
// Non-player character with interaction prompt
// ============================================

class NPC {
    constructor(scene, x, y, config = {}) {
        this.scene = scene;
        this.name = config.name || 'NPC';
        this.dialogues = config.dialogues || ['...'];
        this.interactionRange = config.interactionRange || 50;
        this.hasInteracted = false;

        // Create visual
        this.sprite = GraphicsFactory.createNPC(scene, x, y);
        this.sprite.npcRef = this;

        // Interaction prompt
        this.prompt = scene.add.text(x, y - 28, '[ E ]', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#ffcc44',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.prompt.setOrigin(0.5, 1);
        this.prompt.setDepth(20);
        this.prompt.setVisible(false);

        // Gentle idle animation
        scene.tweens.add({
            targets: this.sprite,
            y: y - 2,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update(player) {
        if (!player || !player.alive) {
            this.prompt.setVisible(false);
            return;
        }

        const dist = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );

        const inRange = dist < this.interactionRange;
        this.prompt.setVisible(inRange);

        if (inRange) {
            // Pulse prompt
            this.prompt.setAlpha(0.7 + Math.sin(Date.now() * 0.005) * 0.3);
        }
    }

    interact(dialogueManager) {
        if (dialogueManager.isActive) return;
        this.hasInteracted = true;
        dialogueManager.show(this.name, this.dialogues);
    }

    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.prompt) this.prompt.destroy();
    }
}
