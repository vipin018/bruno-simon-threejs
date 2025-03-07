import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

// Select the canvas
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000814); // Deep space background

// Post-processing for glow effects
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Galaxy parameters
const parameters = {
  count: 150000,             // More stars
  size: 0.008,               // Slightly larger stars
  radius: 6,                 // Larger galaxy
  branches: 5,               // 5 spiral arms
  spin: 1.2,                 // More pronounced spiral
  randomness: 0.25,          // Less random for cleaner arms
  randomnessScale: 0.8,      // Scale randomness with distance
  coreDensity: 2.5,          // Denser core
  fadeEffect: 3.2,           // Stronger color fade
  speed: 0.0008,             // Slower, more majestic rotation
  coreColor: [1.0, 0.7, 1.0], // Bright purple core
  midColor: [0.3, 0.5, 1.0],  // Blue mid-section
  edgeColor: [0.1, 0.4, 0.8], // Dark blue edges
  bloomStrength: 0.8,         // Bloom intensity
  bloomRadius: 0.5,           // Bloom size
  bloomThreshold: 0.1,        // Bloom threshold
  zRotation: 0.1,            // Slight tilt to the galaxy
  cameraAutoRotate: true,    // Camera slowly orbits
  cameraRotateSpeed: 0.2,    // Camera rotation speed
};

// Galaxy setup
let geometry = null;
let material = null;
let points = null;
let composer = null;

// Generate Spiral Galaxy
const generateGalaxy = () => {
  // Remove old galaxy
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  // Create buffer geometry
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const sizes = new Float32Array(parameters.count);

  // Loop through particles
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    // Distance from center (denser core)
    const distance = Math.pow(Math.random(), parameters.coreDensity) * parameters.radius;
    
    // Particles are more random in the core, less random at edges
    const randomScale = Math.max(0.1, parameters.randomnessScale * 
                       (1 - Math.pow(distance / parameters.radius, 0.5)));
    
    // Spiral angle based on branches
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
    const spinAngle = distance * parameters.spin;

    // Random spread that scales with distance
    const randomX = (Math.random() - 0.5) * parameters.randomness * randomScale * distance;
    const randomY = (Math.random() - 0.5) * parameters.randomness * randomScale * distance * 0.3;
    const randomZ = (Math.random() - 0.5) * parameters.randomness * randomScale * distance;

    // Convert to Cartesian (spiral formula)
    let x = Math.cos(branchAngle + spinAngle) * distance + randomX;
    let y = randomY;
    let z = Math.sin(branchAngle + spinAngle) * distance + randomZ;
    
    // Apply slight z-axis rotation to tilt the galaxy
    const tiltX = x * Math.cos(parameters.zRotation) - y * Math.sin(parameters.zRotation);
    const tiltY = x * Math.sin(parameters.zRotation) + y * Math.cos(parameters.zRotation);
    
    positions[i3] = tiltX;
    positions[i3 + 1] = tiltY;
    positions[i3 + 2] = z;

    // Color gradient with 3 colors (core, mid, edge)
    const colorRatio = Math.min(1, distance / parameters.radius);
    
    // First transition: core to mid
    let r, g, b;
    if (colorRatio < 0.5) {
      const t = colorRatio * 2; // normalize to 0-1 for first half
      r = parameters.coreColor[0] * (1 - t) + parameters.midColor[0] * t;
      g = parameters.coreColor[1] * (1 - t) + parameters.midColor[1] * t;
      b = parameters.coreColor[2] * (1 - t) + parameters.midColor[2] * t;
    } 
    // Second transition: mid to edge
    else {
      const t = (colorRatio - 0.5) * 2; // normalize to 0-1 for second half
      r = parameters.midColor[0] * (1 - t) + parameters.edgeColor[0] * t;
      g = parameters.midColor[1] * (1 - t) + parameters.edgeColor[1] * t;
      b = parameters.midColor[2] * (1 - t) + parameters.edgeColor[2] * t;
    }
    
    // Apply fade effect
    const fadeFactor = Math.exp(-distance / parameters.fadeEffect);
    colors[i3] = r * fadeFactor;
    colors[i3 + 1] = g * fadeFactor;
    colors[i3 + 2] = b * fadeFactor;
    
    // Random star sizes, smaller at edges for more realism
    sizes[i] = parameters.size * (Math.random() * 0.5 + 0.5) * (1 - 0.5 * (distance / parameters.radius));
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Glowing stars material with custom shader
  material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      size: { value: parameters.size }
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        // Softer glow effect
        float intensity = 1.0 - dist * 2.0;
        intensity = pow(intensity, 1.5);
        gl_FragColor = vec4(vColor, intensity);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    vertexColors: true
  });

  // Create points & add to scene
  points = new THREE.Points(geometry, material);
  scene.add(points);
  
  // Create dust particles in background
  createDustParticles();
};

