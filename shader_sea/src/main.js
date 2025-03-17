import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';
import vertexShader from './shader/vertex.glsl';
import fragmentShader from './shader/fragment.glsl';

const gui = new GUI({
  width: 300,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3);
// camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);


// Cube
const geometry = new THREE.PlaneGeometry(3, 3, 32, 32);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

const loader = new THREE.TextureLoader();
const texture = loader.load('./textures/tex2.jpg');


const material = new THREE.ShaderMaterial({

  vertexShader,
  fragmentShader,
  // wireframe: true,
  side: THREE.DoubleSide,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(6, 3) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("orange", 0.9, 0.5) },
    uTexture: { value: texture },
  },
});

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('uFrequency X');
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('uFrequency Y');

const plane = new THREE.Mesh(geometry, material);
plane.scale.y =2 / 3;
scene.add(plane);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth controls

// Resize handling
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let clock = new THREE.Clock();
// Animation loop
function animate() {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  material.uniforms.uTime.value = elapsedTime;
}
animate();
