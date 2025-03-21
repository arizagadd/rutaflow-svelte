import { g as getContext } from './ssr-Ba6f9FPv.js';
import { g as goto } from './client-CQ5E_ugM.js';
import './exports-DuWZopOC.js';

async function handle404() {
  const { error } = getContext("params");
  if (error && error.status === 404) {
    await goto();
  }
}
const DATABASE_URL = "https://dev.rutaflow.com/";

export { DATABASE_URL, handle404 };
//# sourceMappingURL=hooks-BDETGFlU.js.map
