import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui'; // --- lil-gui import
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color("ghostwhite");

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("./textures/matcaps/7.png");

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);

const geometry1 = new THREE.CylinderGeometry(1, 1, 1, 32);
const geometry2 = new THREE.ConeGeometry(1, 1, 32);
const geometry3 = new THREE.SphereGeometry(1, 32, 32);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 3, 2);
scene.add(directionalLight);

/**
 * Materials
 */
let basicMaterial = new THREE.MeshBasicMaterial({ color: "#feaaa4" });
let depthMaterial = new THREE.MeshDepthMaterial();
let lambertMaterial = new THREE.MeshLambertMaterial({ color: "#feaaa4" });
let matcapMaterial = new THREE.MeshMatcapMaterial({ color: "#feaaa4", matcap: matcapTexture });
let normalMaterial = new THREE.MeshNormalMaterial();
let physicalMaterial = new THREE.MeshPhysicalMaterial({ color: "#feaaa4" });
let standardMaterial = new THREE.MeshStandardMaterial({ color: "#feaaa4" });
let toonMaterial = new THREE.MeshToonMaterial({ color: "#feaaa4" });

// --- Store materials in an object for easy switching
const materials = {
    basic: basicMaterial,
    depth: depthMaterial,
    lambert: lambertMaterial,
    matcap: matcapMaterial,
    normal: normalMaterial,
    physical: physicalMaterial,
    standard: standardMaterial,
    toon: toonMaterial
};

const cylinder = new THREE.Mesh(geometry1, toonMaterial);
const cone = new THREE.Mesh(geometry2, matcapMaterial);
const sphere = new THREE.Mesh(geometry3, lambertMaterial);

scene.add(cylinder);
scene.add(cone);
scene.add(sphere);

cylinder.position.set(0, 0, 0);
cone.position.set(3, 0, 0);
sphere.position.set(-3, 0, 0);

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
const gui = new GUI();
const options = {
    cylinderMaterial: 'toon',
    coneMaterial: 'matcap',
    sphereMaterial: 'lambert'
};

gui.add(options, 'cylinderMaterial', Object.keys(materials)).onChange(value => {
    cylinder.material = materials[value];
});
gui.add(options, 'coneMaterial', Object.keys(materials)).onChange(value => {
    cone.material = materials[value];
});
gui.add(options, 'sphereMaterial', Object.keys(materials)).onChange(value => {
    sphere.material = materials[value];
});

const clock = new THREE.Clock();
const animate = () => {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  sphere.rotation.y = clock.getElapsedTime();
  cone.rotation.x = clock.getElapsedTime();
  cylinder.rotation.z = clock.getElapsedTime();
};

animate();
