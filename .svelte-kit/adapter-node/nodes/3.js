import * as server from '../entries/pages/_page.server.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/3.x52nDJyL.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/chunks/index.c2pjNB5R.js","_app/immutable/chunks/index-48209844.IIRtDZyg.js","_app/immutable/chunks/IonPage.DJq08nGq.js","_app/immutable/chunks/entry.DY_tWZkh.js","_app/immutable/chunks/authStore.Dl96eK1q.js"];
export const stylesheets = ["_app/immutable/assets/3.CUWd1099.css"];
export const fonts = [];
