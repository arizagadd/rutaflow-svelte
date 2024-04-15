import { g as getContext } from './ssr-CNVVjtts.js';
import { g as goto } from './client-CQ5E_ugM.js';
import './exports-DuWZopOC.js';

async function handle404() {
  const { error } = getContext("params");
  if (error && error.status === 404) {
    await goto();
  }
}

export { handle404 };
//# sourceMappingURL=hooks-Cn7ce-o8.js.map
