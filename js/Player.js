// ============================================
// Player.js
// Dani — the protagonist
// Movement, attack, health, invincibility frames
// Uses sprite sheet animations
// ============================================

class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.maxHealth = scene.registry.get('maxHealth') || 6;
        this.health = this.maxHealth;
        this.speed = 160;
        this.facing = 'down'; // 'up', 'down', 'left', 'right'
        this.isAttacking = false;
        this.isHurting = false; // New flag for hurt animation
        this.attackCooldown = 400; // ms
        this.lastAttackTime = 0;
        this.invincible = false;
        this.invincibleDuration = 800; // ms
        this.alive = true;

        // Create the sprite (now a Phaser.Physics.Arcade.Sprite)
        this.sprite = GraphicsFactory.createPlayer(scene, x, y);
        this.sprite.playerRef = this; // back-reference

        // Start with idle down
        this.sprite.anims.play('dani-idle-down', true);

        // Input
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.attackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update(time) {
        if (!this.alive) return;
        if (this.isAttacking || this.isHurting) return; // Don't move during attack or hurt

        const body = this.sprite.body;
        body.setVelocity(0);

        // Movement
        let moving = false;
        const touch = this.scene.touchControls || {};

        if (this.cursors.left.isDown || touch.left) {
            body.setVelocityX(-this.speed);
            this.facing = 'left';
            moving = true;
        } else if (this.cursors.right.isDown || touch.right) {
            body.setVelocityX(this.speed);
            this.facing = 'right';
            moving = true;
        }

        if (this.cursors.up.isDown || touch.up) {
            body.setVelocityY(-this.speed);
            this.facing = 'up';
            moving = true;
        } else if (this.cursors.down.isDown || touch.down) {
            body.setVelocityY(this.speed);
            this.facing = 'down';
            moving = true;
        }

        // Normalize diagonal
        if (body.velocity.x !== 0 && body.velocity.y !== 0) {
            body.velocity.normalize().scale(this.speed);
        }

        // Play animations
        if (moving) {
            this.sprite.anims.play('dani-walk-' + this.facing, true);
        } else {
            this.sprite.anims.play('dani-idle-' + this.facing, true);
        }

        // Attack
        if ((Phaser.Input.Keyboard.JustDown(this.attackKey) || (touch.attack && !this.lastTouchAttackStr)) && !this.isAttacking) {
            this.attack(time);
        }
        // Simple latch to prevent machine-gun attack on touch hold (acts like JustDown)
        this.lastTouchAttackStr = touch.attack;
    }

    attack(time) {
        if (time - this.lastAttackTime < this.attackCooldown) return;

        this.isAttacking = true;
        this.lastAttackTime = time;
        this.sprite.body.setVelocity(0);

        // Play attack animation
        const attackAnim = 'dani-attack-' + this.facing;
        this.sprite.anims.play(attackAnim, true);

        // Create hitbox
        const hitbox = GraphicsFactory.createSwordHitbox(
            this.scene,
            this.sprite.x,
            this.sprite.y,
            this.facing
        );

        hitbox.attackDirection = this.facing;

        // Emit attack event for the scene to handle collisions
        this.scene.events.emit('playerAttack', hitbox);

        // Listen for attack animation complete, or timeout
        this.sprite.once('animationcomplete', () => {
            this.isAttacking = false;
        });

        // Safety timeout in case animation doesn't fire complete
        this.scene.time.delayedCall(this.attackCooldown, () => {
            this.isAttacking = false;
        });
    }

    takeDamage(amount) {
        if (this.invincible || !this.alive) return;

        this.health -= amount;
        this.invincible = true;

        // Flash effect
        this._flashEffect();

        // Camera shake
        this.scene.cameras.main.shake(100, 0.01);

        // Update HUD
        this.scene.events.emit('playerDamaged', this.health);

        if (this.health <= 0) {
            this.die();
        } else {
            // Resume states after short delay (approx animation time)
            this.scene.time.delayedCall(600, () => {
                if (this.alive) {
                    this.isHurting = false;
                    // Reset to idle to ensure we don't get stuck in hurt frame if update doesn't trigger immediately
                    this.sprite.anims.play('dani-idle-' + this.facing, true);
                }
            });
        }

        // Remove invincibility
        this.scene.time.delayedCall(this.invincibleDuration, () => {
            this.invincible = false;
            this.sprite.setAlpha(1);
        });
    }

    _flashEffect() {
        const flashCount = 6;
        let i = 0;
        const flashTimer = this.scene.time.addEvent({
            delay: this.invincibleDuration / flashCount,
            callback: () => {
                this.sprite.setAlpha(this.sprite.alpha === 1 ? 0.3 : 1);
                i++;
                if (i >= flashCount) {
                    flashTimer.remove();
                    this.sprite.setAlpha(1);
                }
            },
            repeat: flashCount - 1
        });
    }

    die() {
        this.alive = false;
        this.sprite.body.setVelocity(0);

        // Death animation
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            angle: 180,
            scaleX: 0,
            scaleY: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
                this.scene.events.emit('playerDied');
            }
        });
    }

    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
        this.scene.events.emit('playerDamaged', this.health);
    }

    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    destroy() {
        if (this.sprite) this.sprite.destroy();
    }
}
