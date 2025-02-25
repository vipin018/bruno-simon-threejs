import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';
const canvas = document.querySelector('.webgl');

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.5);
scene.add(hemisphereLight);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0,
    // metalness: 1,

});

const cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5; // Positioning above the plane
scene.add(cube);

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0,
        // metalness: 1,
    })
);
sphere.position.set(-1.5, 0.5, 0);
scene.add(sphere);

// Torus
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 16, 60),
    new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0,
        // metalness: 1,

    })
);
torus.position.set(2, 0.5, 0);
scene.add(torus);

// Plane (Ground)
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.3,
       
    })
);
plane.rotation.x = -Math.PI / 2; // Make it horizontal
plane.position.y = -0.2; // Position it below the objects
scene.add(plane);

// Camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
camera.position.y = 2;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation Loop
const clock = new THREE.Clock();
function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    cube.rotation.x = clock.getElapsedTime()/2;
    sphere.rotation.x = clock.getElapsedTime()/2;
    torus.rotation.x = clock.getElapsedTime()/2;
}
animate();

// Resize Handling
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

const gui = new GUI();
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.01);
gui