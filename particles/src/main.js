import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// canvas
const canvas = document.querySelector('.webgl');


// scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('./textures/3.png')

const particlesGeometry = new THREE.BufferGeometry({})
const count = 50500

const position = new Float32Array(count * 3)
const color = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  position[i] = (Math.random() - 0.5) * 10
  color[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(color, 3))


const particlesMaterial = new THREE.PointsMaterial(
  {

    size: 0.01,
    sizeAttenuation: true,
    transparent: true,
    // alphaMap: particleTexture,
    // depthWrite: false,
    // vertexColors: true,
    // blending: THREE.AdditiveBlending,
    // depthTest: false,
    // alphaTest: 0.2,
  }
)

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);
// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// animation
const clock = new THREE.Clock();

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  for (let i = 0; i < count; i++) {

    const i3 = i * 3
    const x = particlesGeometry.attributes.position.array[i3]
    const y = particlesGeometry.attributes.position.array[i3 + 1]
    const z = particlesGeometry.attributes.position.array[i3 + 2]
    particlesGeometry.attributes.position.array[i3+1] = Math.cos(elapsedTime + x )*0.5
  }
  particlesGeometry.attributes.position.needsUpdate = true
  
}
animate();