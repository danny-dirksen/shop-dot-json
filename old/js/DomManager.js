import * as THREE from './libs/three.module.js';

class DomManager {
  constructor(world) {
    // Create and configure renderer
    this.world = world;
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;

    const container = document.getElementById( 'container' );

    container.appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', () => this.handleResize() );
  }

  handleResize() {
    this.world.camera.aspect = window.innerWidth / window.innerHeight;
    this.world.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  render() {
    this.renderer.render(this.world.scene, this.world.camera);
  }
}

export { DomManager }