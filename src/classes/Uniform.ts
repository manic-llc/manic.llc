import { Uniform as UniformValue } from './../types/uniforms';
import { WEBGL_TYPE_MAP } from '../constants/glsl-defaults';

export default class Uniform {
  private ctx: WebGLRenderingContext;
  private suffix: string;
  private location: any;

  constructor(
    ctx: WebGLRenderingContext,
    program: WebGLProgram,
    uniform: UniformValue
  ) {
    this.ctx = ctx;
    this.suffix = WEBGL_TYPE_MAP[uniform[1]];
    this.location = ctx.getUniformLocation(program, uniform[0]);
    this.set(uniform[2]);
  }

  set(...values: any) {
    const ctx = this.ctx;
    const method = `uniform${this.suffix}` as keyof typeof ctx;
    const args = [this.location].concat(values);
    try {
      ctx?.[method].apply(ctx, args);
    } catch (e) {
      console.log(e);
    }
  }
}
