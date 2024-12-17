import * as server from '../entries/pages/_page.server.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/3.D1HqCW-4.js","_app/immutable/chunks/index.BzUyNcuj.js","_app/immutable/chunks/index.D9GPdhpm.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/IonPage.BWAz1V0F.js","_app/immutable/chunks/entry.nnZsqDy6.js","_app/immutable/chunks/authStore.BrPPkCsK.js"];
export const stylesheets = ["_app/immutable/assets/3.CUWd1099.css"];
export const fonts = [];
