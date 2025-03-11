varying vec2 vUv;

void main() {

    float strength = mod(vUv.x*10.0, 1.0 );
strength *= step (0.7, mod(vUv.y*10.0, 1.0 ));
if(strength < 0.5) {
    strength = 0.0 ;
}else{
    strength = 1.0;
}

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}