// Add ambient dust particles
let dustParticles = null;
const createDustParticles = () => {
  if (dustParticles) scene.remove(dustParticles);
  
  const dustGeometry = new THREE.BufferGeometry();
  const dustCount = parameters.count / 5;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustColors = new Float32Array(dustCount * 3);
  const dustSizes = new Float32Array(dustCount);
  
  // Create dust field (much larger than the galaxy)
  const dustRadius = parameters.radius * 3;
  for (let i = 0; i < dustCount; i++) {
    const i3 = i * 3;
    
    // Random position in sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = Math.pow(Math.random(), 0.5) * dustRadius;
    
    dustPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    dustPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    dustPositions[i3 + 2] = radius * Math.cos(phi);
    
    // Very subtle colors for dust
    const brightness = 0.1 + Math.random() * 0.1;
    dustColors[i3] = brightness * 0.8;
    dustColors[i3 + 1] = brightness * 0.8;
    dustColors[i3 + 2] = brightness;
    
    // Tiny dust particles
    dustSizes[i] = parameters.size * 0.3 * Math.random();
  }
  
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
  dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));
  
  const dustMaterial = new THREE.PointsMaterial({
    size: parameters.size * 0.3,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true,
    vertexColors: true,
    opacity: 0.2
  });
  
  dustParticles = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dustParticles);
};

// Initial Galaxy Creation
generateGalaxy();

// Camera
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(3, 4, 8); // Better initial perspective
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ 
  canvas,
  antialias: true, // Smoother rendering
  powerPreference: 'high-performance'
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance

// Set up post-processing
const setupPostProcessing = () => {
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(sizes.width, sizes.height),
    parameters.bloomStrength,
    parameters.bloomRadius,
    parameters.bloomThreshold
  );
  
  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
};
setupPostProcessing();

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = parameters.cameraAutoRotate;
controls.autoRotateSpeed = parameters.cameraRotateSpeed;

// Handle window resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer and composer
  renderer.setSize(sizes.width, sizes.height);
  composer.setSize(sizes.width, sizes.height);
});

// Animation Loop
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  
  // Update Controls
  controls.update();

  // Rotate entire galaxy
  if (points) points.rotation.y += parameters.speed;
  
  // Update time uniform for star twinkling if implemented
  if (material && material.uniforms && material.uniforms.time) {
    material.uniforms.time.value = elapsedTime;
  }

  // Render with post-processing
  composer.render();
  requestAnimationFrame(animate);
};
animate();

// GUI Controls with color pickers and folders
const gui = new GUI();

// Galaxy Structure folder
const structureFolder = gui.addFolder('Galaxy Structure');
structureFolder.add(parameters, "count").min(10000).max(500000).step(5000).name("Star Count").onFinishChange(generateGalaxy);
structureFolder.add(parameters, "size").min(0.001).max(0.03).step(0.001).name("Star Size").onFinishChange(generateGalaxy);
structureFolder.add(parameters, "radius").min(2).max(15).step(0.1).name("Galaxy Radius").onFinishChange(generateGalaxy);
structureFolder.add(parameters, "branches").min(2).max(12).step(1).name("Spiral Arms").onFinishChange(generateGalaxy);
structureFolder.add(parameters, "spin").min(0).max(5).step(0.1).name("Spiral Twist").onFinishChange(generateGalaxy);
structureFolder.add(parameters, "zRotation").min(0).max(Math.PI/2).step(0.01).name("Tilt Amount").onFinishChange(generateGalaxy);

// Randomness folder
const randomFolder = gui.addFolder('Random Effects');
randomFolder.add(parameters, "randomness").min(0).max(2).step(0.05).name("Randomness").onFinishChange(generateGalaxy);
randomFolder.add(parameters, "randomnessScale").min(0.1).max(2).step(0.1).name("Rand Scale").onFinishChange(generateGalaxy);
randomFolder.add(parameters, "coreDensity").min(0.5).max(8).step(0.1).name("Core Density").onFinishChange(generateGalaxy);
randomFolder.add(parameters, "fadeEffect").min(1).max(8).step(0.1).name("Color Fade").onFinishChange(generateGalaxy);

