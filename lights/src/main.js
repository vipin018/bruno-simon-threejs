import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

const canvas = document.querySelector('.webgl');

const scene = new THREE.Scene();

/**
 * Lights
 */

// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// DIRECTIONAL LIGHT
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);

// HEMISPHERICAL LIGHT
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
scene.add(hemisphereLight);

// POINT LIGHT
const pointLight = new THREE.PointLight(0xff9000, 1);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

// RECTANGLE LIGHT
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
scene.add(rectAreaLight);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());

// SPOT LIGHT
const spotLight = new THREE.SpotLight(0x78ff00, 1, 10, Math.PI *0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

/**
 * HELPERS
 */

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight);
scene.add(hemisphereLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const rectHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectHelper);

const geometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);
const material = new THREE.MeshPhysicalMaterial({
    roughness: 0.4,
});


const cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5; // Positioning above the plane
scene.add(cube)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
);
sphere.position.x = -1.5;
sphere.position.y = 0.5;
scene.add(sphere);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 60),
    material
);
torus.position.x = 2;
torus.position.y = 0.5;
scene.add(torus);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    material
);
plane.rotation.x = -Math.PI / 2; // Make it horizontal
plane.position.y = 0; // Position it below the objects
scene.add(plane);

// Camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 2;
camera.position.y = 1;
camera.position.x = 2;
scene.add(camera);

if (window.innerWidth < 768) {
    camera.position.z = 4;
    camera.position.y = 1;
    camera.position.x = 4;
}

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
    cube.rotation.x = clock.getElapsedTime() / 2;
    sphere.rotation.x = clock.getElapsedTime() / 2;
    torus.rotation.x = clock.getElapsedTime() / 2;

    
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

window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// GUI
const gui = new GUI();
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x').min(0).max(10).step(0.01);
cameraFolder.add(camera.position, 'y').min(0).max(10).step(0.01);
cameraFolder.add(camera.position, 'z').min(0).max(10).step(0.01);
cameraFolder.close();

const ambientLightFolder = gui.addFolder('Ambient Light');
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(5).step(0.01);
ambientLightFolder.add(ambientLight, 'visible');
ambientLightFolder.close();

const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(5).step(0.01);
directionalLightFolder.add(directionalLight.position, 'x').min(-10).max(10).step(0.01);
directionalLightFolder.add(directionalLight.position, 'y').min(-10).max(10).step(0.01);
directionalLightFolder.add(directionalLight.position, 'z').min(-10).max(10).step(0.01);
directionalLightFolder.add(directionalLight, 'visible');
directionalLightFolder.close();

const hemisphereLightFolder = gui.addFolder('Hemisphere Light');
hemisphereLightFolder.add(hemisphereLight, 'intensity').min(0).max(5).step(0.01);
hemisphereLightFolder.add(hemisphereLight, 'visible');
hemisphereLightFolder.close();

const pointLightFolder = gui.addFolder('Point Light');
pointLightFolder.add(pointLight, 'intensity').min(0).max(5).step(0.01);
pointLightFolder.add(pointLight.position, 'x').min(-10).max(10).step(0.01);
pointLightFolder.add(pointLight.position, 'y').min(-10).max(10).step(0.01);
pointLightFolder.add(pointLight.position, 'z').min(-10).max(10).step(0.01);
pointLightFolder.add(pointLight, 'visible');
pointLightFolder.close();

const rectAreaLightFolder = gui.addFolder('Rect Area Light');
rectAreaLightFolder.add(rectAreaLight, 'intensity').min(0).max(5).step(0.01);
rectAreaLightFolder.add(rectAreaLight.position, 'x').min(-10).max(10).step(0.01);
rectAreaLightFolder.add(rectAreaLight.position, 'y').min(-10).max(10).step(0.01);
rectAreaLightFolder.add(rectAreaLight.position, 'z').min(-10).max(10).step(0.01);
rectAreaLightFolder.add(rectAreaLight, 'visible');
rectAreaLightFolder.close();

const spotLightFolder = gui.addFolder('Spot Light');
spotLightFolder.add(spotLight, 'intensity').min(0).max(5).step(0.01);
spotLightFolder.add(spotLight.position, 'x').min(-10).max(10).step(0.01);
spotLightFolder.add(spotLight.position, 'y').min(-10).max(10).step(0.01);
spotLightFolder.add(spotLight.position, 'z').min(-10).max(10).step(0.01);
spotLightFolder.add(spotLight, 'angle').min(0).max(Math.PI).step(0.01);
spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.01);
spotLightFolder.add(spotLight, 'decay').min(0).max(2).step(0.01);
spotLightFolder.add(spotLight, 'distance').min(0).max(10).step(0.01);
spotLightFolder.add(spotLight, 'visible');
spotLightFolder.close();