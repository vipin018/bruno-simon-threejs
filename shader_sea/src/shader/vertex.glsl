
// vertex shader
uniform float uFrequency;
uniform float uTime;
uniform float uAmplitude;


void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * uFrequency + uTime*10.0) * uAmplitude;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
}

