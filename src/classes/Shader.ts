import { Plane, Uniform } from '.';
import { createCanvas, sizeCanvas, createResizeObserver } from '../util/dom';
import { createWebGL2Context, createWebGL2Program } from '../util/webgl';
import { type Artboard } from '../types/artboard';
import { Uniform as UniformType } from '../types/uniforms';
import { clone } from '../util/clone';
import { log } from '../util/log';
import {
  DEFAULT_VERTEX_SHADER,
  DEFAULT_FRAGMENT_SHADER,
  INTERNAL_UNIFORMS,
  SHADER_TYPE_MAP,
  DEFAULT_DEFS,
  DEFUALT_UNIFORMS,
  SHADER_UTILS,
} from './../constants/glsl-defaults';

export type ShaderProps = {
  parent?: HTMLElement;
  dpr?: number;
  onResize?: ({ width, height, dpr }: Artboard) => unknown;
  debug?: boolean;
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: UniformType[];
};

interface ShaderState extends Artboard {
  uniforms?: Record<string, Uniform>;
  volume: number;
  internalUniforms: UniformType[];
  stream: number;
}

export default class Shader {
  public config: ShaderProps;
  private canvas: HTMLCanvasElement;
  private observer: ResizeObserver;
  private ctx: WebGL2RenderingContext;
  public state: ShaderState;
  private plane: Plane;
  private program: WebGLProgram;
  private cleanup: () => void;

  constructor(config?: ShaderProps) {
    this.config = {
      parent: document.body,
      debug: true,
      vertexShader: DEFAULT_VERTEX_SHADER,
      fragmentShader: DEFAULT_FRAGMENT_SHADER,
      uniforms: DEFUALT_UNIFORMS,
      ...(config || {}),
    };

    this.state = {
      width: 0,
      height: 0,
      dpr: config?.dpr || window.devicePixelRatio,
      volume: 1,
      stream: 0,
      internalUniforms: clone(INTERNAL_UNIFORMS),
    };

    const { canvas, observer, ctx } = this.initContext();

    this.canvas = canvas;
    this.observer = observer;
    this.ctx = ctx;

    const { plane, program, uniforms, cleanup } = this.initProgram();

    this.plane = plane;
    this.program = program;
    this.state.uniforms = uniforms;
    this.cleanup = cleanup;
    this.tick();
    this.log('self', this);
  }

  get dpr() {
    return this.config.dpr || window.devicePixelRatio;
  }

  set dpr(value: number) {
    this.config.dpr = value;
    this.size = { width: this.state.width, height: this.state.height };
  }

  set size({ width, height }: { width: number; height: number }) {
    if (!this.canvas) return;

    this.state.width = width;
    this.state.height = height;

    const size = {
      width: this.state.width,
      height: this.state.height,
      dpr: this.dpr,
    };

    sizeCanvas(this.canvas, size);
    this.state.internalUniforms[0][2] = [
      size.width * size.dpr,
      size.height * size.dpr,
    ];
    this.ctx.viewport(0, 0, size.width * size.dpr, size.height * size.dpr);
    this.config?.onResize?.(size);
    this.log('size', size);
  }

  get vertexShader() {
    const shader = `
${this.config.vertexShader}
`;

    this.log('vertex', shader);

    return shader;
  }

  get fragmentShader() {
    const shader = `
${DEFAULT_DEFS}

${this.uniformDeclarations}

${SHADER_UTILS}

${this.config.fragmentShader}
`;

    this.log('fragment', shader);

    return shader;
  }

  set stream(value: number) {
    this.state.stream = value;
  }

  get uniforms() {
    const uniforms = [
      ...this.state.internalUniforms,
      ...(this.config?.uniforms || []),
    ];

    return uniforms;
  }

  set uniform(uniform: UniformType) {
    this.config.uniforms?.forEach(u => {
      if (u[0] === uniform[0]) u[2] = uniform[2];
    });
  }

  get uniformDeclarations() {
    return this.uniforms.reduce((acc, [name, type]) => {
      acc += `uniform ${SHADER_TYPE_MAP[type]} ${name};\n`;
      return acc;
    }, '');
  }

  initContext() {
    const canvas = createCanvas({
      parent: this.config.parent,
      dpr: this.dpr,
    });

    const observer = createResizeObserver(this.config.parent, size => {
      this.size = size;
    });

    const ctx = createWebGL2Context(canvas);

    return { canvas, observer, ctx };
  }

  initProgram() {
    const { plane, program, uniforms, cleanup } = createWebGL2Program({
      ctx: this.ctx,
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height,
      uniforms: this.uniforms,
      fragmentShader: this.fragmentShader,
      vertexShader: this.vertexShader,
    });

    return { plane, program, uniforms, cleanup };
  }

  tick(now: DOMHighResTimeStamp = window.performance.now()) {
    if (!this.ctx) return;

    this.state.internalUniforms[1][2] = now / 1000;
    this.state.internalUniforms[2][2] = this.state.stream || now / 1000;
    this.state.internalUniforms[3][2] = this.state.volume;

    this.uniforms?.forEach(uniform => {
      this.state?.uniforms?.[uniform[0]].set(uniform[2]);
    });

    this.plane.render();
  }

  log(label: string, data: unknown) {
    if (this.config.debug) log('shader', label, data);
  }

  rebuild({
    fragmentShader,
    uniforms,
  }: {
    fragmentShader: string;
    uniforms?: UniformType[];
  }) {
    this.cleanup();

    this.config.fragmentShader = fragmentShader;
    this.config.uniforms = uniforms || [];

    const {
      plane,
      program,
      uniforms: uniformState,
      cleanup,
    } = this.initProgram();

    this.plane = plane;
    this.program = program;
    this.state.uniforms = uniformState;
    this.cleanup = cleanup;
  }

  destroy() {
    this.cleanup();
    this.observer.disconnect();
    this.canvas.remove();
    this.log('destroy', null);
  }
}
