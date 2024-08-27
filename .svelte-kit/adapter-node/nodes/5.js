import * as server from '../entries/pages/drivers/_driverId_/routes/_routeId_/_page.server.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/routes/_routeId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/routes/[routeId]/+page.server.js";
export const imports = ["_app/immutable/nodes/5.BkiEPZzW.js","_app/immutable/chunks/index.BYLndrM5.js","_app/immutable/chunks/index.BNHbygFo.js","_app/immutable/chunks/index.DQyKaSv1.js","_app/immutable/chunks/entry.uawVg834.js","_app/immutable/chunks/index-48209844.IIRtDZyg.js","_app/immutable/chunks/IonPage.KvUD72q2.js","_app/immutable/chunks/ion-modal.CsJaVgKZ.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js"];
export const stylesheets = ["_app/immutable/assets/5.7AdlfOUr.css"];
export const fonts = [];
