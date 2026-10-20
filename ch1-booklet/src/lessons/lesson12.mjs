// Lesson 12 Fuel consumption (textbook 1J). Placeholder until the lesson is written.
import { banner } from '../parts.mjs';
import { LESSONS } from '../meta.mjs';

const L = LESSONS[11];
const todo = (k) => ({ html: `${k === 1 ? banner({ num: String(L.n), title: L.title, sub: `Key idea • Textbook ${L.sec} • MST-12-S2-05` }) : ''}<p style="color:#999">Lesson ${L.n}, page ${k}: to be written.</p>` });

export const pages = [todo(1), todo(2), todo(3)];
export const answers = `<h4>Lesson ${L.n} &nbsp;${L.title}</h4><p>To be written.</p>`;
export const css = '';
