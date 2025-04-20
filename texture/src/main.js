import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
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

const textureLoader = new THREE.TextureLoader(loadingManager)

const checkerboardTexture = textureLoader.load(
  "./textures/checkerboard-8x8.png"
)

const minecraftTexture = textureLoader.load(
  "./textures/minecraft.png"
)
minecraftTexture.colorSpace = THREE.SRGBColorSpace


const color = textureLoader.load(
  "./textures/door/color.jpg")
const alpha = textureLoader.load(
  "./textures/door/alpha.jpg")
const height = textureLoader.load(
  "./textures/door/height.jpg")
const normal = textureLoader.load(
  "./textures/door/normal.jpg")
const roughness = textureLoader.load(
  "./textures/door/roughness.jpg")
const metalness = textureLoader.load(
  "./textures/door/metalness.jpg")
const ambientOcclusion = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg")
color.colorSpace = THREE.SRGBColorSpace


// color.repeat.set(2, 3)
// color.wrapS = THREE.MirroredRepeatWrapping
// color.wrapT = THREE.MirroredRepeatWrapping

// color.offset.set(0.5, 0.5)
// color.rotation = Math.PI * 0.25

// color.minFilter = THREE.NearestFilter
minecraftTexture.magFilter = THREE.NearestFilter
checkerboardTexture.magFilter = THREE.NearestFilter
/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  // map: minecraftTexture,
  // map: checkerboardTexture,
  map: color,
  alphaMap: alpha,
  heightMap: height,
  normalMap: normal,
  roughnessMap: roughness,
  metalnessMap: metalness,
  aoMap: ambientOcclusion,
  side: THREE.DoubleSide
})


const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

if (window.innerWidth <= 768) {
  camera.position.x = 1.5
  camera.position.y = 1.5
  camera.position.z = 1.5
} else {
  camera.position.x = 1
  camera.position.y = 1
  camera.position.z = 1
}

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