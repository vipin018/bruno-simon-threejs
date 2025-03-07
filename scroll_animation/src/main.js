import * as THREE from 'three';
import { GUI } from 'lil-gui';

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(1, 0.25, 0);
scene.add(directionalLight1);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

const material1 = new THREE.MeshToonMaterial();
const material2 = new THREE.MeshToonMaterial();
const material3 = new THREE.MeshToonMaterial();

// Load Textures Properly
textureLoader.load("textures/3.jpg", (texture) => {
    material1.map = texture;
    material1.needsUpdate = true;
});

textureLoader.load("textures/5.jpg", (texture) => {
    material2.map = texture;
    material3.map = texture;
    material2.needsUpdate = true;
    material3.needsUpdate = true;
});

// Meshes
const mesh1 = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.4, 100, 16), material1);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 16), material2);
const mesh3 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 100, 16), material3);
scene.add(mesh1, mesh2, mesh3);

// GUI
const gui = new GUI();
const params = {
    mesh1Color: '#ffffff',
    mesh2Color: '#ffffff',
    mesh3Color: '#ffffff',
};

// Color Control (Removes Texture for Visibility)
gui.addColor(params, 'mesh1Color').onChange((value) => {
    material1.color.set(value);
    material1.map = null; // Remove texture for color visibility
    material1.needsUpdate = true;
});
gui.addColor(params, 'mesh2Color').onChange((value) => {
    material2.color.set(value);
    material2.map = null;
    material2.needsUpdate = true;
});
gui.addColor(params, 'mesh3Color').onChange((value) => {
    material3.color.set(value);
    material3.map = null;
    material3.needsUpdate = true;
});

// Camera & Renderer
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
