import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GUI } from 'lil-gui';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColor = textureLoader.load('./textures/door/color.jpg');
const doorAlpha = textureLoader.load('./textures/door/alpha.jpg');
const aoMap = textureLoader.load('./textures/door/ambientOcclusion.jpg');
const heightMap = textureLoader.load('./textures/door/height.jpg');
const normalMap = textureLoader.load('./textures/door/normal.jpg');
const roughnessMap = textureLoader.load('./textures/door/roughness.jpg');
const metalnessMap = textureLoader.load('./textures/door/metalness.jpg');

const matcapTexture = textureLoader.load('./textures/matcaps/9.png');

const gradientTexture = textureLoader.load('./textures/gradients/5.jpg');
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**
 * Materials
 */
// const material = new THREE.MeshBasicMaterial({
//   side: THREE.DoubleSide,
  // map: doorColor,
   // wireframe: true,
   // opacity: 0.5,
//   transparent: true,
//   alphaMap: doorAlpha,
// });

// const material = new THREE.MeshNormalMaterial({  
   // wireframe: true,
   // flatShading: true,
// });

// const material = new THREE.MeshMatcapMaterial({
//   matcap: matcapTexture,
// });

// const material = new THREE.MeshDepthMaterial({
// });

// const material = new THREE.MeshLambertMaterial({

// });

// const material = new THREE.MeshPhongMaterial({
//   shininess: 100,
//   specular: 0x1188ff,
  
// });

// const material = new THREE.MeshToonMaterial({
//   gradientMap: gradientTexture,
// });

const material = new THREE.MeshStandardMaterial({
  metalness: 0.65,
  roughness: 0.45,
  map: doorColor,
  aoMap: aoMap,
  aoMapIntensity: 0.5,
  displacementMap: heightMap,
  displacementScale: 0.05,
  // wireframe: true,
  normalMap: normalMap,
  alphaMap: doorAlpha,
  transparent: true,
});

/**
 * Geometries
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.5, 0.25, 128, 64),
  material
);
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2,32,32),
  material
);
plane.geometry.setAttribute(
  'uv2', 
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.5, 16, 60),
  material
);
scene.add(torusKnot);
scene.add(plane);
scene.add(torus);

torusKnot.position.x = -3;
plane.position.x = 0;
torus.position.x = 3;


camera.position.z = 5;

const size = {
  width: window.innerWidth,
  height: window.innerHeight
};
/**
 * GUI
 */
const gui = new GUI();
gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.001);

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
  torusKnot.position.y = -3;
  torusKnot.position.x = 0;
  plane.position.y = 0;
  torus.position.y = 3;
  torus.position.x = 0;
}




const clock = new THREE.Clock();
const animate = () => {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  torusKnot.rotation.y = -clock.getElapsedTime();
  torus.rotation.y = clock.getElapsedTime();
  // plane.rotation.y = -clock.getElapsedTime()*2;
};

animate();
