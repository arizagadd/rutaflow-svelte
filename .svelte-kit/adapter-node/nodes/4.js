import * as server from '../entries/pages/drivers/_driverId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/drivers/_driverId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/drivers/[driverId]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.4wExcrIS.js","_app/immutable/chunks/index.BYLndrM5.js","_app/immutable/chunks/index.BNHbygFo.js","_app/immutable/chunks/index.BtCJrmnB.js","_app/immutable/chunks/entry.81mA7piW.js","_app/immutable/chunks/index-48209844.IIRtDZyg.js","_app/immutable/chunks/IonPage.3IFKo8VL.js"];
export const stylesheets = ["_app/immutable/assets/4.Dy1nLV9J.css"];
export const fonts = [];
