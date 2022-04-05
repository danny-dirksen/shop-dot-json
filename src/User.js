import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { PerspectiveCamera, PointerLockControls } from '@react-three/drei';
import { useSphere } from '@react-three/cannon';
// import { Vec3 } from 'cannon';
import { Vector3 } from 'three';

function vecLength(x, y, z) {
  return Math.sqrt(x ^ 2, y ^ 2, z ^ 2);
}

const helperVec3_1 = new Vector3();
const helperVec3_2 = new Vector3();

export function User(props) {
  const camRef = useRef(null);
  const plcRef = useRef(null);
  const groupRef = useRef(null);
  const size = 0.01;
  const [sphereRef, api, x] = useSphere(() => ({ ...props, mass: 1, type: "Dynamic", scale: size})); // mesh also returned, but not used
  // console.log(sphereRef, api);
  useEffect(() => {
    plcRef.current.object = plcRef.current.camera = camRef.current;
    // console.log(camRef.current, plcRef.current, groupRef.current, mesh.current, api);
  });

  useEffect(() => {
    api.position.subscribe(pos => {
      groupRef.current.position.set(pos[0], pos[1], pos[2]);
    });
  });


  // annoying
  const velocity = useRef(null);
  velocity.current = velocity.current || new Vector3();
  api.velocity.subscribe(newVel => {
    // if (velocity.current == null) {
    //   velocity.current = new Vector3();
    // }
    // console.log(newVel)
    velocity.current.set(newVel[0], newVel[1], newVel[2]);
  });

  useFrame(() => {

    api.angularVelocity.set(0, 0, 0);
    api.rotation.set(0, 0, 0);

    const dir = helperVec3_1; // used for direction and scale of WASD force
    const vel = velocity.current; // used for player velocity

    dir.set(
      - keys.KeyA + keys.KeyD,
      0,
      - keys.KeyW + keys.KeyS
    );
    dir.applyQuaternion(camRef.current.quaternion);
    dir.y = 0;
    dir.normalize();
    const speed = vel.length();
    if (speed > 0.1) {
      dir.multiplyScalar(1 / speed);
    }
    api.applyImpulse([dir.x, dir.y, dir.z], [0, 0, 0]);
  });

  const [keys, setKeys] = useState({ KeyW: false, KeyA: false, KeyS: false, KeyD: false, Space: false });

  const handleKeyDown = (e) => {
    setKeys({ ...keys, [e.code]: true });
  };

  const handleKeyUp = (e) => {
    setKeys({ ...keys, [e.code]: false });
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  });

  return (
    <group {...props} ref={groupRef} >
      <PerspectiveCamera makeDefault position={[0, 1.75, 0]} rotation={[-0.8, 0, 0]} ref={camRef} />
      <PointerLockControls ref={plcRef}></PointerLockControls>
    </group>
  );
}
