import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { Timer } from 'three/addons/misc/Timer.js';
import { GUI } from 'lil-gui';
import gsap from "gsap";

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const fog = new THREE.Fog(0x222222, 0.05, 15);
scene.fog = fog;


const ambientLight = new THREE.AmbientLight("#383838");
ambientLight.intensity = 50; 

const directionalLight = new THREE.DirectionalLight("#6A0DAD", 1.5);
directionalLight.position.set(2, 4, -5);
scene.add(directionalLight);

const spotLight = new THREE.SpotLight("red", 25, 100, 2)
spotLight.position.set(0, 2, 2)
spotLight.target.position.set(0, 0, 0)
scene.add(spotLight)
scene.add(spotLight.target)

const torchLights = [];

for (let i = 0; i < 2; i++) {
    const torch = new THREE.PointLight("#ff5500", 1.5, 4);
    torch.position.set(i === 0 ? -1.5 : 1.5, 1.8, 2.2);
    torchLights.push(torch);
    scene.add(torch);
}

function animateTorches() {
    torchLights.forEach((torch) => {
        torch.intensity = 1.5 + Math.sin(Date.now() * 0.005) * 0.7; 
    });
    requestAnimationFrame(animateTorches);
}
animateTorches();

const lightning = new THREE.PointLight("#ffffff", 0, 10);
scene.add(lightning);
function animateLightning() {
    if (Math.random() > 0.95) { // 2% chance of lightning
        lightning.intensity = 900;
        setTimeout(() => lightning.intensity = 0, 100);
    }
    requestAnimationFrame(animateLightning);
}
animateLightning();

// the above function is for the lightning effect how it works ? so basically it is a function that is called every frame and it checks if the random number is greater than 0.95 if it is it will set the intensity of the lightning to 900 and then it will set the intensity to 0 after 100ms in simple word ye function jab kabhi bhi math.random ki value
const ghostLights = [];

const colors = ["#ff4500", "#8b008b", "#d4af37"]; // Deep Orange, Dark Magenta, Haunted Gold

for (let i = 0; i < 3; i++) {
    const light = new THREE.PointLight(colors[i], 3, 5); // Increased intensity & range for a stronger glow
    light.position.set((Math.random() - 0.5) * 6, 1.2 + Math.random(), (Math.random() - 0.5) * 6);

    // Add a flickering effect
    setInterval(() => {
        light.intensity = 2 + Math.sin(Date.now() * 0.005) * 1.5;
    }, 50);

    ghostLights.push(light);
    scene.add(light);
}

const windowLight = new THREE.PointLight("#ffaa00", 2, 6);
windowLight.position.set(0, 2, -1);
scene.add(windowLight);

const hemisphereLight = new THREE.HemisphereLight("#383838", "#000000", 0.5); 
scene.add(hemisphereLight);

const textureLoader = new THREE.TextureLoader();
const alphaTexture = textureLoader.load("./textures/floor/alpha.jpg");
const floorColorTexture = textureLoader.load("./textures/floor/ground/difussion.jpg");
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
const floorARMTexture = textureLoader.load("./textures/floor/ground/arm.jpg");
const floorNormalTexture = textureLoader.load("./textures/floor/ground/normal.jpg");
const floorDisplacementTexture = textureLoader.load("./textures/floor/ground/displacement.jpg");

floorColorTexture.repeat.set(10,10);
floorARMTexture.repeat.set(10,10);
floorNormalTexture.repeat.set(10,10);
floorDisplacementTexture.repeat.set(10,10);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;


// ground or floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20,100,100),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture, // ✅ Correctly assigns the main texture
    alphaMap: alphaTexture, // ✅ Assigns the alpha texture properly
    transparent: true, // ✅ Enables transparency
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.5,
    displacementBias: -0.2
})
)

const gui = new GUI();
gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name("Floor Displacement Scale");
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name("Floor Displacement Bias");


floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// house
const house = new THREE.Group()
scene.add(house)

const wallColorTexture = textureLoader.load("./textures/wall/diffusion.jpg");
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
const wallARMTexture = textureLoader.load("./textures/wall/arm.jpg");
const wallNormalTexture = textureLoader.load("./textures/wall/normal.jpg");



// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
)
walls.position.y = 1;
house.add(walls);

const roofColorTexture = textureLoader.load("./textures/roof/difussion.jpg");
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
const roofARMTexture = textureLoader.load("./textures/roof/arm.jpg");
const roofNormalTexture = textureLoader.load("./textures/roof/normal.jpg");

roofColorTexture.repeat.set(3,1);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.repeat.set(3,1);
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;
roofARMTexture.repeat.set(3,1);
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapT = THREE.RepeatWrapping;

// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    color:"#3A2615",
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
)
roof.position.y = 3;
roof.rotation.y = Math.PI / 4;
house.add(roof);

