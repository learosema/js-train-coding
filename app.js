import { vertexShader, fragmentShader } from "./shaders.js";

const {
  Clock,
  Scene,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  WebGLRenderTarget,
  PerspectiveCamera,
  Vector2,
  WebGLRenderer,
} = THREE;

const $ = document.querySelector.bind(document);

export class Application {
  currentPixelRatio = -1;

  get pixelRatio() {
    return Math.min(2, window.devicePixelRatio);
  }

  dimensions = {
    get width() {
      return document.body.clientWidth;
    },
    get height() {
      return document.body.clientHeight;
    },
  };

  constructor() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    document.body.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;
    this.renderer.setPixelRatio(this.pixelRatio);
    this.currentPixelRatio = this.pixelRatio;
    this.renderTarget = this.setupRenderTarget();

    this.clock = new Clock();
    this.camera = this.setupCamera();
    this.scene = this.setupScene();

    this.onResize();
    window.addEventListener("resize", this.onResize, false);
  }

  setupCamera() {
    const { width, height } = this.dimensions;
    const fieldOfView = 60;
    const aspect = width / height;
    const camera = new PerspectiveCamera(fieldOfView, aspect, 1, 100);
    camera.position.z = 5;
    return camera;
  }

  setupRenderTarget() {
    const { width, height } = this.dimensions;
    const { pixelRatio } = this;
    return new WebGLRenderTarget(width * pixelRatio, height * pixelRatio);
  }

  resizeRenderTarget() {
    const { width, height } = this.dimensions;
    const { pixelRatio } = this;
    this.renderTarget.setSize(width * pixelRatio, height * pixelRatio);
    this.setUniforms({
      resolution: new Vector2(width * pixelRatio, height * pixelRatio),
      buffer: this.renderTarget.texture,
    });
  }

  updateCamera() {
    const { camera } = this;
    const { width, height } = this.dimensions;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  setupScene() {
    const scene = new Scene();
    const geometry = new PlaneGeometry(2, 2);
    const material = new ShaderMaterial({
      fragmentShader,
      vertexShader,
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        buffer: { value: this.renderTarget.texture },
        resolution: {
          value: new Vector2(
            this.dimensions.width * this.pixelRatio,
            this.dimensions.height * this.pixelRatio,
          ),
        },
      },
    });
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);
    scene.add(this.camera);
    return scene;
  }

  onResize = () => {
    const { renderer, dimensions } = this;
    renderer.setSize(dimensions.width, dimensions.height);
    this.resizeRenderTarget();
    this.camera.updateProjectionMatrix();
  };

  setUniforms(props) {
    for (const mesh of this.scene.children) {
      if (mesh.type !== "Mesh" || mesh.material.type !== "ShaderMaterial") {
        continue;
      }
      for (const [key, val] of Object.entries(props)) {
        if (!mesh.material.uniforms[key]) {
          continue;
        }
        mesh.material.uniforms[key].value = val;
      }
    }
  }

  run = () => {
    const { renderer, pixelRatio, scene, camera, clock, renderTarget } = this;
    const { width, height } = this.dimensions;
    const uniforms = {
      time: clock.getElapsedTime(),
    };
    if (this.currentPixelRatio !== pixelRatio) {
      this.currentPixelRatio = pixelRatio;
      renderer.setPixelRatio(pixelRatio);
      this.resizeRenderTarget();
    }
    this.setUniforms(uniforms);
    
    // When the below render command is commented out, the screen should be blank.
    // renderer.render(scene, camera);
    
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    
    requestAnimationFrame(this.run);
  };

  dispose() {
    // TODO: clean things up.
    // but for now doesn't matter as we never call it ;)
  }
}

const app = new Application();
app.run();
