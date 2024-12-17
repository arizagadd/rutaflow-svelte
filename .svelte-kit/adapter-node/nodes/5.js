import * as server from '../entries/pages/drivers/_driverId_/routes/_routeId_/_page.server.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/routes/_routeId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/routes/[routeId]/+page.server.js";
export const imports = ["_app/immutable/nodes/5.B-_favHp.js","_app/immutable/chunks/index.BzUyNcuj.js","_app/immutable/chunks/index.D9GPdhpm.js","_app/immutable/chunks/index.Cg4Lo-P2.js","_app/immutable/chunks/entry.nnZsqDy6.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/IonPage.BWAz1V0F.js","_app/immutable/chunks/ion-modal.BYMRzj9z.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js"];
export const stylesheets = ["_app/immutable/assets/5.DsL4-INs.css"];
export const fonts = [];
