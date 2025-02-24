import * as THREE from 'three';
import gsap from 'gsap';

// canvas
const canvas = document.querySelector('#canvas');

// scene
const scene = new THREE.Scene();

// object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xafafaf });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// sizes
const sizes = {
  width: 800,
  height: 600
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

// render
renderer.render(scene, camera);
/*
// time
let time = Date.now();

// Animation
const animation = () => {

  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;
  // console.log(deltaTime);
  window.requestAnimationFrame(animation);
  renderer.render(scene, camera);
  cube.rotation.y += 0.002*deltaTime;
}

animation();

// clock
const clock = new THREE.Clock();

const animation = () => {
  const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime);
  window.requestAnimationFrame(animation);
  // cube.rotation.x = Math.sin(elapsedTime);
  camera.position.x = Math.sin(elapsedTime);
  camera.position.y = Math.cos(elapsedTime);
  camera.lookAt(cube.position);
  renderer.render(scene, camera);
}
animation();

*/

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
// gsap

gsap.to(cube.rotation, {
  y: Math.PI * 2,
  duration: 1,
  delay: 1,
  ease: 'power2.inOut',
  yoyo: true,
  repeat: -1,
})
