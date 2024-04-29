import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.C_ExXLj6.js","_app/immutable/chunks/_layout.C6NUUkel.js","_app/immutable/chunks/index.BYLndrM5.js","_app/immutable/chunks/index.BNHbygFo.js","_app/immutable/chunks/ion-modal.CsJaVgKZ.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/index-48209844.IIRtDZyg.js"];
export const stylesheets = ["_app/immutable/assets/_layout.LchM7SNO.css"];
export const fonts = [];
