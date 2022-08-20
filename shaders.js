const glsl = (x) => x[0].trim();

export const vertexShader = glsl`
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position; 
  gl_Position = vec4(position, 1.);
}
`;

export const fragmentShader = glsl`
varying vec2 vUv;
varying vec3 vPosition;
#define PI 3.141592654

uniform float time;
uniform sampler2D buffer;
uniform vec2 resolution;

float sdCircle(vec2 p, in float r) {
  return length(p) - r;
}

void main() {
  float aspect = resolution.x / resolution.y;
  vec2 p0 = vPosition.xy;
  p0.x *= aspect;

  vec3 color = vec3(
    .7 + .3 * sin(time+vUv.x * 5. + cos(vUv.x + time)),
    .8 + .2 * sin(time+vUv.y * 5. + cos(vUv.y + time)),
    vUv.y
  );

  vec2 p = p0 + vec2(cos(time), sin(time)) * .1;
  float a = atan(p.y, p.x);
  float d = sdCircle(p, .5 + .2*sin(time * 3. + a * 5.));
  d=max(-d, sdCircle(p, .5 + .1*sin(time * 3. + a * 5.));
  color = color * smoothstep(0., 0.02, d);

  vec3 texColor = texture2D(buffer, vUv).rgb;

  gl_FragColor = vec4(color + texColor, 1.);
}
`;
