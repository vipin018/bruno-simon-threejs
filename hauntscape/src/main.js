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

// ground or floor
const floor  = new THREE.Mesh(
  new THREE.PlaneGeometry(20,20),
  new THREE.MeshStandardMaterial()
)
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// house
const house = new THREE.Group()
scene.add(house)

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4,2.5,4),
  new THREE.MeshStandardMaterial({})
)
walls.position.y = 1;
house.add(walls);

// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5,1.5,4),
  new THREE.MeshStandardMaterial({})
)
roof.position.y = 3;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// door
const door = new THREE.Mesh(
  new THREE.BoxGeometry(1,1.5,0.2),
  new THREE.MeshStandardMaterial({})
)
door.position.y = 0.8;
door.position.z = 2;
house.add(door);

const windoww = new THREE.Mesh(
  new THREE.BoxGeometry(0.7,0.5,0.2),
  new THREE.MeshStandardMaterial({})
)
windoww.position.y = 1.8;
windoww.position.z = 2;
windoww.position.x = 1.5;
house.add(windoww);

// tree
const tree = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2,0.2,3),
  new THREE.MeshStandardMaterial({})
)
tree.position.y = 1;
tree.position.z = 2;
tree.position.x = 5;
house.add(tree);

// tree leaf
const treeLeaf = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2,0.8,3),
  new THREE.MeshStandardMaterial({})
)
treeLeaf.position.y = 2;
treeLeaf.position.z = 2;
treeLeaf.position.x = 5;
house.add(treeLeaf);

// 

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1,100);
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

