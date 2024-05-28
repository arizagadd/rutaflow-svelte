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
		client: {"start":"_app/immutable/entry/start.BBDYUsqa.js","app":"_app/immutable/entry/app.BD9j6tY3.js","imports":["_app/immutable/entry/start.BBDYUsqa.js","_app/immutable/chunks/entry.BxVh0qv0.js","_app/immutable/chunks/index.BYLndrM5.js","_app/immutable/entry/app.BD9j6tY3.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.BxVh0qv0.js","_app/immutable/chunks/index.BYLndrM5.js","_app/immutable/chunks/index.BNHbygFo.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-Dpfh2qCx.js')),
			__memo(() => import('./chunks/1-GJFgq7PF.js')),
			__memo(() => import('./chunks/2-CZj6xwsE.js')),
			__memo(() => import('./chunks/4-CkbaRB9z.js')),
			__memo(() => import('./chunks/5-CK3Sm1FY.js'))
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
