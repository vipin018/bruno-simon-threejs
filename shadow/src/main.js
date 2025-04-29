import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

// Debug GUI
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x696969, 2, 10);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, window.innerWidth < 768 ? 4 : 2);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xc5c5c5, 1);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.bottom = -7;
scene.add(directionalLight);

// Helpers
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);

// GUI: Directional Light
const lightFolder = gui.addFolder('Directional Light');
lightFolder.add(directionalLight, 'intensity').min(0).max(5).step(0.01);
lightFolder.add(directionalLight.position, 'x').min(-10).max(10).step(0.01);
lightFolder.add(directionalLight.position, 'y').min(-10).max(10).step(0.01);
lightFolder.add(directionalLight.position, 'z').min(-10).max(10).step(0.01);
lightFolder.close();

// GUI: Shadow Camera
const shadowFolder = gui.addFolder('Shadow Camera');
const updateShadowCamera = () => {
  directionalLight.shadow.camera.updateProjectionMatrix();
  directionalLightCameraHelper.update(); // also update helper visuals
};
shadowFolder.add(directionalLight.shadow.camera, 'near').min(0.1).max(15).step(0.01).onChange(updateShadowCamera);
shadowFolder.add(directionalLight.shadow.camera, 'far').min(0.1).max(15).step(0.01).onChange(updateShadowCamera);
shadowFolder.add(directionalLight.shadow.camera, 'left').min(-10).max(10).step(0.01).onChange(updateShadowCamera);
shadowFolder.add(directionalLight.shadow.camera, 'right').min(-10).max(10).step(0.01).onChange(updateShadowCamera);
shadowFolder.add(directionalLight.shadow.camera, 'top').min(-10).max(10).step(0.01).onChange(updateShadowCamera);
shadowFolder.add(directionalLight.shadow.camera, 'bottom').min(-10).max(10).step(0.01).onChange(updateShadowCamera);
shadowFolder.close();

// Materials
const material = new THREE.MeshPhysicalMaterial({ roughness: 0.4, metalness: 0.1 });

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

scene.add(sphere, plane);

// Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen toggle on double click
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
