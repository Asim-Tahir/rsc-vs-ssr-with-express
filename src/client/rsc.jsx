import { createRoot } from 'react-dom/client';
import { createFromFetch } from 'react-server-dom-webpack/client.browser';

import './assets/styles/rsc.css';

// HACK: map webpack resolution to native ESM
/**
 * @param {string} id 
 */
// @ts-expect-error Property '__webpack_require__' does not exist on type 'Window & typeof globalThis'.
window.__webpack_require__ = async (id) => {
  return import(id);
};

const container = document.getElementById('rsc');

// @ts-expect-error `root` might be null
const root = createRoot(container);

/**
 * Fetch your server component stream from `/rsc`
 * and render results into the root element as they come in.
 */
createFromFetch(fetch('/rsc')).then((component) => {
  root.render(component);
})