// Color folder
const colorFolder = gui.addFolder('Colors');
// Array controls for colors (could be replaced with proper color picker in a real app)
colorFolder.add(parameters.coreColor, 0, 0, 1).name("Core Red").step(0.05).onFinishChange(generateGalaxy);
colorFolder.add(parameters.coreColor, 1, 0, 1).name("Core Green").step(0.05).onFinishChange(generateGalaxy);
colorFolder.add(parameters.coreColor, 2, 0, 1).name("Core Blue").step(0.05).onFinishChange(generateGalaxy);
colorFolder.add(parameters.midColor, 0, 0, 1).name("Mid Red").step(0.05).onFinishChange(generateGalaxy);
colorFolder.add(parameters.midColor, 1, 0, 1).name("Mid Green").step(0.05).onFinishChange(generateGalaxy);
colorFolder.add(parameters.midColor, 2, 0, 1).name("Mid Blue").step(0.05).onFinishChange(generateGalaxy);
colorFolder.add(parameters.edgeColor, 0, 0, 1).name("Edge Red").step(0.05).onFinishChange(generateGalaxy);
colorFolder.add(parameters.edgeColor, 1, 0, 1).name("Edge Green").step(0.05).onFinishChange(generateGalaxy);
colorFolder.add(parameters.edgeColor, 2, 0, 1).name("Edge Blue").step(0.05).onFinishChange(generateGalaxy);

// Bloom effects folder
const bloomFolder = gui.addFolder('Glow Effects');
bloomFolder.add(parameters, "bloomStrength", 0, 3, 0.05).name("Glow Strength").onChange(value => {
  composer.passes[1].strength = value;
});
bloomFolder.add(parameters, "bloomRadius", 0, 1, 0.01).name("Glow Radius").onChange(value => {
  composer.passes[1].radius = value;
});
bloomFolder.add(parameters, "bloomThreshold", 0, 1, 0.01).name("Glow Threshold").onChange(value => {
  composer.passes[1].threshold = value;
});

// Animation folder
const animationFolder = gui.addFolder('Animation');
animationFolder.add(parameters, "speed").min(0).max(0.01).step(0.0001).name("Galaxy Rotation");
animationFolder.add(parameters, "cameraAutoRotate").name("Camera Orbiting").onChange(value => {
  controls.autoRotate = value;
});
animationFolder.add(parameters, "cameraRotateSpeed", 0.1, 5, 0.1).name("Orbit Speed").onChange(value => {
  controls.autoRotateSpeed = value;
});

// Presets
const presets = {
  blueSpiral: () => {
    parameters.coreColor = [0.8, 0.9, 1.0];
    parameters.midColor = [0.2, 0.5, 0.8];
    parameters.edgeColor = [0.1, 0.2, 0.5];
    parameters.bloomStrength = 0.8;
    parameters.bloomRadius = 0.5;
    parameters.branches = 5;
    parameters.spin = 1.2;
    generateGalaxy();
    updateGUIControllers();
  },
  purpleNebula: () => {
    parameters.coreColor = [1.0, 0.7, 1.0];
    parameters.midColor = [0.5, 0.2, 0.8];
    parameters.edgeColor = [0.2, 0.1, 0.4];
    parameters.bloomStrength = 1.2;
    parameters.bloomRadius = 0.6;
    parameters.branches = 4;
    parameters.spin = 0.8;
    generateGalaxy();
    updateGUIControllers();
  },
  fireGalaxy: () => {
    parameters.coreColor = [1.0, 0.8, 0.2];
    parameters.midColor = [1.0, 0.4, 0.1];
    parameters.edgeColor = [0.6, 0.1, 0.0];
    parameters.bloomStrength = 1.0;
    parameters.bloomRadius = 0.7;
    parameters.branches = 3;
    parameters.spin = 1.5;
    generateGalaxy();
    updateGUIControllers();
  }
};

// Update all GUI controllers from parameters object
const updateGUIControllers = () => {
  for (const folder of Object.values(gui.folders)) {
    for (const controller of Object.values(folder.controllers)) {
      controller.updateDisplay();
    }
  }
  
  // Update bloom passes
  composer.passes[1].strength = parameters.bloomStrength;
  composer.passes[1].radius = parameters.bloomRadius;
  composer.passes[1].threshold = parameters.bloomThreshold;
  
  // Update camera controls
  controls.autoRotate = parameters.cameraAutoRotate;
  controls.autoRotateSpeed = parameters.cameraRotateSpeed;
};

// Add preset folder
const presetFolder = gui.addFolder('Presets');
presetFolder.add(presets, 'blueSpiral').name('Blue Spiral');
presetFolder.add(presets, 'purpleNebula').name('Purple Nebula');
presetFolder.add(presets, 'fireGalaxy').name('Fire Galaxy');  