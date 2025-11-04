// src/gameMode.js
// Stage 2: Game Mode - Deer hunting in 3D space
// Deer emojis fly through space, player can shoot red burst particles

import * as THREE from 'three';

console.log("🎮 gameMode.js loaded");

/**
 * GameMode - Stage 2 game implementation
 * Deer emojis fly through 3D space, player shoots projectiles to hit them
 */
export class GameMode {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.enabled = false;

    // Game entities
    this.deer = [];
    this.projectiles = [];
    this.powerUps = []; // Cabbage, carrot, snowflake

    // Spawn settings
    this.deerSpawnTimer = 0;
    this.deerSpawnInterval = 180; // frames (3 seconds at 60fps)
    this.maxDeer = 10;
    this.powerUpSpawnTimer = 0;
    this.powerUpSpawnInterval = 600; // frames (10 seconds at 60fps)

    // Projectile settings
    this.fireCooldown = 0;
    this.fireCooldownDuration = 15; // frames
    this.iceBlastTimer = 0; // Ice power-up duration

    // Score & Health
    this.score = 0;
    this.health = 3; // Starting hearts
    this.maxHealth = 3;

    // Power-up timers
    this.cabbagePowerUpTimer = 0; // 10x multiplier
    this.carrotPowerUpTimer = 0; // 100x multiplier

    // Create sprite materials
    this.createSpriteMaterials();

