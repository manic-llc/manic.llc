import { Layer } from '../types/layers';
import Shader, { type ShaderProps } from './Shader';
import { Uniform } from '../types/uniforms';
import { log } from '../util/log';

export default class Renderer {
  private layers: Layer[];
  private shader: Shader;
  public config: ShaderProps;

  constructor(layers: Layer[], config: ShaderProps) {
    this.config = config;
    this.layers = layers;
    this.shader = new Shader({
      ...this.config,
      fragmentShader: this.fragmentShader,
    });

    this.log('self', this);
  }

  get layerDeclarations() {
    const declarations = this.layers.reduce((acc, layer, i) => {
      acc += `vec4 layer_${i} (vec2 uv) {`;
      acc += layer.shader;
      acc += `\n  return vec4(color, 1.);\n`;
      acc += `}\n\n`;
      return acc;
    }, '');

    this.log('layer:declarations', declarations);

    return declarations;
  }

  get fragmentShader() {
    let shader = /*glsl*/ `
${this.layerDeclarations}

void main () {
  vec2 uv = k_uv(gl_FragCoord);
`;

    this.layers.forEach((layer, i) => {
      const mode = layer.mode || '';
      shader += `  gl_FragColor ${i === 0 ? '' : mode}= layer_${i}(uv);\n`;
    });

    shader += '}';

    return shader;
  }

  set uniform(value: Uniform) {
    this.shader.uniform = value;
  }

  log(label: string, data: unknown) {
    if (this.shader?.config?.debug) log('renderer', label, data);
  }

  tick(now: DOMHighResTimeStamp = window.performance.now()) {
    this.shader.tick(now);
  }
}
