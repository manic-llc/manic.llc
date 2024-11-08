import { EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { clike } from '@codemirror/legacy-modes/mode/clike';
import { html } from '@codemirror/lang-html';
import { BLOCKS, MATH, KEYWORDS, TYPES } from './../constants/glsl-lang';
import {
  RAW_UTIL_KEYS,
  INTERNAL_UNIFORMS,
  DEFUALT_UNIFORMS,
} from './../constants/glsl-defaults';
import {
  defaultKeymap,
  indentWithTab,
  history,
  historyKeymap,
} from '@codemirror/commands';
import {
  StreamLanguage,
  bracketMatching,
  indentOnInput,
} from '@codemirror/language';
import {
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  dropCursor,
  tooltips,
} from '@codemirror/view';
import * as themes from 'thememirror';
import { SHADER_TYPE_MAP } from './../constants/glsl-defaults';

function toKeyObject(arr: any): any {
  return arr.reduce(
    (acc: any, key: any) => ({ ...acc, [key]: true }),
    {} as any
  );
}

export default class Editor {
  constructor(config = {}) {
    const { parent, doc, uniforms, onUpdate, showInputs, language } = {
      parent: document.body,
      doc: '',
      uniforms: [],
      onUpdate: (e: any) => e,
      showInputs: false,
      language: 'HTML',
      ...config,
    };

    this.language = language;
    this.showInputs = showInputs;
    this.onUpdate = onUpdate.bind(this);
    this.parent = parent || document.body;
    this.doc = doc || '';
    this.uniforms = uniforms;
    this.state = this.createState();
    this.view = new EditorView({
      parent: this.parent,
      state: this.state,
    });

    if (this.showInputs) this.buildInputs();
  }

  get inputs() {
    const uniforms = [
      ...INTERNAL_UNIFORMS,
      ...DEFUALT_UNIFORMS,
      ...this.uniforms,
    ].reduce((acc, uniform) => {
      return (acc += `${SHADER_TYPE_MAP[uniform[1]]} <strong>${
        uniform[0]
      }</strong>;<br/>`);
    }, `<strong>Uniforms</strong><br/><br/>\n`);

    const utils = RAW_UTIL_KEYS.reduce((acc, key) => {
      return (acc += `<strong>${key}()</strong>;<br/>`);
    }, `<strong>Utils</strong><br/><br/>\n`);

    return `${uniforms}<br/>${utils}`;
  }

  buildInputs() {
    const className = 'shader-inputs';
    document.querySelector(`.${className}`)?.remove();
    const div = document.createElement('div') as HTMLElement;
    div.classList.add(className);
    div.innerHTML = this.inputs;
    const container = document.querySelector('.cm-editor') as HTMLElement;
    container.insertBefore(div, container.firstChild);
  }

  getLanguage(): any {
    switch (this.language) {
      case 'GLSL':
        return StreamLanguage.define(
          clike({
            name: 'GLSL',
            blockKeywords: toKeyObject(BLOCKS),
            keywords: toKeyObject(KEYWORDS),
            builtin: toKeyObject(MATH),
            types: toKeyObject(TYPES),
            atoms: toKeyObject([
              ...RAW_UTIL_KEYS,
              ...[
                ...INTERNAL_UNIFORMS,
                ...DEFUALT_UNIFORMS,
                ...this.uniforms,
              ].map(u => u[0]),
            ]),
          })
        );
        return;
      case 'HTML':
        return html();
    }
  }

  createState() {
    const extensions = [
      lineNumbers(),
      history(),
      bracketMatching(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      closeBrackets(),
      dropCursor(),
      indentOnInput(),
      autocompletion(),
      themes.dracula,
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      tooltips({
        position: 'absolute',
        parent: this.parent,
      }),
      EditorView.updateListener.of(this.update.bind(this)),
      this.getLanguage(),
    ];

    return EditorState.create({
      doc: this.doc.trim(),
      extensions,
    });
  }

  update(e) {
    if (typeof this.onUpdate !== 'function') return;
    const { state, docChanged } = e;
    if (!docChanged) return;
    this.onUpdate(state.doc.toString());
  }
}
