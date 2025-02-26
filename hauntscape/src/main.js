import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Timer } from 'three/addons/misc/Timer.js';
import { GUI } from 'lil-gui';

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight("white", 0.5)
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

const textureLoader = new THREE.TextureLoader();
const alphaTexture = textureLoader.load("./textures/floor/alpha.jpg");
const floorColorTexture = textureLoader.load("./textures/floor/ground/difussion.jpg");
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
const floorARMTexture = textureLoader.load("./textures/floor/ground/arm.jpg");
const floorNormalTexture = textureLoader.load("./textures/floor/ground/normal.jpg");
const floorDisplacementTexture = textureLoader.load("./textures/floor/ground/displacement.jpg");

floorColorTexture.repeat.set(10,10);
floorARMTexture.repeat.set(10,10);
floorNormalTexture.repeat.set(10,10);
floorDisplacementTexture.repeat.set(10,10);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;


// ground or floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20,100,100),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture, // ✅ Correctly assigns the main texture
    alphaMap: alphaTexture, // ✅ Assigns the alpha texture properly
    transparent: true, // ✅ Enables transparency
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.5,
    displacementBias: -0.2
})
)

const gui = new GUI();
gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name("Floor Displacement Scale");
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name("Floor Displacement Bias");


floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// house
const house = new THREE.Group()
scene.add(house)

const wallColorTexture = textureLoader.load("./textures/wall/diffusion.jpg");
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
const wallARMTexture = textureLoader.load("./textures/wall/arm.jpg");
const wallNormalTexture = textureLoader.load("./textures/wall/normal.jpg");



// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
)
walls.position.y = 1;
house.add(walls);

const roofColorTexture = textureLoader.load("./textures/roof/difussion.jpg");
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
const roofARMTexture = textureLoader.load("./textures/roof/arm.jpg");
const roofNormalTexture = textureLoader.load("./textures/roof/normal.jpg");

roofColorTexture.repeat.set(3,1);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.repeat.set(3,1);
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;
roofARMTexture.repeat.set(3,1);
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapT = THREE.RepeatWrapping;

// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
)
roof.position.y = 3;
roof.rotation.y = Math.PI / 4;
house.add(roof);

const doorColorTexture = textureLoader.load("./textures/door/diff.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorARMTexture = textureLoader.load("./textures/door/arm.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/nor.jpg");

// door
const door = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.5, 0.2),
  new THREE.MeshStandardMaterial({
    color:"brown",
    opacity: 0.9,
    transparent: true,
    map: doorColorTexture,
    aoMap: doorARMTexture,
    roughnessMap: doorARMTexture,
    metalnessMap: doorARMTexture,
    normalMap: doorNormalTexture,
  })
)
door.position.y = 0.8;
door.position.z = 2;
house.add(door);

const windowColorTexture = textureLoader.load("./textures/window/diff.jpg");
windowColorTexture.colorSpace = THREE.SRGBColorSpace;
const windowARMTexture = textureLoader.load("./textures/window/arm.jpg");
const windowNormalTexture = textureLoader.load("./textures/window/nor.jpg");



const windoww = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 0.5, 0.2),
  new THREE.MeshStandardMaterial({
    map: windowColorTexture,
    aoMap: windowARMTexture,
    roughnessMap: windowARMTexture,
    metalnessMap: windowARMTexture,
    normalMap: windowNormalTexture,
  })
)
windoww.position.y = 1.8;
windoww.position.z = 2;
windoww.position.x = 1.5;
house.add(windoww);

const bushColorTexture = textureLoader.load("./textures/bushes/diff.jpg");
bushColorTexture.colorSpace = THREE.SRGBColorSpace;
const bushARMTexture = textureLoader.load("./textures/bushes/arm.jpg");
const bushNormalTexture = textureLoader.load("./textures/bushes/nor.jpg");


// bushes
const bushGeometry = new THREE.SphereGeometry(0.5, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  color:"lightgreen",
  map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(1, 0.2, 2.2)
bush1.scale.set(1.2, 1, 1)
bush1.rotation.x = -0.75
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.set(1.7, 0.2, 2.2)
bush2.scale.set(0.5, 0.8, 0.5)
bush2.rotation.x = -0.75
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.position.set(-1.5, 0.2, 2.2)
bush3.scale.set(1, 0.8, 0.8)
bush3.rotation.x = -0.75
house.add(bush1, bush2, bush3);

// tree
const treeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3)
const treeMaterial = new THREE.MeshStandardMaterial({
 
})
const tree = new THREE.Mesh(treeGeometry, treeMaterial)
tree.position.set(5, 0.2, 2.2)
house.add(tree);

// tree leaf
const treeLeaf = new THREE.Mesh(
  new THREE.CylinderGeometry(0.01, 0.8, 3),
  new THREE.MeshStandardMaterial({
    color: "lime",
    map:bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
  })
)
treeLeaf.position.set(5, 2.5, 2.2)
house.add(treeLeaf);

// graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({})

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 50; i++) {

  const angle = Math.random() * Math.PI * 2;
  const radius = 4.5 + Math.random() * 5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const rotation = Math.random();
  // mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  graves.add(grave)
  grave.position.set(x, 0.25, z)
  grave.rotation.z = rotation*0.2;
  grave.rotation.x = rotation - 0.5;

}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 4;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


const timer = new Timer()

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  const elapsedTime = timer.elapsedTime;
  // mesh.rotation.y = elapsedTime;
}
animate();

function resize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
}
resize();

