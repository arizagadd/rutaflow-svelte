import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.DAuPmZLV.js","_app/immutable/chunks/_layout.BY1M_gQF.js","_app/immutable/chunks/index.CP94t5tW.js","_app/immutable/chunks/index.BB8175xn.js","_app/immutable/chunks/ion-modal.CsJaVgKZ.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/index-48209844.IIRtDZyg.js"];
export const stylesheets = ["_app/immutable/assets/_layout.LchM7SNO.css"];
export const fonts = [];
