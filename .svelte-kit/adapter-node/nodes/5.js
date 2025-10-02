import * as server from '../entries/pages/drivers/_driverId_/routes/_routeId_/_page.server.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/routes/_routeId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/routes/[routeId]/+page.server.js";
export const imports = ["_app/immutable/nodes/5.DIxyloKE.js","_app/immutable/chunks/index.DViGqkF2.js","_app/immutable/chunks/index.BWiWegHk.js","_app/immutable/chunks/index.TepA8DrV.js","_app/immutable/chunks/entry.C7b4g-D9.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/overlays-b874c3c3.CH80911p.js","_app/immutable/chunks/ion-modal.BYMRzj9z.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js"];
export const stylesheets = ["_app/immutable/assets/5.BdgGoR2C.css"];
export const fonts = [];
