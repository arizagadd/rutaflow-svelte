import * as server from '../entries/pages/drivers/_driverId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.DoMEs3Yi.js","_app/immutable/chunks/index.BgXu2Isl.js","_app/immutable/chunks/index.Dk8PUFqT.js","_app/immutable/chunks/index.BFkTM9Om.js","_app/immutable/chunks/entry.BvAh3ZLl.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/overlays-b874c3c3.CgfiodvE.js"];
export const stylesheets = ["_app/immutable/assets/4.xYEJXkLy.css"];
export const fonts = [];
