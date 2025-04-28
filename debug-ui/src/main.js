import * as THREE from "three";
import GUI from "lil-gui";

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Create renderer
const canvas = document.querySelector("#draw");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Handle window resize
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});

// Fullscreen toggle on double click
window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// GUI
const gui = new GUI();
const cubeFolder = gui.addFolder("Cube Features");

// Correct way: Access .x, .y, .z
cubeFolder.add(cube.position, "x", -5, 5, 0.01).name("Position X");
cubeFolder.add(cube.position, "y", -5, 5, 0.01).name("Position Y");
cubeFolder.add(cube.position, "z", -5, 5, 0.01).name("Position Z");

cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01).name("Rotation X");
cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01).name("Rotation Y");
cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01).name("Rotation Z");

cubeFolder.add(cube.scale, "x", 0, 5, 0.01).name("Scale X");
cubeFolder.add(cube.scale, "y", 0, 5, 0.01).name("Scale Y");
cubeFolder.add(cube.scale, "z", 0, 5, 0.01).name("Scale Z");

// Color control (the better way)
const cubeSettings = {
  color: material.color.getStyle(), // "rgb()" string
};

cubeFolder.addColor(cubeSettings, "color").onChange((value) => {
  material.color.setStyle(value);
});

// Settings for GUI
const geometrySettings = {
  shape: "Box", // default
};

// Geometry options folder
const geometryFolder = gui.addFolder("Geometry Features");

geometryFolder
  .add(geometrySettings, "shape", ["Box", "Sphere", "Cone", "Torus","TorusKnot", "Cylinder", "Tetrahedron", "Octahedron"])
  .name("Shape")
  .onChange((value) => {
    let newGeometry;
    switch (value) {
      case "Box":
        newGeometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case "Sphere":
        newGeometry = new THREE.SphereGeometry(0.75, 32, 32);
        break;
      case "Cone":
        newGeometry = new THREE.ConeGeometry(0.7, 1.2, 32);
        break;
      case "Torus":
        newGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
        break;
      case "TorusKnot":
        newGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
        break;
      case "Cylinder":
        newGeometry = new THREE.CylinderGeometry(0.7, 0.7, 1, 32);
        break;
      case "Tetrahedron":
        newGeometry = new THREE.TetrahedronGeometry(1, 0);
        break;
      case "Octahedron":
        newGeometry = new THREE.OctahedronGeometry(1, 0);
        break;
        
    }
    cube.geometry.dispose(); // IMPORTANT! Free old geometry from memory
    cube.geometry = newGeometry; // Apply new geometry
  });

geometryFolder.open();


// Open the folder
cubeFolder.close();


// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
