import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// canvas
const canvas = document.querySelector('.webgl');

// scene
const scene = new THREE.Scene();
// it is like a container that holds all the objects.

// geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
// it is the shape of the object which in this case is a cube.

// material
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
// it is the material of the object which in this case is a blue color.
// meshmaterial is the combination of geometry and material

// mesh
const mesh = new THREE.Mesh(geometry, material);

// add the mesh to the scene
scene.add(mesh);

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
renderer.shadowMap.enabled = true;
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
    mesh.rotation.y = elapsedTime;
    mesh.position.x = Math.sin(elapsedTime);
}
animate();