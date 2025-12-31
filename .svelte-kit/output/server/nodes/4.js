import * as server from '../entries/pages/drivers/_driverId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/+page.server.js";
<<<<<<< HEAD
export const imports = ["_app/immutable/nodes/4.BemDOhau.js","_app/immutable/chunks/index.BgXu2Isl.js","_app/immutable/chunks/index.Dk8PUFqT.js","_app/immutable/chunks/index.BtmbPM9x.js","_app/immutable/chunks/entry.ajYgCYmH.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/overlays-b874c3c3.Cx2RvPDD.js"];
=======
export const imports = ["_app/immutable/nodes/4.B0y1jCii.js","_app/immutable/chunks/index.BgXu2Isl.js","_app/immutable/chunks/index.Dk8PUFqT.js","_app/immutable/chunks/index.DAxZdQiN.js","_app/immutable/chunks/entry.O-PURUYZ.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/overlays-b874c3c3.CjdQ6POc.js"];
>>>>>>> dev
export const stylesheets = ["_app/immutable/assets/4.xYEJXkLy.css"];
export const fonts = [];
