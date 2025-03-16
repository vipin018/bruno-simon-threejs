import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.glsl'
import testFragmentShader from './shaders/fragment.glsl'

/** 
 * Base
 */
// Debug
const gui = new GUI({
    width: 340
})
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas')

// Scene
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(3, 3, 128, 128)

debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    // wireframe: true,
    uniforms: {
        uTime: { value: 0.0 },
        uBigWavesElevation: { value: 0.02 },
        uBigWavesFrequency: { value: new THREE.Vector2(5, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uDepthColor: { value: debugObject.depthColor },
        uSurfaceColor: { value: debugObject.surfaceColor },
    }
})

// debug-gui
gui.add(material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
gui.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequency_X');
gui.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequency_Y');
gui.add(material.uniforms.uBigWavesSpeed, 'value').min(0).max(5).step(0.001).name('uBigWavesSpeed');
gui.addColor(debugObject, 'depthColor').onChange(() => {
    material.uniforms.uDepthColor.value = new THREE.Color(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').onChange(() => {
    material.uniforms.uSurfaceColor.value = new THREE.Color(debugObject.surfaceColor)
})  

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
mesh.rotation.x = - Math.PI / 2

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
camera.position.set(0, 0.5, 1.8)
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

    // update time
    material.uniforms.uTime.value = elapsedTime
}

tick()