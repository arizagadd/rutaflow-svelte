import * as server from '../entries/pages/drivers/_driverId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.D-j2E7b_.js","_app/immutable/chunks/index.BzUyNcuj.js","_app/immutable/chunks/index.D9GPdhpm.js","_app/immutable/chunks/index.Cg4Lo-P2.js","_app/immutable/chunks/entry.nnZsqDy6.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/IonPage.BWAz1V0F.js"];
export const stylesheets = ["_app/immutable/assets/4.Dy1nLV9J.css"];
export const fonts = [];
