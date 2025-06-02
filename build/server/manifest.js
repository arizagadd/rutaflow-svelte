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
		client: {"start":"_app/immutable/entry/start.B50ylO-I.js","app":"_app/immutable/entry/app.BpvY0Al0.js","imports":["_app/immutable/entry/start.B50ylO-I.js","_app/immutable/chunks/entry.9C0Ntne4.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/entry/app.BpvY0Al0.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.9C0Ntne4.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/chunks/index.Dw8w8a4z.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-BUtDZsu9.js')),
			__memo(() => import('./chunks/1-CC_IDcfK.js')),
			__memo(() => import('./chunks/2-BtGNzSPP.js')),
			__memo(() => import('./chunks/4-CzQTorOF.js')),
			__memo(() => import('./chunks/5-BBPSb31r.js'))
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
