// ============================================
// Boss.js
// Boss enemy with health bar and attack patterns
// ============================================

class Boss {
    constructor(scene, x, y, config = {}) {
        this.scene = scene;
        this.health = config.health || 50; // Increased default HP from 20 to 50
        this.maxHealth = this.health;
        this.speed = config.speed || 80;
        this.damage = config.damage || 2;
        this.alive = true;
        this.name = config.name || 'Jefe';
        this.pattern = config.pattern || 'charge'; // 'charge', 'area'
        this.invulnerable = false; // Prevent multi-frame hit processing

        // Create visual
        this.sprite = GraphicsFactory.createBoss(scene, x, y, {
            size: config.size || 64,
            color: config.color || 0x9944cc,
            type: config.type || 'generic'
        });
        this.sprite.bossRef = this;

        // AI state
        this.state = 'idle'; // 'idle', 'charging', 'resting', 'area_attack'
        this.stateTimer = 0;
        this.chargeTarget = null;

        // Health bar
        this.healthBarBg = scene.add.graphics();
        this.healthBarBg.setDepth(99);
        this.healthBarFill = scene.add.graphics();
        this.healthBarFill.setDepth(99);
        this.healthBarBg.setScrollFactor(0);
        this.healthBarFill.setScrollFactor(0);

        // Boss name text
        this.nameText = scene.add.text(400, 555, this.name, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#cc88ff',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.nameText.setOrigin(0.5, 0);
        this.nameText.setScrollFactor(0);
        this.nameText.setDepth(99);

        this._drawHealthBar();

        // Start AI cycle
        this.scene.time.delayedCall(1500, () => this._nextAction());
    }

    update(time, player) {
        if (!this.alive || !player || !player.alive) return;

        if (this.state === 'charging' && this.chargeTarget) {
            // Move toward charge target position
            const dist = Phaser.Math.Distance.Between(
                this.sprite.x, this.sprite.y,
                this.chargeTarget.x, this.chargeTarget.y
            );

            if (dist < 10) {
                this.sprite.body.setVelocity(0);
                this.state = 'resting';
                this.scene.time.delayedCall(1000, () => this._nextAction());
            }
        }
    }

    _nextAction() {
        if (!this.alive) return;

        const player = this.scene.player;
        if (!player || !player.alive) return;

        if (this.pattern === 'charge') {
            this._chargeAttack(player);
        } else if (this.pattern === 'area') {
            // Alternate between charge and area attacks
            if (Math.random() > 0.4) {
                this._chargeAttack(player);
            } else {
                this._areaAttack(player);
            }
        }
    }

    _chargeAttack(player) {
        this.state = 'charging';

        // Telegraph the attack
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.2,
            scaleY: 0.8,
            duration: 400,
            yoyo: true,
            onComplete: () => {
                if (!this.alive) return;

                // Charge toward player's current position
                this.chargeTarget = {
                    x: player.sprite.x,
                    y: player.sprite.y
                };

                const angle = Phaser.Math.Angle.Between(
                    this.sprite.x, this.sprite.y,
                    this.chargeTarget.x, this.chargeTarget.y
                );

                const chargeSpeed = this.speed * 2.5;
                this.sprite.body.setVelocity(
                    Math.cos(angle) * chargeSpeed,
                    Math.sin(angle) * chargeSpeed
                );

                // Timeout safety — stop charging if we haven't reached target
                this.scene.time.delayedCall(1500, () => {
                    if (this.state === 'charging') {
                        this.sprite.body.setVelocity(0);
                        this.state = 'resting';
                        this.scene.time.delayedCall(800, () => this._nextAction());
                    }
                });
            }
        });
    }

    _areaAttack(player) {
        this.state = 'area_attack';

        // Visual telegraph
        const warning = this.scene.add.graphics();
        warning.fillStyle(0xff0000, 0.15);
        warning.fillCircle(this.sprite.x, this.sprite.y, 100);
        warning.setDepth(4);

        this.scene.tweens.add({
            targets: warning,
            alpha: { from: 0.15, to: 0.5 },
            duration: 800,
            yoyo: false,
            onComplete: () => {
                warning.destroy();

                if (!this.alive) return;

                // Create expanding shockwave
                const shockwave = this.scene.add.graphics();
                shockwave.lineStyle(4, 0xff4444, 1);
                shockwave.strokeCircle(0, 0, 10);
                shockwave.setPosition(this.sprite.x, this.sprite.y);
                shockwave.setDepth(11);

                // Check if player is in range
                const dist = Phaser.Math.Distance.Between(
                    this.sprite.x, this.sprite.y,
                    player.sprite.x, player.sprite.y
                );
                if (dist < 100) {
                    player.takeDamage(this.damage);
                }

                // Visual expansion
                this.scene.tweens.add({
                    targets: shockwave,
                    scaleX: 10,
                    scaleY: 10,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => {
                        shockwave.destroy();
                        this.state = 'resting';
                        this.scene.time.delayedCall(1200, () => this._nextAction());
                    }
                });
            }
        });
    }

    takeDamage(amount) {
        if (!this.alive || this.invulnerable) return;

        this.health -= amount;
        this.invulnerable = true;

        // Flash
        this.sprite.setAlpha(0.4);
        this.scene.time.delayedCall(100, () => {
            if (this.sprite && this.sprite.active) {
                this.sprite.setAlpha(1);
            }
        });

        // Remove invulnerability after short delay
        this.scene.time.delayedCall(250, () => {
            if (this.alive) this.invulnerable = false;
        });

        // Screen shake
        this.scene.cameras.main.shake(80, 0.008);

        this._drawHealthBar();

        if (this.health <= 0) {
            this.die();
        }
    }

    _drawHealthBar() {
        const barWidth = 300;
        const barHeight = 14;
        const x = 250;
        const y = 575;

        this.healthBarBg.clear();
        this.healthBarBg.fillStyle(0x222233, 1);
        this.healthBarBg.fillRoundedRect(x, y, barWidth, barHeight, 3);
        this.healthBarBg.lineStyle(1, 0x7744aa, 0.8);
        this.healthBarBg.strokeRoundedRect(x, y, barWidth, barHeight, 3);

        this.healthBarFill.clear();
        const pct = Math.max(0, this.health / this.maxHealth);
        const fillColor = pct > 0.5 ? 0x9944cc : (pct > 0.25 ? 0xcc6644 : 0xcc3333);
        this.healthBarFill.fillStyle(fillColor, 1);
        this.healthBarFill.fillRoundedRect(x + 2, y + 2, (barWidth - 4) * pct, barHeight - 4, 2);
    }

    die() {
        this.alive = false;
        this.sprite.body.setVelocity(0);
        this.sprite.body.enable = false;

        // Epic death animation
        this.scene.cameras.main.shake(300, 0.02);

        // Flash screen
        this.scene.cameras.main.flash(400, 200, 100, 255);

        // Explode particles
        for (let i = 0; i < 12; i++) {
            const p = this.scene.add.graphics();
            p.fillStyle(0xcc66ff, 1);
            p.fillCircle(0, 0, 4 + Math.random() * 4);
            p.setPosition(this.sprite.x, this.sprite.y);
            p.setDepth(12);

            const angle = (i / 12) * Math.PI * 2;
            const dist = 60 + Math.random() * 40;

            this.scene.tweens.add({
                targets: p,
                x: this.sprite.x + Math.cos(angle) * dist,
                y: this.sprite.y + Math.sin(angle) * dist,
                alpha: 0,
                duration: 600 + Math.random() * 200,
                onComplete: () => p.destroy()
            });
        }

        // Fade boss out
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 800,
            onComplete: () => {
                this.sprite.destroy();
                this.healthBarBg.destroy();
                this.healthBarFill.destroy();
                this.nameText.destroy();
                this.scene.events.emit('bossDefeated', this);
            }
        });
    }

    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.healthBarFill) this.healthBarFill.destroy();
        if (this.nameText) this.nameText.destroy();
    }
}
