import * as THREE from 'three';
// import { GUI } from 'lil-gui';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// Scene
const scene = new THREE.Scene();

// texture
const loader = new THREE.TextureLoader();
// const colorTexture = loader.load('./textures/door/color.jpg');
// const alphaTexture = loader.load('./textures/door/alpha.jpg');
// const heightTexture = loader.load('./textures/door/height.jpg');
// const normalTexture = loader.load('./textures/door/normal.jpg');
// const metalnessTexture = loader.load('./textures/door/metalness.jpg');
// const roughnessTexture = loader.load('./textures/door/roughness.jpg');
// const minecraftTexture = loader.load('./textures/minecraft.png');
// const checkerboardTexture = loader.load('./textures/checkerboard-1024x1024.png');
// const checkerboardTexture = loader.load('./textures/checkerboard-8x8.png');

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 15);
// scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xafafaf, 20);
directionalLight1.position.set(3,3,3);
scene.add(directionalLight1);
const directionalLight2 = new THREE.DirectionalLight(0xafafaf, 20);
directionalLight2.position.set(-3,3,3);
scene.add(directionalLight2);

const directionalLightHelper1 = new THREE.DirectionalLightHelper(directionalLight1, 1);
scene.add(directionalLightHelper1);
const directionalLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
scene.add(directionalLightHelper2);

const pointLight = new THREE.PointLight(0xafafaf, 200, 50, 1);
pointLight.position.set(0,0,5);
pointLight.castShadow = true;

scene.add(pointLight);
const pointHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointHelper);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
   color: '#a96666',
  metalness: 1,
  roughness: 0.2,
  emissive: 'white',
  emissiveIntensity: 0.1,
  vertexColors: true,
 
 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);



// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// lil-gui
// const gui = new GUI();
// const cubeFolder = gui.addFolder('Cube Controls');

// // Color control
// const cubeColor = { color: '#ff0000' };
// cubeFolder.addColor(cubeColor, 'color').onChange((value) => {
//   cube.material.color.set(value);
// });

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
