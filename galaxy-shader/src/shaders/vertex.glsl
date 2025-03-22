uniform float uSize;
uniform float uTime;
attribute float aScale;

varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Wave effect using sine function
    float wave = sin(uTime * 2.0 + length(modelPosition.xz) * 3.0) * 0.1;
    modelPosition.x += wave * normalize(modelPosition.x);
    modelPosition.z += wave * normalize(modelPosition.z);
    modelPosition.y += sin(uTime + modelPosition.y * 2.0) * 0.1;

    // Orbiting effect
    float angle = atan(modelPosition.x, modelPosition.z);
    float distance = length(modelPosition.xz);
    float angleOffset = (1.0 / distance) * uTime * 0.9;
    angle += angleOffset;

    modelPosition.x = cos(angle) * distance;
    modelPosition.z = sin(angle) * distance;

    // Final transformations
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    // Point size with perspective correction
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = color;
}
