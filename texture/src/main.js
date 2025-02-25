import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene
const scene = new THREE.Scene();

// Texture loader
const loader = new THREE.TextureLoader();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// Spotlight
const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position
spotLight.position.set(0, 10, 0); // Position above the cube
spotLight.angle = Math.PI /10; // Spotlight angle
spotLight.penumbra = 0.5; // Soft edges
spotLight.decay = 1;
spotLight.distance = 20; // Range of the spotlight
// scene.add(spotLight);

// Create a spotlight helper for visualization
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

// Create a point light
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(0, 5, 0); // Position above the cube
pointLight.decay = 1; // it is like the intensity of the light but 
pointLight.distance = 20; // it is the range of the light
pointLight.intensity = 1; // it is the intensity of the light
pointLight.castShadow = true; // it is like the shadow of the light
pointLight.penumbra = 0.1; // it is the angle of the light
pointLight.angle = Math.PI / 10; // it is the angle of the light
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);





// Object (Cube)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
   color: 'white',
   metalness: 1,
   roughness: 0.2,
   emissive: 'white',
   emissiveIntensity: 0.5,
});
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0,1,0);
scene.add(cube);

// Create a horizontal plane beneath the cube
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 'white', side: THREE.DoubleSide, metalness: 0.5, roughness: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate plane to be horizontal
plane.position.y = -0.5; // Position it beneath the cube
scene.add(plane);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
