uniform mat4 projectionMatrix; //this is the projection matrix which is used to project the 3D world onto the 2D screen
uniform mat4 viewMatrix; //this is the view matrix which is used to view the 3D world from a specific point
uniform mat4 modelMatrix; //this is the model matrix which is used to position the 3D object in the 3D world

// mat1, mat2, mat3, mat4 are the types of matrices in glsl

attribute vec3 position; //this is the position of the vertex in the 3D world
uniform vec2 uFrequency;
uniform float uTime;
attribute vec2 uv;
varying vec2 vUv;
varying float vElevation;
void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime * 2.0) * 0.1;
    elevation = sin(modelPosition.y * uFrequency.y - uTime * 2.0) * 0.15;

    modelPosition.z += elevation;
    vElevation = elevation;
    // modelPosition.y += uTime;
    // modelPosition.z += aRandom*0.5;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition; // this is the final position of the vertex in the 3D world

    // vRandom = aRandom;
}
