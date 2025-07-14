import * as server from '../entries/pages/_page.server.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/3.BNhGYbsl.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/chunks/index.c2pjNB5R.js","_app/immutable/chunks/index-48209844.IIRtDZyg.js","_app/immutable/chunks/overlays-33ae3ea0.nC7PV_6b.js","_app/immutable/chunks/entry.cQM2eaz1.js","_app/immutable/chunks/authStore.Dl96eK1q.js"];
export const stylesheets = ["_app/immutable/assets/3.DMpVZ_XN.css"];
export const fonts = [];
