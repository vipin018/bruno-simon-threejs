import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import * as CANNON from 'cannon-es';
import { RoomEnvironment } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
/**
 * GUI
 */
const gui = new GUI();

const canvas = document.querySelector("#draw");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.render(scene, camera);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
const envTexture = pmremGenerator.fromScene(new RoomEnvironment(renderer)).texture;
scene.environment = envTexture;
scene

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * PHYSICS
 */
// world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// sphere
const sphereShape = new CANNON.Sphere(1);
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 10, 0),
  shape: sphereShape,
});
world.addBody(sphereBody);

// floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2),
  shape: floorShape,
});
world.addBody(floorBody);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshPhysicalMaterial({
  color: "#A7A700",
  metalness: 0.1,
  roughness: 0.3,
});
const sphere = new THREE.Mesh(geometry, material);
sphere.castShadow = true;
scene.add(sphere);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshPhysicalMaterial({
    color: "#025859",
    roughness: 0.9,
  })
);
floor.receiveShadow = true;
scene.add(floor);
floor.rotation.x = -Math.PI / 2;

camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;

renderer.render(scene, camera);

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  renderer.setSize(size.width, size.height);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});


if (window.innerWidth < 768) {
  camera.position.z = 7;
  camera.position.x = 2;
  camera.position.y = 2;
}
const clock = new THREE.Clock();
let oldElapsedTime = 0;
function animate() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();

  // world
  world.step(1/60, deltaTime, 3)
  // console.log(sphereBody.position)
  
  sphere.position.copy(sphereBody.position)
  
}

animate();

