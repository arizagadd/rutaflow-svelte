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
const WP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9jbGllbnQiOjYsIm5hbWUiOiJydXRhZmxvdyIsInBhc3N3b3JkIjoiJDJiJDA1JGhhRWQ3SGFieTFxQmlaUTlBMjgvb09aRldlQlA3b0doYzE1MTNwbVREemFpTXk4bG9iaUxLIiwicXIiOm51bGwsInBob25lIjoiNTIxMzE0MjQxNzEwMyIsInNlcnZpY2UiOiJydXRhZmxvdyIsImlhdCI6MTc0ODYzNzUyMn0.5wTB89qrzTOzHauTvmUK2uTtr8s-8_I_-b_EXSmlhPY";
const WP_URL = "https://ywp-whatsapp-dev.up.railway.app/api/send/whatsapp";

export { DATABASE_URL, WP_TOKEN, WP_URL, handle404 };
//# sourceMappingURL=hooks-BCtWIlt2.js.map
