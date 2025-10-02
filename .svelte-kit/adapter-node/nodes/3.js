import * as server from '../entries/pages/_page.server.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/3.DU_mhN63.js","_app/immutable/chunks/index.DViGqkF2.js","_app/immutable/chunks/index.BWiWegHk.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/overlays-b874c3c3.CH80911p.js","_app/immutable/chunks/entry.C7b4g-D9.js","_app/immutable/chunks/authStore.BrPPkCsK.js"];
export const stylesheets = ["_app/immutable/assets/3.DMpVZ_XN.css"];
export const fonts = [];
