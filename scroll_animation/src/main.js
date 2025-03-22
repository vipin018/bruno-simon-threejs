import * as THREE from 'three'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

// textures

const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('./textures/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter


/**
 * objects
 */

const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

const objectsDistances = 4;

const mesh1 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 120),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.5, 0.4, 100, 16),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 100, 16),
    material
)

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

mesh1.position.y = - objectsDistances * 0
mesh2.position.y = - objectsDistances * 1
mesh3.position.y = - objectsDistances * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

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

// group camera
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,

})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

})

/**
 * CURSOR
 */

const cursor = {}
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX / sizes.width - 0.5
    cursor.y = e.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    for (const mesh of sectionMeshes) {
        mesh.rotation.y = Math.sin(elapsedTime * 0.2)
        mesh.rotation.x = Math.cos(elapsedTime * 0.3)
    }

    camera.position.y = - scrollY / sizes.height * objectsDistances

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5

    cameraGroup.position.x = parallaxX
    cameraGroup.position.y = parallaxY
    
    
}

tick()