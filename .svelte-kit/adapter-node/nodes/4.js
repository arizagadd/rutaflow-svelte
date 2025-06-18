import * as server from '../entries/pages/drivers/_driverId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.BZr7XwrY.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/chunks/index.c2pjNB5R.js","_app/immutable/chunks/index.C6k7KZXo.js","_app/immutable/chunks/entry.DhsYo6LP.js","_app/immutable/chunks/index-48209844.IIRtDZyg.js","_app/immutable/chunks/IonPage.Cg_25vem.js"];
export const stylesheets = ["_app/immutable/assets/4.xYEJXkLy.css"];
export const fonts = [];
