import * as THREE from 'three';

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
    width: 800,
    height: 600
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


