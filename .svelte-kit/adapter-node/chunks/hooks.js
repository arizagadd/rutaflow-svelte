import { g as getContext } from "./ssr.js";
import { g as goto } from "./client.js";
async function handle404() {
  const { error } = getContext("params");
  if (error && error.status === 404) {
    await goto();
  }
}
const DATABASE_URL = "https://app.rutaflow.com/";
export {
  DATABASE_URL,
  handle404
};
