import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 2)
scene.add(camera)

const canvas = document.querySelector('#canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)

const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const particlesGeometry = new THREE.BufferGeometry()
const count = 500

const positions = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 3
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))



const particlesMaterial = new THREE.PointsMaterial({
  size: 0.01,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
})

const particlesSystem = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particlesSystem)

renderer.render(scene, camera)

window.addEventListener('resize', () => {
  size.width = window.innerWidth
  size.height = window.innerHeight
  renderer.setSize(size.width, size.height)
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()
})
if (window.innerWidth < 768) {
  camera.position.set(0, 0, 2)
}

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  controls.update()
  

}

animate()
