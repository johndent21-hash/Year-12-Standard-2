// Chapter review (multiple choice, short answer, extended response). Placeholder until written.
import { shortBanner } from '../parts.mjs';
import { REVIEW_PAGES } from '../meta.mjs';

export const pages = Array.from({ length: REVIEW_PAGES }, (_, k) => ({ html: `${k === 0 ? shortBanner('Chapter review', 'review') : ''}<p style="color:#999">Chapter review page ${k + 1}: to be written.</p>` }));
export const answers = `<h4>Chapter review</h4><p>To be written.</p>`;
export const css = '';
