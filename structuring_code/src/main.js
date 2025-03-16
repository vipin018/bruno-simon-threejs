import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 5;

const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientlight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 1);
scene.add(directionalLight);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 0.5 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;
function animate() {
  control.update();
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
