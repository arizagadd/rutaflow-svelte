import * as server from '../entries/pages/_page.server.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/3.BVK-CNPI.js","_app/immutable/chunks/index.BYLndrM5.js","_app/immutable/chunks/index.BNHbygFo.js","_app/immutable/chunks/index-48209844.IIRtDZyg.js","_app/immutable/chunks/IonPage.Bo-7I_IB.js","_app/immutable/chunks/entry.Grh21zXn.js","_app/immutable/chunks/authStore.Dl96eK1q.js"];
export const stylesheets = ["_app/immutable/assets/3.CUWd1099.css"];
export const fonts = [];
