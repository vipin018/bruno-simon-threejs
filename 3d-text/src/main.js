import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

// canvas
const canvas = document.querySelector('.webgl');


// scene
const scene = new THREE.Scene();
// it is like a container that holds all the objects.

// fonts
const fontLoader = new FontLoader();
fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
  // console.log(font);
  const textGeometry = new TextGeometry('crash', {
    font: font,
    size: 0.5,
    height: 0.2,
    depth: 0.15,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 3,

  });
  const material = new THREE.MeshNormalMaterial({ color: "white", wireframe: false });
  const text = new THREE.Mesh(textGeometry, material);

  scene.add(text);
  textGeometry.computeBoundingBox();
  console.log(textGeometry.boundingBox);
});


// bounding box


// axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// grid helper
const gridHelper = new THREE.GridHelper(20, 100, "gray", "white");
scene.add(gridHelper);

// it is the material of the object which in this case is a blue color.
// meshmaterial is the combination of geometry and material

// mesh
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);


// add the mesh to the scene
// scene.add(cube);

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);
// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// animation
const clock = new THREE.Clock();

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  cube.rotation.y = elapsedTime;
  // camera.position.z = Math.sin(elapsedTime)*1.5;
  // camera.position.x = Math.cos(elapsedTime)*2;
}
animate();

// resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});