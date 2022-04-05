import * as THREE from './libs/three.module.js';
import Stats from './libs/stats.module.js';
import { Player } from './Player.js';
import { PhysicsSystem } from './PhysicsSystem.js';
import { ModelManager } from './ModelManager.js';

const STEPS_PER_FRAME = 5;

class World {
  constructor() {

    // Creat scene
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.rotation.order = 'YXZ';

    this.player = new Player(this);

    this.physicsSystem = new PhysicsSystem(this);

    this.scene.background = new THREE.Color( 0x88ccff );
    
    // Lighting
    
    const ambientlight = new THREE.AmbientLight( 0x6688cc );
    this.scene.add( ambientlight );
    
    const fillLight1 = new THREE.DirectionalLight( 0xff9999, 0.5 );
    fillLight1.position.set( - 1, 1, 2 );
    this.scene.add( fillLight1 );
    
    const fillLight2 = new THREE.DirectionalLight( 0x8888ff, 0.2 );
    fillLight2.position.set( 0, - 1, 0 );
    this.scene.add( fillLight2 );
    
    const directionalLight = new THREE.DirectionalLight( 0xffffaa, 1.2 );
    directionalLight.position.set( - 15, 25, - 10 );
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.left = - 30;
    directionalLight.shadow.camera.top	= 30;
    directionalLight.shadow.camera.bottom = - 30;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 4;
    directionalLight.shadow.bias = - 0.00006;
    this.scene.add( directionalLight );

    // Track FPS and other statistics

    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';

    container.appendChild( this.stats.domElement );

    this.modelManager = new ModelManager(this);
  }

  loadModels(callback) {
    this.modelManager.loadAll( () => {
      this.physicsSystem.onModelsLoaded();
      callback();
    });
  }

  tick(deltaTime) {
    // we look for collisions in substeps to mitigate the risk of
    // an object traversing another too quickly for detection.

    for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {
      this.physicsSystem.tick(deltaTime / STEPS_PER_FRAME);
    }

    this.stats.update();
  }
}

export { World };