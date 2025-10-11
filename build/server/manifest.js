const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["car-accident.svg","favicon.png","hospital.svg","parking.svg","restaurant.svg","rutaflow.png","toilet.svg","traffic.svg"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.B8ctBKQO.js","app":"_app/immutable/entry/app.BS4k4PEJ.js","imports":["_app/immutable/entry/start.B8ctBKQO.js","_app/immutable/chunks/entry.DbeSo8um.js","_app/immutable/chunks/index.BgXu2Isl.js","_app/immutable/entry/app.BS4k4PEJ.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.DbeSo8um.js","_app/immutable/chunks/index.BgXu2Isl.js","_app/immutable/chunks/index.Dk8PUFqT.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-wKP_9mO4.js')),
			__memo(() => import('./chunks/1-CziRVLzM.js')),
			__memo(() => import('./chunks/2-CwhS25Ss.js')),
			__memo(() => import('./chunks/4-DnpippnT.js')),
			__memo(() => import('./chunks/5-C0ZykIgZ.js'))
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
