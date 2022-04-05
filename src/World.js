import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Debug, Physics, useTrimesh } from '@react-three/cannon';
import {} from 'three';
import { User } from './User';
import useFetch from 'react-fetch-hook';

function MapSection(props) {
  const data = props.data;

  const [ref] = useTrimesh(() => ({ args: data.trimeshArgs, mass: 0, rotation: props.rotation}));

  return (
    <>
      <primitive rotation={props.rotation} object={data.map}></primitive>
      <mesh rotation={props.rotation} ref={ref} geometry={data.colGeo} visible={false}></mesh>
    </>
  );
}

function Map(props) {
  const gltf = useGLTF('/models/map/mall.glb', '/draco/');
  const collision = gltf.nodes.collision;
  const map = gltf.nodes.mall;

  const verts = collision.geometry.attributes.position.array;
  const indices = collision.geometry.index.array;

  const shopFetches = [
    useFetch(`/shops/amazon-amazon-toilet-paper.json`),
    useFetch(`/shops/craigslist-cars.json`),
    useFetch(`/shops/gucci.json`),
    useFetch(`/shops/create-your-own.json`)
  ];

  const loaded = shopFetches.every(shopFetch => !shopFetch.isLoading);
  if (!loaded) {
    return <></>
  }

  const shops = shopFetches.map( shopFetch => {
      const { isLoading, data, err } = shopFetch;
      return {...data};
    }
  );

  return (
    <>
      {/* <instancedMesh ref={} args={[null, null, count]}></instancedMesh> */}
      <MapSection rotation={[0, 0 * Math.PI / 2, 0]} data={{trimeshArgs: [verts, indices], colGeo: collision.geometry, map: map}}></MapSection>
      <MapSection rotation={[0, 1 * Math.PI / 2, 0]} data={{trimeshArgs: [verts, indices], colGeo: collision.geometry, map: map}}></MapSection>
    </>
  );

};

export default function World(props) {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight />
      <Physics size={100} iterations={2} maxSubSteps={2}>
        <Debug color="black" scale={1.001}>
          <User position={[2, 10, -2]} />
          <Map scale={[4,4,4]} />
        </Debug>
      </Physics>
    </Canvas>
  )
}