    console.log("🎮 GameMode initialized");
  }

  createSpriteMaterials() {
    // Create canvas for deer emoji
    const deerCanvas = document.createElement('canvas');
    deerCanvas.width = 128;
    deerCanvas.height = 128;
    const deerCtx = deerCanvas.getContext('2d');
    deerCtx.font = '100px serif';
    deerCtx.textAlign = 'center';
    deerCtx.textBaseline = 'middle';
    deerCtx.fillText('🦌', 64, 64);

    const deerTexture = new THREE.CanvasTexture(deerCanvas);
    this.deerMaterial = new THREE.SpriteMaterial({
      map: deerTexture,
      transparent: true,
      depthWrite: false
    });

    // Create canvas for fire emoji
    const fireCanvas = document.createElement('canvas');
    fireCanvas.width = 128;
    fireCanvas.height = 128;
    const fireCtx = fireCanvas.getContext('2d');
    fireCtx.font = '80px serif';
    fireCtx.textAlign = 'center';
    fireCtx.textBaseline = 'middle';
    fireCtx.fillText('💥', 64, 64);

    const fireTexture = new THREE.CanvasTexture(fireCanvas);
    this.fireMaterial = new THREE.SpriteMaterial({
      map: fireTexture,
      transparent: true,
      depthWrite: false
    });

    // Create canvas for frozen emoji
    const iceCanvas = document.createElement('canvas');
    iceCanvas.width = 128;
    iceCanvas.height = 128;
    const iceCtx = iceCanvas.getContext('2d');
    iceCtx.font = '100px serif';
    iceCtx.textAlign = 'center';
    iceCtx.textBaseline = 'middle';
    iceCtx.fillText('🧊', 64, 64);

    const iceTexture = new THREE.CanvasTexture(iceCanvas);
    this.iceMaterial = new THREE.SpriteMaterial({
      map: iceTexture,
      transparent: true,
      depthWrite: false
    });

    // Stage 2: Create canvas for fire deer emoji (🔥)
    const fireDeerCanvas = document.createElement('canvas');
    fireDeerCanvas.width = 128;
    fireDeerCanvas.height = 128;
    const fireDeerCtx = fireDeerCanvas.getContext('2d');
    fireDeerCtx.font = '100px serif';
    fireDeerCtx.textAlign = 'center';
    fireDeerCtx.textBaseline = 'middle';
    fireDeerCtx.fillText('🔥', 64, 64);

    const fireDeerTexture = new THREE.CanvasTexture(fireDeerCanvas);
    this.fireDeerMaterial = new THREE.SpriteMaterial({
      map: fireDeerTexture,
      transparent: true,
      depthWrite: false
    });

    // Frozen deer emoji (🧊) - for ice blast
    const frozenDeerCanvas = document.createElement('canvas');
    frozenDeerCanvas.width = 128;
    frozenDeerCanvas.height = 128;
    const frozenDeerCtx = frozenDeerCanvas.getContext('2d');
    frozenDeerCtx.font = '100px serif';
    frozenDeerCtx.textAlign = 'center';
    frozenDeerCtx.textBaseline = 'middle';
    frozenDeerCtx.fillText('🧊', 64, 64);

    const frozenDeerTexture = new THREE.CanvasTexture(frozenDeerCanvas);
    this.frozenDeerMaterial = new THREE.SpriteMaterial({
      map: frozenDeerTexture,
      transparent: true,
      depthWrite: false
    });

    // Cabbage emoji (🥬) - 10x multiplier
    const cabbageCanvas = document.createElement('canvas');
    cabbageCanvas.width = 128;
    cabbageCanvas.height = 128;
    const cabbageCtx = cabbageCanvas.getContext('2d');
    cabbageCtx.font = '100px serif';
    cabbageCtx.textAlign = 'center';
    cabbageCtx.textBaseline = 'middle';
    cabbageCtx.fillText('🥬', 64, 64);

    const cabbageTexture = new THREE.CanvasTexture(cabbageCanvas);
    this.cabbageMaterial = new THREE.SpriteMaterial({
      map: cabbageTexture,
      transparent: true,
      depthWrite: false
    });

    // Carrot emoji (🥕) - 100x multiplier
    const carrotCanvas = document.createElement('canvas');
    carrotCanvas.width = 128;
    carrotCanvas.height = 128;
    const carrotCtx = carrotCanvas.getContext('2d');
    carrotCtx.font = '100px serif';
    carrotCtx.textAlign = 'center';
    carrotCtx.textBaseline = 'middle';
    carrotCtx.fillText('🥕', 64, 64);

    const carrotTexture = new THREE.CanvasTexture(carrotCanvas);
    this.carrotMaterial = new THREE.SpriteMaterial({
      map: carrotTexture,
      transparent: true,
      depthWrite: false
    });

    // Snowflake emoji (❄️) - ice blast power-up
    const snowflakeCanvas = document.createElement('canvas');
    snowflakeCanvas.width = 128;
    snowflakeCanvas.height = 128;
    const snowflakeCtx = snowflakeCanvas.getContext('2d');
    snowflakeCtx.font = '100px serif';
    snowflakeCtx.textAlign = 'center';
    snowflakeCtx.textBaseline = 'middle';
    snowflakeCtx.fillText('❄️', 64, 64);

    const snowflakeTexture = new THREE.CanvasTexture(snowflakeCanvas);
    this.snowflakeMaterial = new THREE.SpriteMaterial({
      map: snowflakeTexture,
      transparent: true,
      depthWrite: false
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    console.log(`🎮 Game Mode: ${this.enabled ? 'ON' : 'OFF'}`);

    if (!this.enabled) {
      // Clean up when disabled
      this.cleanup();
    }
  }

  spawnDeer() {
    if (this.deer.length >= this.maxDeer) return;

    const sprite = new THREE.Sprite(this.deerMaterial.clone());

    // Random spawn position around camera
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const height = (Math.random() - 0.5) * 40;

    sprite.position.set(
      this.camera.position.x + Math.cos(angle) * distance,
      this.camera.position.y + height,
      this.camera.position.z + Math.sin(angle) * distance
    );

    // Random velocity toward/across camera view
    const speed = 0.1 + Math.random() * 0.2;
    const targetAngle = angle + (Math.random() - 0.5) * Math.PI;

    const velocity = new THREE.Vector3(
      Math.cos(targetAngle) * speed,
      (Math.random() - 0.5) * 0.1,
      Math.sin(targetAngle) * speed
    );

    sprite.scale.set(3, 3, 1);
    this.scene.add(sprite);

    this.deer.push({
      sprite,
      velocity,
      state: 'active', // 'active', 'hit', 'fading'
      hitTimer: 0,
      fadeTimer: 0,
      fadeScale: 1.0,
      fadeOpacity: 1.0
    });
  }

  spawnPowerUp() {
    // Random power-up type: cabbage (10x), carrot (100x), snowflake (ice blast)
    const rand = Math.random();
    let type, material;

    if (rand < 0.33) {
      type = 'cabbage';
      material = this.cabbageMaterial;
    } else if (rand < 0.66) {
      type = 'carrot';
      material = this.carrotMaterial;
    } else {
      type = 'snowflake';
      material = this.snowflakeMaterial;
    }

    const sprite = new THREE.Sprite(material.clone());

    // Random spawn position around camera
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 40;
    const height = (Math.random() - 0.5) * 30;

    sprite.position.set(
      this.camera.position.x + Math.cos(angle) * distance,
      this.camera.position.y + height,
      this.camera.position.z + Math.sin(angle) * distance
    );

    sprite.scale.set(2.5, 2.5, 1);
    this.scene.add(sprite);

    this.powerUps.push({
      sprite,
      type,
      lifetime: 600 // 10 seconds at 60fps
    });

    console.log(`🎮 Power-up spawned: ${type}`);
  }

  fireProjectile() {
    if (this.fireCooldown > 0) return;

    // Determine projectile type based on active power-ups
    let projectileType = 'fire';
    let projectileMaterial = this.fireMaterial;

    if (this.iceBlastTimer > 0) {
      projectileType = 'ice';
      projectileMaterial = this.iceMaterial;
    }

    const sprite = new THREE.Sprite(projectileMaterial.clone());

    // Spawn at camera position
    sprite.position.copy(this.camera.position);

    // Fire in camera direction
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    const velocity = direction.multiplyScalar(1.5); // Fast projectile

    sprite.scale.set(2, 2, 1);
    this.scene.add(sprite);

    this.projectiles.push({
      sprite,
      velocity,
      lifetime: 180, // 3 seconds
      type: projectileType
    });

    this.fireCooldown = this.fireCooldownDuration;
    console.log(`🎮 ${projectileType === 'ice' ? 'Ice' : 'Fire'} projectile fired!`);
  }

  update(delta) {
    if (!this.enabled) return;

    // Update cooldown
    if (this.fireCooldown > 0) this.fireCooldown--;

    // Update power-up timers
    if (this.iceBlastTimer > 0) this.iceBlastTimer--;
    if (this.cabbagePowerUpTimer > 0) this.cabbagePowerUpTimer--;
    if (this.carrotPowerUpTimer > 0) this.carrotPowerUpTimer--;

    // Spawn deer
    this.deerSpawnTimer++;
    if (this.deerSpawnTimer >= this.deerSpawnInterval) {
      this.spawnDeer();
      this.deerSpawnTimer = 0;
    }

    // Spawn power-ups
    this.powerUpSpawnTimer++;
    if (this.powerUpSpawnTimer >= this.powerUpSpawnInterval) {
      this.spawnPowerUp();
      this.powerUpSpawnTimer = 0;
    }

    // Update deer
    for (let i = this.deer.length - 1; i >= 0; i--) {
      const deer = this.deer[i];

      if (deer.state === 'active') {
        // Move deer
        deer.sprite.position.add(deer.velocity);

        // Face camera
        deer.sprite.lookAt(this.camera.position);

        // Remove if too far
        const distance = deer.sprite.position.distanceTo(this.camera.position);
        if (distance > 200) {
          this.scene.remove(deer.sprite);
          deer.sprite.material.dispose();
          this.deer.splice(i, 1);
        }
      } else if (deer.state === 'onFire') {
        // Fire deer - stationary, waiting to be collected
        deer.sprite.lookAt(this.camera.position);

        // Check if player is close enough to collect
        const distance = deer.sprite.position.distanceTo(this.camera.position);
        if (distance < 10) {
          // Collected! Award points with multipliers and start fading
          let points = 50;

          // Apply power-up multipliers
          if (this.carrotPowerUpTimer > 0) {
            points *= 100;
          } else if (this.cabbagePowerUpTimer > 0) {
            points *= 10;
          }

          this.score += points;
          console.log(`🎮 Collected fire deer! +${points} points. Total: ${this.score}`);
          deer.state = 'fading';
          deer.fadeTimer = 0;
        }
      } else if (deer.state === 'frozen') {
        // Frozen deer - stationary, waiting to be collected
        deer.sprite.lookAt(this.camera.position);

        // Check if player is close enough to collect
        const distance = deer.sprite.position.distanceTo(this.camera.position);
        if (distance < 10) {
          // Collected! Award points with multipliers and start fading
          let points = 50;

          // Apply power-up multipliers
          if (this.carrotPowerUpTimer > 0) {
            points *= 100;
          } else if (this.cabbagePowerUpTimer > 0) {
            points *= 10;
          }

          this.score += points;
          console.log(`🎮 Collected frozen deer! +${points} points. Total: ${this.score}`);
          deer.state = 'fading';
          deer.fadeTimer = 0;
        }
      } else if (deer.state === 'fading') {
        // Fade out and remove
        deer.fadeTimer++;
        const progress = deer.fadeTimer / 60; // 1 second fade

        deer.fadeOpacity = 1.0 - progress;
        deer.sprite.material.opacity = deer.fadeOpacity;

        if (deer.fadeTimer >= 60) {
          this.scene.remove(deer.sprite);
          deer.sprite.material.dispose();
          this.deer.splice(i, 1);
        }
      }
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];

      // Move projectile
      projectile.sprite.position.add(projectile.velocity);
      projectile.sprite.lookAt(this.camera.position);

      // Decrease lifetime
      projectile.lifetime--;

      // Check collision with deer
      let hit = false;
      for (const deer of this.deer) {
        if (deer.state !== 'active') continue;

        const distance = projectile.sprite.position.distanceTo(deer.sprite.position);
        if (distance < 5) {
          // Hit! Change deer state based on projectile type
          if (projectile.type === 'fire') {
            deer.state = 'onFire';
            deer.sprite.material.dispose();
            deer.sprite.material = this.fireDeerMaterial.clone();
            console.log(`🎮 Deer is on fire! 🔥`);
          } else if (projectile.type === 'ice') {
            deer.state = 'frozen';
            deer.sprite.material.dispose();
            deer.sprite.material = this.frozenDeerMaterial.clone();
            console.log(`🎮 Deer is frozen! 🧊`);
          }

          deer.hitTimer = 0;
          deer.velocity.set(0, 0, 0);
          hit = true;
          break;
        }
      }

      // Remove projectile if hit or expired
      if (hit || projectile.lifetime <= 0) {
        this.scene.remove(projectile.sprite);
        projectile.sprite.material.dispose();
        this.projectiles.splice(i, 1);
      }
    }

    // Update power-ups
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];

      // Face camera
      powerUp.sprite.lookAt(this.camera.position);

      // Decrease lifetime
      powerUp.lifetime--;

      // Check collection (player proximity)
      const distance = powerUp.sprite.position.distanceTo(this.camera.position);
      if (distance < 8) {
        // Collected! Activate power-up
        if (powerUp.type === 'cabbage') {
          this.cabbagePowerUpTimer = 500; // ~8 seconds
          console.log('🎮 Cabbage collected! 10x multiplier for 8 seconds!');
        } else if (powerUp.type === 'carrot') {
          this.carrotPowerUpTimer = 1800; // ~30 seconds
          console.log('🎮 Carrot collected! 100x multiplier for 30 seconds!');
        } else if (powerUp.type === 'snowflake') {
          this.iceBlastTimer = 1200; // 20 seconds
          console.log('🎮 Snowflake collected! Ice blast for 20 seconds!');
        }

        // Remove power-up
        this.scene.remove(powerUp.sprite);
        powerUp.sprite.material.dispose();
        this.powerUps.splice(i, 1);
      } else if (powerUp.lifetime <= 0) {
        // Expired - remove
        this.scene.remove(powerUp.sprite);
        powerUp.sprite.material.dispose();
        this.powerUps.splice(i, 1);
      }
    }

    // Check deer collision damage (active deer only)
    for (const deer of this.deer) {
      if (deer.state !== 'active') continue;

      const distance = deer.sprite.position.distanceTo(this.camera.position);
      if (distance < 5) {
        // Hit! Take damage
        this.health--;
        console.log(`🎮 Hit by deer! Health: ${this.health}/${this.maxHealth}`);

        // Remove deer
        this.scene.remove(deer.sprite);
        deer.sprite.material.dispose();
        const index = this.deer.indexOf(deer);
        if (index > -1) this.deer.splice(index, 1);

        // Check game over
        if (this.health <= 0) {
          console.log('🎮 GAME OVER! Final score: ' + this.score);
          this.cleanup();
          this.toggle(); // Disable game mode
        }

        break; // Only one collision per frame
      }
    }
  }

  cleanup() {
    // Remove all deer
    for (const deer of this.deer) {
      this.scene.remove(deer.sprite);
      deer.sprite.material.dispose();
    }
    this.deer = [];

    // Remove all projectiles
    for (const projectile of this.projectiles) {
      this.scene.remove(projectile.sprite);
      projectile.sprite.material.dispose();
    }
    this.projectiles = [];

    // Remove all power-ups
    for (const powerUp of this.powerUps) {
      this.scene.remove(powerUp.sprite);
      powerUp.sprite.material.dispose();
    }
    this.powerUps = [];

    // Reset timers and state
    this.score = 0;
    this.health = 3;
    this.deerSpawnTimer = 0;
    this.powerUpSpawnTimer = 0;
    this.iceBlastTimer = 0;
    this.cabbagePowerUpTimer = 0;
    this.carrotPowerUpTimer = 0;
    console.log("🎮 Game Mode cleaned up");
  }

  dispose() {
    this.cleanup();

    // Dispose materials
    if (this.deerMaterial) this.deerMaterial.dispose();
    if (this.fireMaterial) this.fireMaterial.dispose();
    if (this.iceMaterial) this.iceMaterial.dispose();
    if (this.fireDeerMaterial) this.fireDeerMaterial.dispose();
    if (this.frozenDeerMaterial) this.frozenDeerMaterial.dispose();
    if (this.cabbageMaterial) this.cabbageMaterial.dispose();
    if (this.carrotMaterial) this.carrotMaterial.dispose();
    if (this.snowflakeMaterial) this.snowflakeMaterial.dispose();

    console.log("🎮 GameMode disposed");
  }
}

console.log("🎮 Game mode ready");
