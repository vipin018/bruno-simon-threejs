import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Environment Map
 */
rgbeLoader.load('/environmentMaps/1/2k.hdr', function (envMap) {
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envMap;
  scene.environment = envMap;
});

/**
 * GLTF Model
 */
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(10, 10, 10);
});

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: '#aaaaaa',
  })
);
torusKnot.position.set(-3, 4, 0);
scene.add(torusKnot);

/**
 * Holy Donut
 */
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(6, 0.5, 100, 32),
  new THREE.MeshBasicMaterial({ color: 'white' })
);
holyDonut.position.y = 3.5;
scene.add(holyDonut);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace; // Correct color space

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animations
  torusKnot.rotation.y = elapsedTime;
  holyDonut.rotation.x = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();

/**
 * Debug GUI
 */
gui.add(scene, 'environmentIntensity').min(0).max(1).step(0.001).name('environment Intensity');
gui.add(scene, 'backgroundIntensity').min(0).max(1).step(0.001).name('Background Intensity');
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.0001).name('Background Blurriness');
