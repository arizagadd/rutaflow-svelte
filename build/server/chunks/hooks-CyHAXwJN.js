import { g as getContext } from './ssr-BvR1n3wf.js';
import { g as goto } from './client-DpIAX_q0.js';
import './exports-BGi7-Rnc.js';

async function handle404() {
  const { error } = getContext("params");
  if (error && error.status === 404) {
    await goto();
  }
}
const DATABASE_URL = "https://app.rutaflow.com/";

export { DATABASE_URL, handle404 };
//# sourceMappingURL=hooks-CyHAXwJN.js.map
