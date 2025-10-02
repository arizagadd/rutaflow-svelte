import * as server from '../entries/pages/drivers/_driverId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.JRbr72V-.js","_app/immutable/chunks/index.DViGqkF2.js","_app/immutable/chunks/index.BWiWegHk.js","_app/immutable/chunks/index.TepA8DrV.js","_app/immutable/chunks/entry.C7b4g-D9.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/overlays-b874c3c3.CH80911p.js"];
export const stylesheets = ["_app/immutable/assets/4.xYEJXkLy.css"];
export const fonts = [];
