import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color("ghostwhite");

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
// MeshBasicMaterial
let basicMaterial = new THREE.MeshBasicMaterial({
  color: "#feaaa4",
});

let depthMaterial = new THREE.MeshDepthMaterial({
  color: "#feaaa4",
});

let lambertMaterial = new THREE.MeshLambertMaterial({
  color: "#feaaa4",
});

let matcapMaterial = new THREE.MeshMatcapMaterial({
  color: "#feaaa4",
});

let normalMaterial = new THREE.MeshNormalMaterial({
  color: "#feaaa4",
});

let physicalMaterial = new THREE.MeshPhysicalMaterial({
  color: "#feaaa4",
});

let standardMaterial = new THREE.MeshStandardMaterial({
  color: "#feaaa4",
})

let toonMaterial = new THREE.MeshToonMaterial({
  color: "#feaaa4",
})


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
}

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

const clock = new THREE.Clock();
const animate = () => {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  sphere.rotation.y = clock.getElapsedTime();
  cone.rotation.x = clock.getElapsedTime();
  cylinder.rotation.z = clock.getElapsedTime();
}

animate();