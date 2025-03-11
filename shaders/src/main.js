import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Cube
const geometry = new THREE.PlaneGeometry(5, 5, 32, 32);
const material = new THREE.RawShaderMaterial({
  vertexShader: `
  uniform mat4 projectionMatrix; 
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;

  attribute vec3 position;

  void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
  `,
  fragmentShader: `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
  `,
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
