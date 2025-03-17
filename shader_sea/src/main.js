import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertexShader from './shader/vertex.glsl?raw';  // ✅ Use ?raw if no plugin
import fragmentShader from './shader/fragment.glsl?raw';
import { GUI } from 'lil-gui';

const gui = new GUI();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const geometry = new THREE.PlaneGeometry(2, 2, 100, 100);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  wireframe: true,
  uniforms: {
    uFrequency: { value: 10.0 },
    uTime: { value: 0.0 },
    uAmplitude: { value: 0.1 },
  },
});

gui.add(material.uniforms.uFrequency, 'value', 0, 100, 0.01);
gui.add(material.uniforms.uAmplitude, 'value', 0, 1, 0.01);

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 5;

const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;

function resizeRendererToDisplaySize() {
  const pixelRatio = window.devicePixelRatio;
  const width = Math.floor(renderer.domElement.clientWidth * pixelRatio);
  const height = Math.floor(renderer.domElement.clientHeight * pixelRatio);

  const needResize = renderer.domElement.width !== width || renderer.domElement.height !== height;

  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  return needResize;
}

function animate() {
  requestAnimationFrame(animate);

  resizeRendererToDisplaySize();

  material.uniforms.uFrequency.value += 0.01;
  material.uniforms.uTime.value += 0.01;

  control.update();
  renderer.render(scene, camera);
}

animate();
