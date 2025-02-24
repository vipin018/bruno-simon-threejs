import * as THREE from 'three';
import { GUI } from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
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
const gui = new GUI();
const cubeFolder = gui.addFolder('Cube Controls');
cubeFolder.add(cube.position, 'x', -5, 5).name('Position X');
cubeFolder.add(cube.position, 'y', -5, 5).name('Position Y');
cubeFolder.add(cube.position, 'z', -5, 5).name('Position Z');
cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2).name('Rotation X');
cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2).name('Rotation Y');
cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2).name('Rotation Z');
cubeFolder.add(cube.scale, 'x', 0, 5).name('Scale X');
cubeFolder.add(cube.scale, 'y', 0, 5).name('Scale Y');
cubeFolder.add(cube.scale, 'z', 0, 5).name('Scale Z');
// Color control
const cubeColor = { color: '#ff0000' };
cubeFolder.addColor(cubeColor, 'color').onChange((value) => {
  cube.material.color.set(value);
});

// Visibility toggle
cubeFolder.add(cube, 'visible').name('Toggle Visibility');

cubeFolder.open(); // Opens the folder by default

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