const doorColorTexture = textureLoader.load("./textures/door/diff.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorARMTexture = textureLoader.load("./textures/door/arm.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/nor.jpg");

// door
const door = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.5, 0.2),
  new THREE.MeshStandardMaterial({
    color:"brown",
    map: doorColorTexture,
    aoMap: doorARMTexture,
    roughnessMap: doorARMTexture,
    metalnessMap: doorARMTexture,
    normalMap: doorNormalTexture,
  })
)
door.position.y = 0.8;
door.position.z = 2;
house.add(door);

const windowColorTexture = textureLoader.load("./textures/window/diff.jpg");
windowColorTexture.colorSpace = THREE.SRGBColorSpace;
const windowARMTexture = textureLoader.load("./textures/window/arm.jpg");
const windowNormalTexture = textureLoader.load("./textures/window/nor.jpg");



const windoww = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 0.5, 0.2),
  new THREE.MeshStandardMaterial({
    map: windowColorTexture,
    aoMap: windowARMTexture,
    roughnessMap: windowARMTexture,
    metalnessMap: windowARMTexture,
    normalMap: windowNormalTexture,
  })
)
windoww.position.y = 1.8;
windoww.position.z = 2;
windoww.position.x = 1.5;
house.add(windoww);

const bushColorTexture = textureLoader.load("./textures/bushes/diff.jpg");
bushColorTexture.colorSpace = THREE.SRGBColorSpace;
const bushARMTexture = textureLoader.load("./textures/bushes/arm.jpg");
const bushNormalTexture = textureLoader.load("./textures/bushes/nor.jpg");


// bushes
const bushGeometry = new THREE.SphereGeometry(0.5, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  color:"lightgreen",
  map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(1, 0.2, 2.2)
bush1.scale.set(1.2, 1, 1)
bush1.rotation.x = -0.75
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.set(1.7, 0.2, 2.2)
bush2.scale.set(0.5, 0.8, 0.5)
bush2.rotation.x = -0.75
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.position.set(-1.5, 0.2, 2.2)
bush3.scale.set(1, 0.8, 0.8)
bush3.rotation.x = -0.75
house.add(bush1, bush2, bush3);

// tree
const treeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3)
const treeMaterial = new THREE.MeshStandardMaterial({
  color:"#712E13",
  map: roofColorTexture,
  aoMap: roofARMTexture,
  roughnessMap: roofARMTexture,
  metalnessMap: roofARMTexture,
  normalMap: roofNormalTexture,
})
const tree = new THREE.Mesh(treeGeometry, treeMaterial)
tree.position.set(5, 0.2, 2.2)
house.add(tree);

// tree leaf
const treeLeaf = new THREE.Mesh(
  new THREE.CylinderGeometry(0.01, 0.8, 3),
  new THREE.MeshStandardMaterial({
    color: "lime",
    map:bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
  })
)
treeLeaf.position.set(5, 2.5, 2.2)
house.add(treeLeaf);

const graveColorTexture = textureLoader.load("./textures/grave/diff.jpg");
graveColorTexture.colorSpace = THREE.SRGBColorSpace;
const graveARMTexture = textureLoader.load("./textures/grave/arm.jpg");
const graveNormalTexture = textureLoader.load("./textures/grave/nor.jpg");

// graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
})
const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 50; i++) {

  const angle = Math.random() * Math.PI * 2;
  const radius = 4.5 + Math.random() * 5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const rotation = Math.random();
  // mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  graves.add(grave)
  grave.position.set(x, 0.25, z)
  grave.rotation.z = rotation*0.2;
  grave.rotation.x = rotation - 0.5;

}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 4;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

directionalLight.castShadow = true;
spotLight.castShadow = true;
torchLights.forEach(torch => torch.castShadow = true);
lightning.castShadow = true;
ghostLights.forEach(light => light.castShadow = true);
windowLight.castShadow = true;

floor.receiveShadow = true;
walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
roof.receiveShadow = true;
door.castShadow = true;
door.receiveShadow = true;
windoww.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
graves.castShadow = true;

// const timer = new Timer()

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  // const elapsedTime = timer.elapsedTime;
  // mesh.rotation.y = elapsedTime;
}
animate();

function resize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
}
resize();
function spookyCameraAnimation() {
  const tl = gsap.timeline({ repeat: -1, yoyo: true, ease: "power2.inOut" });

  tl.to(camera.position, {
      x: "-=0.5", // Gentle horizontal drift
      y: "-=2", // Slow floating motion
      z: "-=5", // Slight creeping zoom
      duration: 4, // Smooth transitions
  })
  .to(camera.rotation, {
      x: "+=5", // Subtle eerie tilt
      y: "+=3",
      duration: 4,
  }, "<"); // Syncs with position movement

  // Add slight unpredictable shakes (but very smooth)
  gsap.to(camera.position, {
      x: "-=1",
      y: "-=1",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
  });

  gsap.to(camera.rotation, {
      x: "-=2",
      y: "-=2",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
  });
}

// Start animation
// spookyCameraAnimation();