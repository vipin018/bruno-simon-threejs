import * as THREE from 'three';

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
// it is the combination of geometry, material and position.

// add the mesh to the scene
scene.add(mesh);


