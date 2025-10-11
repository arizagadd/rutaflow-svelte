import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.B-pZQq3z.js","_app/immutable/chunks/_layout.BCQcnv1e.js","_app/immutable/chunks/index.BgXu2Isl.js","_app/immutable/chunks/index.Dk8PUFqT.js","_app/immutable/chunks/ion-modal.BYMRzj9z.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js"];
export const stylesheets = ["_app/immutable/assets/_layout.BdThJE1O.css"];
export const fonts = [];
