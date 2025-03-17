import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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

// colors
debugObject.depthColor = '#186691';
debugObject.surfaceColor = '#9bd8ff';

const geometry = new THREE.PlaneGeometry(3, 3, 128, 128);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  // wireframe: true,
  uniforms: {
    uTime: {
      value: 0.0
    },

    uBigWavesElevation: {
      value: 0.2
    },
    uBigWavesFrequency: {
      value: new THREE.Vector2(4, 1.5)
    },
    uBigWavesSpeed: {
      value: 0.75
    },

    uDepthColor: {
      value: new THREE.Color(debugObject.depthColor)
    },
    uSurfaceColor: {
      value: new THREE.Color(debugObject.surfaceColor)
    }

  }

});

// debug

gui.add(material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
gui.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX');
gui.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY');
gui.add(material.uniforms.uBigWavesSpeed, 'value').min(0).max(3).step(0.001).name('uBigWavesSpeed');

gui.addColor(debugObject, 'depthColor').onChange(() => {
  material.uniforms.uDepthColor.value.set(debugObject.depthColor);
});
gui.addColor(debugObject, 'surfaceColor').onChange(() => {
  material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});

// axesHelper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);



const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
plane.rotation.x = Math.PI / 2;

camera.position.set(1, 1, 2)

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

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;
  requestAnimationFrame(animate);

  resizeRendererToDisplaySize();



  control.update();
  renderer.render(scene, camera);
}

animate();
