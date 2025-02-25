import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

// Canvas
const canvas = document.querySelector('.webgl');
if (!canvas) {
  console.error('Canvas with class .webgl not found!');
}

// Scene
const scene = new THREE.Scene();

// Texture
const loader = new THREE.TextureLoader();
const color = loader.load('./textures/text1.jpg');
color.colorSpace = THREE.SRGBColorSpace;

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Load Font and Create Text
const fontLoader = new FontLoader();
let text;
fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('404', {
    font,
    size: 0.5,
    height: 0.5,
    depth: 0.1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 30,
  });

  const material = new THREE.MeshBasicMaterial({ map: color, wireframe: true });
  text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  // Center the text
  textGeometry.computeBoundingBox();
  const center = new THREE.Vector3();
  textGeometry.boundingBox.getCenter(center);
  text.position.set(-center.x, -center.y, -center.z);
});

// Axes and Grid Helpers
scene.add(new THREE.AxesHelper(2));
const gridHelper = new THREE.GridHelper(20, 100, 'gray', 'white');
gridHelper.position.y = -0.26;
scene.add(gridHelper);

// Animation
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  if (text) {
    // text.rotation.x = elapsedTime;
  }

  camera.position.y = Math.sin(elapsedTime) * 0.5;
  camera.position.x = Math.sin(elapsedTime) * 0.5;
  camera.position.z = Math.cos(elapsedTime) * 3;

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
