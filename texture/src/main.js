import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/Addons.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('#canvas')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)




/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onLoad = () => {
  console.log("loaded")
}
loadingManager.onError = () => {
  console.log("error")
}
const textureLoader = new THREE.TextureLoader(loadingManager);

// Load Textures
const normal = textureLoader.load("./textures/fabric/normal.jpg");
const color = textureLoader.load("./textures/fabric/diffusion.jpg");
const arm = textureLoader.load("./textures/fabric/arm.jpg");

// Repeat the color texture (you can also repeat normal & arm if needed)
color.wrapS = THREE.RepeatWrapping;
color.wrapT = THREE.RepeatWrapping;
// color.repeat.set(1, 10);

// These maps also often need repeat for consistency:
normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
// normal.repeat.set(1, 10);

arm.wrapS = arm.wrapT = THREE.RepeatWrapping;
// arm.repeat.set(1, 10);

// Create geometry
const geometry = new THREE.BoxGeometry(10, 6, 2);

// 🔥 IMPORTANT: For aoMap to work, you MUST set a second set of UVs
geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));

// Create material
const material = new THREE.MeshStandardMaterial({
  map: color,
  normalMap: normal,
  roughnessMap: arm,
  metalnessMap: arm,
  aoMap: arm, // uses uv2!
});

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
mesh.scale.set(3, 2, 1)
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
camera.position.z = 15
camera.position.x = 5
camera.position.y = 2
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const environment = new RoomEnvironment();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileCubemapShader();
const envMap = pmremGenerator.fromScene(environment).texture;
scene.environment = envMap;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()