import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import vertexShader from './shader/water/vertex.glsl?raw';  // ✅ Use ?raw if no plugin
import fragmentShader from './shader/water/fragment.glsl?raw';
import { GUI } from 'lil-gui';
const gui = new GUI();
const debugObject = {};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// enviroment hdri
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rogland_clear_night_2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  // scene.background = environmentMap;
  scene.environment = environmentMap;
});

// circle texture
const textureLoader = new THREE.TextureLoader();
const circleTexture = textureLoader.load('./texture/moon.jpg');

const circle = new THREE.SphereGeometry(5,320,320);
const circleMaterial = new THREE.MeshStandardMaterial({ 
  map: circleTexture,
  color: "white",
  
 });
const circleMesh = new THREE.Mesh(circle, circleMaterial);
scene.add(circleMesh);

circleMesh.position.set(-30, 0, -8);
circleMesh.rotation.y = Math.PI / 2;
circleMesh.rotation.x = Math.PI / 2;
circleMesh.scale.set(3, 3, 3);
camera.lookAt(circleMesh.position);



// colors
debugObject.depthColor = '#190061';
debugObject.surfaceColor = '#FF4500';

const waterGeometry = new THREE.PlaneGeometry(5, 5, 1024, 1024);
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  // wireframe: true,
  uniforms: {
    uTime: { value: 0.0 },

    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3.0 },
    uSmallWavesSpeed: { value: 0.22 },
    uSmallWavesIteration: { value: 4.0 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.03 },
    uColorMultiplier: { value: 4.0 },

  }

});

// debug

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(3).step(0.001).name('uBigWavesSpeed');

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation');
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(20).step(0.001).name('uSmallWavesFrequency');
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(3).step(0.001).name('uSmallWavesSpeed');
gui.add(waterMaterial.uniforms.uSmallWavesIteration, 'value').min(0).max(10).step(0.001).name('uSmallWavesIteration');
gui.addColor(debugObject, 'depthColor').onChange(() => {
  waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
});
gui.addColor(debugObject, 'surfaceColor').onChange(() => {
  waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset');
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier');
// axesHelper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);



const plane = new THREE.Mesh(waterGeometry, waterMaterial);
scene.add(plane);
plane.rotation.x = Math.PI / 2;

camera.position.set(1.5, 0.2, 1)

const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = false;
control.enableZoom = false;
control.enablePan = false;
control.enableRotate = false;
control.enablePan = false;
control.enableRotate = false;
control.enablePan = false;
control.enableRotate = false;

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

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  waterMaterial.uniforms.uTime.value = elapsedTime;
  requestAnimationFrame(animate);

  resizeRendererToDisplaySize();



  control.update();
  renderer.render(scene, camera);
}

animate();
