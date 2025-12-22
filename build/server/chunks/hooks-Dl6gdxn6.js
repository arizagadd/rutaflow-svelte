import { g as getContext } from './ssr-BvR1n3wf.js';
import { g as goto } from './client-DpIAX_q0.js';
import './exports-BGi7-Rnc.js';

async function handle404() {
  const { error } = getContext("params");
  if (error && error.status === 404) {
    await goto();
  }
}
const DATABASE_URL = "https://dev.rutaflow.com/";
const WP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9jbGllbnQiOjcsIm5hbWUiOiJydXRhZmxvd19wcm9kIiwicGFzc3dvcmQiOiIkMmIkMDUkNy8xa21EZXd5UEZqSDQ1R0VlT1ZuLnNSb2dZcWlON0JYMFcuSVlHZWFkUE9FZDJaYUxFRHEiLCJxciI6bnVsbCwicGhvbmUiOiI1MjEzMzI0NDA2MzU0Iiwic2VydmljZSI6InJ1dGFmbG93X3Byb2QiLCJpYXQiOjE3NDgzMjkxMTN9.aBM3PdCFaMAUouerIxchXwEtS6hKGIFOS6KUvwg-DEQ";
const WP_URL = "https://ywp-whatsapp-dev.up.railway.app/api/send/whatsapp";

export { DATABASE_URL, WP_TOKEN, WP_URL, handle404 };
//# sourceMappingURL=hooks-Dl6gdxn6.js.map
