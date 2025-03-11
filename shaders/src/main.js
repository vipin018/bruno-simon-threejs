import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';
import vertexShader from './shaders/test/vertex.glsl';
import fragmentShader from './shaders/test/fragment.glsl';

const gui = new GUI({
  width: 100,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);
// camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Cube
const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  // wireframe: true,
  side: THREE.DoubleSide,
  transparent: true,
});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth controls

// Resize handling
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
