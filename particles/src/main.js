import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 5

// Renderer
const canvas = document.querySelector('#canvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Particle system
const particleCount = 1000
const positions = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({
  color: 0x00BFFF,
  size: 0.05,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)

// Connection lines
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.1 })
let lineGeometry = new THREE.BufferGeometry()
let linePositions = new Float32Array(particleCount * particleCount * 3 * 2) // max lines
let lineCount = 0
const maxDistance = 0.5
const tempVec = new THREE.Vector3()

function updateLines() {
  lineCount = 0
  const pos = geometry.attributes.position.array

  for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
      const ix = i * 3
      const jx = j * 3

      const dx = pos[ix] - pos[jx]
      const dy = pos[ix + 1] - pos[jx + 1]
      const dz = pos[ix + 2] - pos[jx + 2]
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (dist < maxDistance) {
        const li = lineCount * 6
        linePositions[li] = pos[ix]
        linePositions[li + 1] = pos[ix + 1]
        linePositions[li + 2] = pos[ix + 2]
        linePositions[li + 3] = pos[jx]
        linePositions[li + 4] = pos[jx + 1]
        linePositions[li + 5] = pos[jx + 2]
        lineCount++
      }
    }
  }

  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, lineCount * 6), 3))
}

const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial)
scene.add(lineMesh)

// Animate
const clock = new THREE.Clock()

function animate() {
  const elapsed = clock.getElapsedTime()
  const pos = geometry.attributes.position.array

  // Animate particles slightly to simulate neuron pulsing
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    pos[i3 + 1] += Math.sin(elapsed + i) * 0.0005
    pos[i3 + 0] += Math.cos(elapsed + i) * 0.0005
  }

  geometry.attributes.position.needsUpdate = true
  updateLines()

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)

  // camera.position.z = Math.abs(Math.sin(elapsed)) * 1

}

animate()

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
})