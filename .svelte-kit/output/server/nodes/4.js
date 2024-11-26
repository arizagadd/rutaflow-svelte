import * as server from '../entries/pages/drivers/_driverId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.DDKt-rnQ.js","_app/immutable/chunks/index.BzUyNcuj.js","_app/immutable/chunks/index.D9GPdhpm.js","_app/immutable/chunks/index.DBlL1QLD.js","_app/immutable/chunks/entry.Bk-5knQp.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/IonPage.CyI2xFpm.js"];
export const stylesheets = ["_app/immutable/assets/4.Dy1nLV9J.css"];
export const fonts = [];
