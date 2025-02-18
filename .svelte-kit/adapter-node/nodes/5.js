import * as server from '../entries/pages/drivers/_driverId_/routes/_routeId_/_page.server.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/routes/_routeId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/routes/[routeId]/+page.server.js";
export const imports = ["_app/immutable/nodes/5.CWkzcVWX.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/chunks/index.c2pjNB5R.js","_app/immutable/chunks/index.D4srSoNc.js","_app/immutable/chunks/entry.HFVLD9c0.js","_app/immutable/chunks/index-48209844.IIRtDZyg.js","_app/immutable/chunks/IonPage.v1T0_FOl.js","_app/immutable/chunks/ion-modal.CsJaVgKZ.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js"];
export const stylesheets = ["_app/immutable/assets/5.DsL4-INs.css"];
export const fonts = [];
