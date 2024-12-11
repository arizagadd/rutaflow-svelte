import * as server from '../entries/pages/_page.server.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/3.Dk6qDFaX.js","_app/immutable/chunks/index.BzUyNcuj.js","_app/immutable/chunks/index.D9GPdhpm.js","_app/immutable/chunks/index-6e05b96e.C_9q9BoX.js","_app/immutable/chunks/IonPage.BBkS3XNq.js","_app/immutable/chunks/entry.BlliC2ps.js","_app/immutable/chunks/authStore.BrPPkCsK.js"];
export const stylesheets = ["_app/immutable/assets/3.CUWd1099.css"];
export const fonts = [];
