import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// canvas
const canvas = document.querySelector('.webgl');

// scene
const scene = new THREE.Scene();

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 3, 1); // Adjusted position for better shadow visibility
scene.add(directionalLight);

// Shadow properties for the light
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.radius = 5;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;

// geometry
const geometry = new THREE.SphereGeometry(1, 32, 32);

// material
const material = new THREE.MeshStandardMaterial({ 
    metalness: 0.5,
    roughness: 0.3
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
// Shadow properties for the sphere
mesh.castShadow = true;
mesh.receiveShadow = true;

// floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 7),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
);
scene.add(floor);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;

// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
camera.position.x = 1;
camera.position.y = 1;
camera.rotateX = Math.PI*0.5;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
// Enable shadows in renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow edges
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
    
}
animate();