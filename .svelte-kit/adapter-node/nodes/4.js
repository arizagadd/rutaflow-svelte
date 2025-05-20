import * as server from '../entries/pages/drivers/_driverId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.DGGA-UlP.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/chunks/index.Dw8w8a4z.js","_app/immutable/chunks/index.DyDJp9mX.js","_app/immutable/chunks/entry.BzG4FXzC.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/IonPage.gOH7OQpZ.js"];
export const stylesheets = ["_app/immutable/assets/4.Dy1nLV9J.css"];
export const fonts = [];
