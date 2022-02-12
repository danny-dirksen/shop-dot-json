import { GLTFLoader } from './libs/GLTFLoader.js';
import { DRACOLoader } from './libs/DRACOLoader.js';

const PI = 3.1415926;

const query = document.location.search;
let search = {};
if (search[0] == '?') {
  search = Object.fromEntries(query.substring(1).split('&').map(entry => entry.split('=')))
}

const shopFileNames = ['craigslist-cars', 'amazon-toilet-paper', 'gucci', 'create-your-own'];
if (search.s) shopFileNames.push(search.s);

const shops = [];
shopFileNames.forEach(name => {
  fetch(`../shops/${name}.json`)
  .then(resp => resp.json())
  .then(shopData => {
    shops.push(shopData);
  });
});

class ModelManager {
  constructor(world) {
    this.world = world;
    this.scene = world.scene;

    // Initialize model loader

    this.loader = new GLTFLoader().setPath( '../models/' );

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/draco/' );
    this.loader.setDRACOLoader( dracoLoader );
  }

  loadAll(callBack) {
    // Load World

    this.loader.load('printer/printer.glb', gltf => {
      const printer = gltf.scene;
      printer.traverse( child => {

        if ( child.isMesh ) {

          child.castShadow = true;
          child.receiveShadow = true;
          child.material.roughness=0.6;

          if ( child.material.map ) {

            child.material.map.anisotropy = 8;

          }

        }

      } );
      let material = printer.mesh

      for (let i = 0; i < 7; i ++) {
        let dupe = printer.clone();
        dupe.position.set(16 - i, 0, -1.5);
        dupe.rotation.y = 3.1415926;
        this.scene.add(dupe);
      }
    });

    this.loader.load( 'map/mall.glb', ( gltf ) => {

      const map = gltf.scene;
      this.scene.add(map);

      

      globalThis.map = map;

      map.traverse( child => {

        if ( child.isMesh ) {

          child.castShadow = true;
          child.receiveShadow = true;

          if ( child.material.map ) {

            child.material.map.anisotropy = 8;

          }

        }

      } );

      const shop1 = map.children[0];
      globalThis.shop1 = shop1;
      map.remove(shop1);
      for (let i = 0; i < shops.length; i ++) {
        const shopData = shops[i];

        const newShop = shop1.clone();
        newShop.rotation.y = i * PI / 2;
        map.add(newShop);

        const materials = newShop.children.map (mesh => mesh.material);
        globalThis.materials = materials;
        newShop.children.forEach((mesh, index) => {
          let material = mesh.material;
          if (material.name == 'Walls-Indoor') {
            mesh.material = material.clone();
            mesh.material.color.set(shopData.palette.walls);
          }
          if (material.name == 'Floor-Indoor') {
            mesh.material = material.clone();
            mesh.material.color.set(shopData.palette.floor);
          }
        });
      }


      this.world.physicsSystem.octree.fromGraphNode( map );

      callBack();
    } );
  }
}

export { ModelManager };