import { Shader, Editor } from './';
import { DEFAULT_FRAGMENT_SHADER } from './../constants/glsl-defaults';

export default class Sandbox {
  constructor(config = {}) {
    const { shader, uniforms, parent, tick } = {
      shader: DEFAULT_FRAGMENT_SHADER,
      uniforms: [],
      parent: document.body,
      variant: 0,
      tick: () => {},
      ...(config || {}),
    };

    this._tick = tick.bind(this);
    this.shader = shader;
    this.uniforms = uniforms;
    this.parent = parent;

    const shaderConfig = {
      fragmentShader: this.shader,
      parent: this.parent,
      dpr: 1,
      uniforms: this.uniforms,
    };

    const editorConfig = {
      doc: this.shader,
      uniforms: this.uniforms,
      onUpdate: this.onUpdate.bind(this),
    };

    this.instances = {
      shader: new Shader(shaderConfig),
      editor: new Editor(editorConfig),
    };

    this.tick = this.tick.bind(this);
    this.raf = requestAnimationFrame(this.tick);
  }

  onUpdate(fragmentShader: string) {
    this.instances.shader.rebuild({ fragmentShader, uniforms: this.uniforms });
  }

  set uniform(val) {
    this.instances.shader.uniform = val;
  }

  tick(now) {
    this._tick?.(now);
    this.instances.shader.tick(now);
    this.raf = requestAnimationFrame(this.tick);
  }

  start() {
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }
}
