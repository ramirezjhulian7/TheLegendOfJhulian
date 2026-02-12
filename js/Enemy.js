// ============================================
// Enemy.js
// Base enemy class with wandering + chasing AI
// ============================================

class Enemy {
    constructor(scene, x, y, config = {}) {
        this.scene = scene;
        this.health = config.health || 3;
        this.maxHealth = this.health;
        this.speed = config.speed || 60;
        this.damage = config.damage || 1;
        this.detectionRange = config.detectionRange || 150;
        this.alive = true;
        this.name = config.name || 'Enemigo';

        // Create visual
        this.sprite = GraphicsFactory.createEnemy(scene, x, y, {
            size: config.size || 28,
            color: config.color || 0x4444ff
        });
        this.sprite.enemyRef = this;

        // AI state
        this.state = 'wander'; // 'wander', 'chase'
        this.wanderTimer = 0;
        this.wanderDirection = { x: 0, y: 0 };
        this._pickWanderDirection();
    }

    update(time, player) {
        if (!this.alive || !player || !player.alive) {
            if (this.sprite.body) this.sprite.body.setVelocity(0);
            return;
        }

        const dist = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );

        if (dist < this.detectionRange) {
            this.state = 'chase';
        } else {
            this.state = 'wander';
        }

        if (this.state === 'chase') {
            this._chase(player);
        } else {
            this._wander(time);
        }
    }

    _chase(player) {
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        this.sprite.body.setVelocity(
            Math.cos(angle) * this.speed * 1.3,
            Math.sin(angle) * this.speed * 1.3
        );
    }

    _wander(time) {
        if (time > this.wanderTimer) {
            this._pickWanderDirection();
            this.wanderTimer = time + 1500 + Math.random() * 2000;
        }
        this.sprite.body.setVelocity(
            this.wanderDirection.x * this.speed,
            this.wanderDirection.y * this.speed
        );
    }

    _pickWanderDirection() {
        const dirs = [
            { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 0, y: 1 }, { x: 0, y: -1 },
            { x: 0, y: 0 } // pause
        ];
        this.wanderDirection = dirs[Math.floor(Math.random() * dirs.length)];
    }

    takeDamage(amount) {
        if (!this.alive) return;

        this.health -= amount;

        // Flash red
        this.sprite.setAlpha(0.5);
        this.scene.time.delayedCall(100, () => {
            if (this.sprite && this.sprite.active) this.sprite.setAlpha(1);
        });

        // Knockback
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.sprite.x + (Math.random() - 0.5) * 30,
            y: this.sprite.y + (Math.random() - 0.5) * 30,
            duration: 100,
        });

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.alive = false;
        this.sprite.body.setVelocity(0);
        this.sprite.body.enable = false;

        // Death particles effect
        this._deathEffect();

        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 300,
            onComplete: () => {
                this.sprite.destroy();
                this.scene.events.emit('enemyKilled', this);
            }
        });
    }

    _deathEffect() {
        const particles = this.scene.add.graphics();
        const x = this.sprite.x;
        const y = this.sprite.y;

        for (let i = 0; i < 6; i++) {
            const px = x + (Math.random() - 0.5) * 20;
            const py = y + (Math.random() - 0.5) * 20;
            particles.fillStyle(0x6666ff, 0.8);
            particles.fillCircle(px, py, 3);
        }

        this.scene.tweens.add({
            targets: particles,
            alpha: 0,
            duration: 500,
            onComplete: () => particles.destroy()
        });
    }

    destroy() {
        if (this.sprite) this.sprite.destroy();
    }
}
