import { Octree } from './libs/Octree.js';

class PhysicsSystem {
  constructor(world) {
    // Initialize physics system
    this.world = world;
    this.octree = new Octree();

    // Todo: add simple physics system using simple colliders
    const objects = [];
    
  }

  onModelsLoaded() {

  }

  tick(deltaTime) {

    const player = this.world.player;
    player.controls( deltaTime );
    player.update( deltaTime );
    player.teleportIfOob();

  }
}

export { PhysicsSystem };