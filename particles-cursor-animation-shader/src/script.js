import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Materials
    particlesMaterial.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 18)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor('#181818')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/* 
    displacement
*/

const displacement = {};

// 2d canvas

displacement.canvas = document.createElement('canvas')
displacement.canvas.width = 256
displacement.canvas.height = 256

// style
displacement.canvas.style.position = 'fixed'
displacement.canvas.style.width = '256px'
displacement.canvas.style.height = '256px'
displacement.canvas.style.top = '0%'
displacement.canvas.style.left = '0%'
displacement.canvas.style.zIndex = '10'

// append to body
document.body.appendChild(displacement.canvas)

// 2d context
displacement.context = displacement.canvas.getContext('2d')
// displacement.context.fillStyle = 'cadetblue'
displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

// image loading
displacement.glowImage = new Image()
displacement.glowImage.src = './glow.png'

// interactive plane

displacement.plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({
        map: displacement.texture,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        color: 'black'
    })
)
scene.add(displacement.plane)

// raycaster
displacement.raycaster = new THREE.Raycaster()
displacement.screenCurosr = new THREE.Vector2(9999, 9999)
displacement.canvasCurosr = new THREE.Vector2(9999, 9999)

// event listener
window.addEventListener('pointermove', (event) => {
    displacement.screenCurosr.x = (event.clientX / sizes.width) * 2 - 1
    displacement.screenCurosr.y = -(event.clientY / sizes.height) * 2 + 1
})

// texture
displacement.texture = new THREE.CanvasTexture(displacement.canvas)

/**
 * Particles
 */
const particlesGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)

const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count)
const anglesArray = new Float32Array(particlesGeometry.attributes.position.count)
for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
    intensitiesArray[i] = Math.random()
    anglesArray[i] = Math.random() * Math.PI *2
}

particlesGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
particlesGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1))


const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms:
    {
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uTexture: new THREE.Uniform(textureLoader.load('./picture-1.png')),
        uDisplacement: new THREE.Uniform(displacement.texture)
    }
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    // raycaster
    displacement.raycaster.setFromCamera(displacement.screenCurosr, camera)
    const intersects = displacement.raycaster.intersectObject(displacement.plane)
    if (intersects.length > 0) {
        const uv = intersects[0].uv

        displacement.canvasCurosr.x = uv.x * displacement.canvas.width
        displacement.canvasCurosr.y = (1 - uv.y) * displacement.canvas.height
    }
    displacement.context.globalCompositeOperation = 'source-over'
    displacement.context.globalAlpha = 0.05
    displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)
    displacement.context.globalCompositeOperation = 'lighter'
    // draw image

    const glowSize = displacement.canvas.width * 0.25
    displacement.context.globalAlpha = 0.5
    displacement.context.drawImage(
        displacement.glowImage,
        displacement.canvasCurosr.x - glowSize / 2,
        displacement.canvasCurosr.y - glowSize / 2,
        glowSize,
        glowSize)
    displacement.texture.needsUpdate = true
        
}

tick()