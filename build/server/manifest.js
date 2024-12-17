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
		client: {"start":"_app/immutable/entry/start.BtpdTKKe.js","app":"_app/immutable/entry/app.mx3nNNhW.js","imports":["_app/immutable/entry/start.BtpdTKKe.js","_app/immutable/chunks/entry.nnZsqDy6.js","_app/immutable/chunks/index.BzUyNcuj.js","_app/immutable/entry/app.mx3nNNhW.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.nnZsqDy6.js","_app/immutable/chunks/index.BzUyNcuj.js","_app/immutable/chunks/index.D9GPdhpm.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-Xq2exQe9.js')),
			__memo(() => import('./chunks/1-C7OSZqQh.js')),
			__memo(() => import('./chunks/2-Dt-2WqJ4.js')),
			__memo(() => import('./chunks/4-BJ6kgdh7.js')),
			__memo(() => import('./chunks/5-fL9ZL1Po.js'))
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
