import * as server from '../entries/pages/drivers/_driverId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.CmZuKOPn.js","_app/immutable/chunks/index.CiEV7_Uu.js","_app/immutable/chunks/index.CzW5ag9q.js","_app/immutable/chunks/index.BsQdstSE.js","_app/immutable/chunks/entry.CqLYEtX4.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/IonPage.CQfFMD73.js"];
export const stylesheets = ["_app/immutable/assets/4.Dy1nLV9J.css"];
export const fonts = [];
