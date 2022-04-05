import * as THREE from './libs/three.module.js';
import { World } from './World.js';
import { DomManager } from './DomManager.js';

// Initialize everything

let world = new World();
let domManager = new DomManager(world);
const clock = new THREE.Clock();

world.loadModels(onModelsLoaded);

function onModelsLoaded() {
  animate();
}

// Main render loop

function animate() {

  const deltaTime = Math.min( 0.05, clock.getDelta() );

  world.tick(deltaTime);

  domManager.render();

  requestAnimationFrame( animate );

}

globalThis.theWorld = world;