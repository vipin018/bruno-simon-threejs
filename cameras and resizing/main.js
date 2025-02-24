import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let cursor;
// cursor position
window.addEventListener('mousemove', (e) => {
  // to make the cursor value between 0 to 1
  cursor = {
    x: e.clientX / sizes.width - 0.5,
    y: e.clientY / sizes.height - 0.5,
  }
  // console.log(cursor);


});


// canvas
const canvas = document.querySelector('#canvas');

// scene
const scene = new THREE.Scene();

// object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial({ color: "lightseagreen" });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// camera
const camera = new THREE.PerspectiveCamera(
  75, // it is the field of view
  sizes.width / sizes.height, // aspect ratio
  0.1, // nearest view camera can see
  100 // farthest view camera can see
);
// const camera = new THREE.OrthographicCamera(
//   sizes.width / -2,
//   sizes.width / 2,
//   sizes.height / 2,
//   sizes.height / -2,
//   0.1,
//   100
// );

camera.position.z = 3;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(sizes.width, sizes.height);

// render
renderer.render(scene, camera);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// animate
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // update camera position
  camera.position.x = -Math.sin(cursor.x * Math.PI * 2) * 3;
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  camera.position.y = cursor.y * 5;

  camera.lookAt(cube.position);
}
animate();