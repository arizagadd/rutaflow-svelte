import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0._wMyW-SQ.js","_app/immutable/chunks/_layout.BOvkr5gb.js","_app/immutable/chunks/index.CiEV7_Uu.js","_app/immutable/chunks/index.CzW5ag9q.js","_app/immutable/chunks/ion-modal.BYMRzj9z.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js"];
export const stylesheets = ["_app/immutable/assets/_layout.AnfGev87.css"];
export const fonts = [];
