precision mediump float;

varying float vRandom;

void main() {

    gl_FragColor = vec4(vRandom, vRandom*0.2, 0.5, 1.0);
}
