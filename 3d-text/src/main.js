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

// Texture Loader
const loader = new THREE.TextureLoader();
const textures = Array.from({ length: 10 }, (_, i) => loader.load(`./textures/text${i + 1}.jpg`));
textures.forEach(tex => tex.colorSpace = THREE.SRGBColorSpace);

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

  const material = new THREE.MeshBasicMaterial({ map: textures[0] });
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

// Generate 100 random geometries with random textures
const randomShapes = [];
const geometryTypes = [
  new THREE.BoxGeometry(),
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.ConeGeometry(0.5, 1, 16),
  new THREE.CylinderGeometry(0.3, 0.3, 1, 16),
  new THREE.TorusGeometry(0.4, 0.15, 16, 32)
];

for (let i = 0; i < 180; i++) {
  const randomGeometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)].clone();
  const randomTexture = textures[Math.floor(Math.random() * textures.length)];
  const randomMaterial = new THREE.MeshBasicMaterial({ map: randomTexture });

  const mesh = new THREE.Mesh(randomGeometry, randomMaterial);
  mesh.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  mesh.scale.setScalar(Math.random() * 2);

  scene.add(mesh);
  randomShapes.push(mesh);
}

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
