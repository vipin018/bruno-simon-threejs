varying vec3 vColor;

void main() {
 

// diffuse pattern
    float diffuse = distance(gl_PointCoord, vec2(0.5));
    diffuse *= 2.0;
    diffuse = 1.0 - diffuse;
    float strength = diffuse * 2.0;

    vec3 color = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(color, 1.0);
}
