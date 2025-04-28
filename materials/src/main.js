import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


/**
 * Textures
 */

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);


const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 3, 2);
scene.add(directionalLight);

/**
 * Materials
 */




camera.position.z = 5;

const size = {
  width: window.innerWidth,
  height: window.innerHeight
};

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  renderer.setSize(size.width, size.height);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
if (window.innerWidth < 768) {
  camera.position.z = 7;
  cone.position.set(0, 3, 0);
  sphere.position.set(0, 0, 0);
  cylinder.position.set(0, -3, 0);
}

// --- lil-gui stuff



const clock = new THREE.Clock();
const animate = () => {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
 
};

animate();
