import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://ya-praktikum.tech/',
});

const globalObject = typeof global !== 'undefined' ? global : window;

const defineGlobalProperty = (key, value) => {
  try {
    Object.defineProperty(globalObject, key, {
      value: value,
      writable: true,
      configurable: true,
      enumerable: true
    });
  } catch (err) {
    console.warn(`[MOCHA SETUP] Cannot define property '${key}':`, err.message);
  }
};

defineGlobalProperty('window', jsdom.window);
defineGlobalProperty('document', jsdom.window.document);
defineGlobalProperty('navigator', jsdom.window.navigator);
defineGlobalProperty('location', jsdom.window.location);
defineGlobalProperty('history', jsdom.window.history);

defineGlobalProperty('XMLHttpRequest', jsdom.window.XMLHttpRequest);

if (!globalObject.XMLHttpRequest) {
  throw new Error('[MOCHA SETUP] Failed to define global XMLHttpRequest');
}
