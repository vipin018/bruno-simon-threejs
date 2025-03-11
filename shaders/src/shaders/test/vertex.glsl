uniform mat4 projectionMatrix; //this is the projection matrix which is used to project the 3D world onto the 2D screen
uniform mat4 viewMatrix; //this is the view matrix which is used to view the 3D world from a specific point
uniform mat4 modelMatrix; //this is the model matrix which is used to position the 3D object in the 3D world

// mat1, mat2, mat3, mat4 are the types of matrices in glsl

attribute vec3 position; //this is the position of the vertex in the 3D world
attribute float aRandom;

varying float vRandom;
void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;

    modelPosition.z += aRandom*0.5;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition; // this is the final position of the vertex in the 3D world

    vRandom = aRandom;
}
