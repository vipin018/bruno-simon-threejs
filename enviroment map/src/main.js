import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Enviroment Map
 */

/*
const envMap = new THREE.CubeTextureLoader().load([
  '/environmentMaps/2/px.png',
  '/environmentMaps/2/nx.png',
  '/environmentMaps/2/py.png',
  '/environmentMaps/2/ny.png',
  '/environmentMaps/2/pz.png',
  '/environmentMaps/2/nz.png',
]);

scene.background = envMap;
scene.environment = envMap;
scene.environmentIntensity = 1;
scene.backgroundIntensity = 1;
scene.backgroundBlurriness = 0;
scene.backgroundRotation.y = 1;
scene.environmentRotation.y = 1;

*/

rgbeLoader.load('/environmentMaps/1/2k.hdr', function (envMap) {
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envMap;
  scene.environment = envMap;
  scene.environmentIntensity = 1;
  scene.backgroundIntensity = 1;
  scene.backgroundBlurriness = 0;
  scene.backgroundRotation.y = 1;
  scene.environmentRotation.y = 1;
  scene.wireframe = true;
});
/**
 * 
 */
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(10, 10, 10);
});

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: '#aaaaaa',
  })
)
torusKnot.position.y = 4
torusKnot.position.x = -3
scene.add(torusKnot)
// torusKnot.material.envMap = envMap;

const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(6, 0.5, 100, 32),
  new THREE.MeshBasicMaterial({
    color: 'white',
  })
)
holyDonut.position.y = 3.5
// holyDonut.position.x = 4
scene.add(holyDonut)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)

  if(holyDonut){
    holyDonut.rotation.x = elapsedTime
  }
}

tick()

gui.add(scene, 'environmentIntensity').min(0).max(1).step(0.001).name('environmentIntensity');
gui.add(scene, 'backgroundIntensity').min(0).max(1).step(0.001).name('backgroundIntensity');
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.0001).name('backgroundBlurriness');
gui.add(scene.environmentRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('environmentRotation');
gui.add(scene.backgroundRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('backgroundRotation');