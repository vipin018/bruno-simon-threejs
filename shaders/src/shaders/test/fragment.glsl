precision mediump float;
uniform vec3 uColor;
varying float vRandom;
uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;
void main() {
    vec4 textureColor = texture2D(uTexture, vUv) ;
    vec4 color = vec4(uColor, 1.0);
    gl_FragColor = textureColor;
}