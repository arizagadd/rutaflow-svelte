const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","car-accident.svg","favicon.png","hospital.svg","parking.svg","restaurant.svg","rutaflow.png","toilet.svg","traffic.svg"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.DDYp-tTE.js","app":"_app/immutable/entry/app.C--mQXiR.js","imports":["_app/immutable/entry/start.DDYp-tTE.js","_app/immutable/chunks/entry.KrXTcCyY.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/entry/app.C--mQXiR.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.KrXTcCyY.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/chunks/index.Dw8w8a4z.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-opQamkuR.js')),
			__memo(() => import('./chunks/1-CxEi6D7M.js')),
			__memo(() => import('./chunks/2-BomWpkf8.js')),
			__memo(() => import('./chunks/4-DWKYPSsw.js')),
			__memo(() => import('./chunks/5-C-AsS0n2.js'))
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
