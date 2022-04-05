import * as THREE from './libs/three.module.js';
import { Capsule } from './libs/Capsule.js';

const GRAVITY = 30;

class Player {
  constructor(world) {
    
    this.world = world;
    this.camera = world.camera;

    // Player movement

    this.collider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 );

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.onFloor = false;

    this.keyStates = {};

    const vector1 = new THREE.Vector3();
    const vector2 = new THREE.Vector3();
    const vector3 = new THREE.Vector3();

    document.addEventListener( 'keydown', ( event ) => {

      this.keyStates[ event.code ] = true;

    } );

    document.addEventListener( 'keyup', ( event ) => {

      this.keyStates[ event.code ] = false;

    } );

    document.addEventListener( 'mousedown', () => {

      document.body.requestPointerLock();

    } );

    document.body.addEventListener( 'mousemove', ( event ) => {

      if ( document.pointerLockElement === document.body ) {

        this.camera.rotation.y -= event.movementX / 500;
        this.camera.rotation.x -= event.movementY / 500;

      }

    } );
  }

  calcCollisions() {

    const result = this.world.physicsSystem.octree.capsuleIntersect( this.collider );

    this.onFloor = false;

    if ( result ) {

      this.onFloor = result.normal.y > 0;

      if ( ! this.onFloor ) {

        this.velocity.addScaledVector( result.normal, - result.normal.dot( this.velocity ) );

      }

      this.collider.translate( result.normal.multiplyScalar( result.depth ) );

    }

  }

  update( deltaTime ) {

    let damping = Math.exp( - 4 * deltaTime ) - 1;

    if ( ! this.onFloor ) {

      this.velocity.y -= GRAVITY * deltaTime;

      // small air resistance
      damping *= 0.1;

    }

    this.velocity.addScaledVector( this.velocity, damping );

    const deltaPosition = this.velocity.clone().multiplyScalar( deltaTime );
    this.collider.translate( deltaPosition );

    this.calcCollisions();

    this.camera.position.copy( this.collider.end );

  }

  getForwardVector() {

    this.camera.getWorldDirection( this.direction );
    this.direction.y = 0;
    this.direction.normalize();

    return this.direction;

  }

  getSideVector() {

    this.camera.getWorldDirection( this.direction );
    this.direction.y = 0;
    this.direction.normalize();
    this.direction.cross( this.camera.up );

    return this.direction;

  }

  controls( deltaTime ) {

    // gives a bit of air control
    const speedDelta = deltaTime * ( this.onFloor ? 12 : 4 );

    if ( this.keyStates[ 'KeyW' ] ) {

      this.velocity.add( this.getForwardVector().multiplyScalar( speedDelta ) );

    }

    if ( this.keyStates[ 'KeyS' ] ) {

      this.velocity.add( this.getForwardVector().multiplyScalar( - speedDelta ) );

    }

    if ( this.keyStates[ 'KeyA' ] ) {

      this.velocity.add( this.getSideVector().multiplyScalar( - speedDelta ) );

    }

    if ( this.keyStates[ 'KeyD' ] ) {

      this.velocity.add( this.getSideVector().multiplyScalar( speedDelta ) );

    }

    if ( this.onFloor ) {

      if ( this.keyStates[ 'Space' ] ) {

        this.velocity.y = 10;

      }

    }

  }

  teleportIfOob() {

    if ( this.camera.position.y <= - 25 ) {

      this.collider.start.set( 0, 0.35, 0 );
      this.collider.end.set( 0, 1, 0 );
      this.collider.radius = 0.35;
      this.camera.position.copy( this.collider.end );
      this.camera.rotation.set( 0, 0, 0 );

    }

  }
}

export { Player };
