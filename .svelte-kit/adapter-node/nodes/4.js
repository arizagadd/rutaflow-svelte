import * as server from '../entries/pages/drivers/_driverId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.DjgmgmV9.js","_app/immutable/chunks/index.BYLndrM5.js","_app/immutable/chunks/index.BNHbygFo.js","_app/immutable/chunks/index.DQyKaSv1.js","_app/immutable/chunks/entry.uawVg834.js","_app/immutable/chunks/index-48209844.IIRtDZyg.js","_app/immutable/chunks/IonPage.KvUD72q2.js","_app/immutable/chunks/authStore.Dl96eK1q.js"];
export const stylesheets = ["_app/immutable/assets/4.Dy1nLV9J.css"];
export const fonts = [];
