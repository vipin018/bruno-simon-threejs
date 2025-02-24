import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// Cursor position
let cursor = { x: 0, y: 0 };

window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

// Canvas
const canvas = document.querySelector('#canvas');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Improves performance on high-DPI screens

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;

// FlyControls
/*
const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 10;
controls.autoForward = false; // Disable constant forward movement
controls.dragToLook = true; // Allows camera movement when clicking & dragging
*/

// Animate
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update(0.01); // Pass delta time for smoother movement

  // Optional: Camera follows cursor
  // camera.position.x = -Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;

  camera.lookAt(cube.position);

  renderer.render(scene, camera);
}

animate();
