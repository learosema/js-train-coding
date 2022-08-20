import { vertexShader, fragmentShader } from './shaders';

const {
  Clock,
  Scene,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  RenderTarget,
  OrthographicCamera,
  WebGLRenderer,
} = THREE;

const $ = document.querySelector.bind(document);

export class Application {

  get pixelRatio() {
    return Math.min(2, window.devicePixelRatio);
  }

  dimensions = {
    get width() { return document.body.clientWidth; },
    get height() { return document.body.clientHeight; },
  }

  constructor() {
    this.canvas = $('.world');
    this.renderer = new WebGLRenderer({canvas: this.canvas});
    this.clock = new Clock();
    this.camera = this.setupCamera();
    this.scene = this.setupScene();
  }
  
  setupCamera() {
    const { width, height } = this.dimensions;
    const camera = new OrthographicCamera(
      -width / 2, width / 2,
      -height / 2, height / 2,
      1, 
      100,
    );
    return camera;
  }
  
  setupScene() {
    const scene = new Scene();
    const geometry = new PlaneGeometry(1, 1);
    const material = new ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        time: { value: 0 },
      },
    });
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);
    return scene;
  }

  onResize = () => {
  
  }

  loop = () => {
  
  }

}