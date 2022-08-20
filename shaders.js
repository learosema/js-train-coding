const glsl = x => x[0].trim();

export const vertexShader = glsl`
varying vec2 vUv;

void main() {
  vUv = uv; 
  gl_Position = position;
}
`;

export const fragmentShader = glsl`
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(1., 0., 0., 1.);
}
`;
