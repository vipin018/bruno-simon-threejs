import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "lil-gui";
import * as CANNON from "cannon-es";

// === Scene & Renderer ===
const scene = new THREE.Scene();
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// === Camera ===
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(3, 3, 6);
scene.add(camera);

// === Lights ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 3, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
scene.add(directionalLight);

// === Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Physics World (Cannon.js) ===
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
const defaultMaterial = new CANNON.Material("default");
world.defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  restitution: 0.8,
  friction: 0.1,
});
world.addContactMaterial(world.defaultContactMaterial);

// === Floor (Cannon.js) ===
const floorBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
  material: defaultMaterial,
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
world.addBody(floorBody);

// === Floor (Three.js) ===
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.5 })
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// === Objects Storage ===
const objects = [];

// === Reusable Material ===
const material = new THREE.MeshStandardMaterial({ metalness: 0.2, roughness: 0.4 });

// === Audio Setup ===
const listener = new THREE.AudioListener();
camera.add(listener);

const collisionSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load("/sound/hit.mp3", (buffer) => {
  collisionSound.setBuffer(buffer);
  collisionSound.setVolume(0.5);
  collisionSound.setLoop(false);
});

// === Function to Create an Object ===
const createObject = (type) => {
  const position = new CANNON.Vec3(
    (Math.random() - 0.5) * 5,
    Math.random() * 3 + 1,
    (Math.random() - 0.5) * 5
  );

  let mesh, body, shape;
  let size = Math.random() * 0.6 + 0.3;

  switch (type) {
    case "sphere":
      mesh = new THREE.Mesh(new THREE.SphereGeometry(size / 2, 32, 32), material);
      shape = new CANNON.Sphere(size / 2);
      break;
    case "cube":
      mesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), material);
      shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2));
      break;
    case "cone":
      mesh = new THREE.Mesh(new THREE.ConeGeometry(size / 2, size, 32), material);
      shape = new CANNON.Cylinder(size / 2, 0, size, 32);
      break;
    case "cylinder":
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(size / 2, size / 2, size, 32), material);
      shape = new CANNON.Cylinder(size / 2, size / 2, size, 32);
      break;
    case "torusKnot":
      mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(size, size / 4, 128, 64), material);
      shape = new CANNON.Sphere(size / 2); // Approximate shape
      break;
    default:
      return;
  }

  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  body = new CANNON.Body({
    mass: 1,
    shape: shape,
    position: position,
    material: defaultMaterial,
  });

  // === Collision Event for Sound ===
  body.addEventListener("collide", (event) => {
    const impactStrength = event.contact.getImpactVelocityAlongNormal();
    if (impactStrength > 1.5) {
      collisionSound.play();
    }
  });

  world.addBody(body);
  objects.push({ mesh, body });
};

// === Function to Clear Objects ===
const clearObjects = () => {
  objects.forEach(({ mesh, body }) => {
    world.removeBody(body);
    scene.remove(mesh);
  });
  objects.length = 0; // Reset array
};

// === GUI Setup ===
const gui = new GUI();
const shapeTypes = ["sphere", "cube", "cone", "cylinder", "torusKnot"];

shapeTypes.forEach((shape) =>
  gui.add({ [`add${shape}`]: () => createObject(shape) }, `add${shape}`).name(`Add ${shape.charAt(0).toUpperCase() + shape.slice(1)}`)
);
gui.add({ clearObjects }, "clearObjects").name("Clear Objects");

// === Animation Loop ===
const clock = new THREE.Clock();

const animate = () => {
  world.step(1 / 60, clock.getDelta(), 3); // Reduced iterations for performance

  objects.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
  });

  controls.update();
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

// === Resize Handling ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("dblclick", () => {
  if (renderer.domElement.requestFullscreen) {
    renderer.domElement.requestFullscreen();
  } else if (renderer.domElement.webkitRequestFullscreen) {
    renderer.domElement.webkitRequestFullscreen();
  }
});