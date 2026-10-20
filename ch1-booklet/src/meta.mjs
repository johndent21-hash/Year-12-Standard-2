// Lesson list and page numbering shared by every module.
// One lesson per key idea, following the textbook sections 1A–1J. Every lesson is exactly 3 pages.
export const LESSONS = [
  { n: 1, title: 'Ratios', sec: '1A' },
  { n: 2, title: 'Capture–recapture', sec: '1B' },
  { n: 3, title: 'Dividing a quantity in a given ratio', sec: '1C' },
  { n: 4, title: 'Scale drawings', sec: '1D' },
  { n: 5, title: 'Plans and elevations', sec: '1E' },
  { n: 6, title: 'Perimeter and area of land', sec: '1F' },
  { n: 7, title: 'Volume of water', sec: '1F' },
  { n: 8, title: 'Rates', sec: '1G' },
  { n: 9, title: 'The unitary method and best buys', sec: '1G' },
  { n: 10, title: 'Speed and distance–time graphs', sec: '1G 1H' },
  { n: 11, title: 'Energy', sec: '1I' },
  { n: 12, title: 'Fuel consumption', sec: '1J' },
];
export const FIRST_LESSON_PAGE = 4;
export const PAGES_PER_LESSON = 3;
LESSONS.forEach((l, i) => (l.start = FIRST_LESSON_PAGE + i * PAGES_PER_LESSON));
export const REVIEW_PAGE = FIRST_LESSON_PAGE + LESSONS.length * PAGES_PER_LESSON;
export const REVIEW_PAGES = 5;
export const ANSWERS_PAGE = REVIEW_PAGE + REVIEW_PAGES;
