const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","rutaflow.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.xPvKF6ZB.js","app":"_app/immutable/entry/app.Q0BybSRL.js","imports":["_app/immutable/entry/start.xPvKF6ZB.js","_app/immutable/chunks/entry.BhmDTG-9.js","_app/immutable/chunks/index.CP94t5tW.js","_app/immutable/entry/app.Q0BybSRL.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.BhmDTG-9.js","_app/immutable/chunks/index.CP94t5tW.js","_app/immutable/chunks/index.BB8175xn.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-8_HQgsRq.js')),
			__memo(() => import('./chunks/1-DrqFJGbd.js')),
			__memo(() => import('./chunks/2-ixGCqL3D.js')),
			__memo(() => import('./chunks/4-B4samNoe.js')),
			__memo(() => import('./chunks/5-BCcZGgNZ.js'))
		],
		routes: [
			{
				id: "/drivers/[driverId]",
				pattern: /^\/drivers\/([^/]+?)\/?$/,
				params: [{"name":"driverId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/drivers/[driverId]/routes/[routeId]",
				pattern: /^\/drivers\/([^/]+?)\/routes\/([^/]+?)\/?$/,
				params: [{"name":"driverId","optional":false,"rest":false,"chained":false},{"name":"routeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set(["/"]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
