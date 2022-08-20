import { vertexShader, fragmentShader } from "./shaders.js";

const {
  Clock,
  Scene,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  WebGLRenderTarget,
  PerspectiveCamera,
  WebGLRenderer,
} = THREE;

const $ = document.querySelector.bind(document);

export class Application {
  currentPixelRatio = 1;

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
    this.canvas = $(".world");
    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.clock = new Clock();
    this.camera = this.setupCamera();
    this.scene = this.setupScene();

    window.addEventListener("resize", this.onResize, false);
  }

  setupCamera() {
    const { width, height } = this.dimensions;
    const fieldOfView = 60;
    const aspect = width / height;
    const camera = new PerspectiveCamera(fieldOfView, aspect, 1, 100);
    return camera;
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
    this.camera.updateProjectionMatrix();
  };

  run = () => {
    const { renderer, pixelRatio, scene, camera, clock } = this;
    if (!this.currentPixelRatio !== pixelRatio) {
      this.currentPixelRatio = pixelRatio;
      renderer.setPixelRatio(pixelRatio);
    }
    for (const mesh of scene.children) {
      if (mesh.type !== "Mesh" || mesh.material.type !== "ShaderMaterial") {
        continue;
      }
      mesh.material.uniforms.time.value = clock.getElapsedTime();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(this.run);
  };
}

const app = new Application();
app.run();
