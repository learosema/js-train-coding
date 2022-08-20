const glsl = (x) => x[0].trim();

export const vertexShader = glsl`
varying vec2 vUv;

void main() {
  vUv = uv; 
  gl_Position = vec4(position, 1.);
}
`;

export const fragmentShader = glsl`
varying vec2 vUv;
uniform float time;
void main() {
  gl_FragColor = vec4(
    .5 + .5 * sin(time+vUv.x * 2.),
    .5 + .5 * sin(time+vUv.y * 2.),
    vUv.y,
    1.
  );
}
`;
