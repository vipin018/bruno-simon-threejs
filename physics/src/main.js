import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;
camera.position.y = 3;
camera.position.x = 3;
const canvas = document.querySelector('canvas');  
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Improve rendering quality on high-DPI screens

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 3, 1);
scene.add(directionalLight);

const SphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const SphereMaterial = new THREE.MeshStandardMaterial({ 
  roughness: 0.5,
  metalness: 0.5,
 });
const sphere = new THREE.Mesh(SphereGeometry, SphereMaterial);
scene.add(sphere);

const PlaneGeometry = new THREE.PlaneGeometry(10, 10);
const PlaneMaterial = new THREE.MeshStandardMaterial({ 
  roughness: 0.5,
  metalness: 0.9,
 });
const plane = new THREE.Mesh(PlaneGeometry, PlaneMaterial);
scene.add(plane);
plane.rotateX(-Math.PI / 2);
plane.position.y = -1;



const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Function to resize renderer and camera aspect ratio
function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

// Event listener for window resize
window.addEventListener('resize', onWindowResize);
