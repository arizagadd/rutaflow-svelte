export const manifest = (() => {
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
<<<<<<< HEAD
		client: {"start":"_app/immutable/entry/start.Bgg1PeXc.js","app":"_app/immutable/entry/app.BO3jTqT8.js","imports":["_app/immutable/entry/start.Bgg1PeXc.js","_app/immutable/chunks/entry.ajYgCYmH.js","_app/immutable/chunks/index.BgXu2Isl.js","_app/immutable/entry/app.BO3jTqT8.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.ajYgCYmH.js","_app/immutable/chunks/index.BgXu2Isl.js","_app/immutable/chunks/index.Dk8PUFqT.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
=======
		client: {"start":"_app/immutable/entry/start.BdDrF0AW.js","app":"_app/immutable/entry/app.DHIbzD_2.js","imports":["_app/immutable/entry/start.BdDrF0AW.js","_app/immutable/chunks/entry.O-PURUYZ.js","_app/immutable/chunks/index.BgXu2Isl.js","_app/immutable/entry/app.DHIbzD_2.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.O-PURUYZ.js","_app/immutable/chunks/index.BgXu2Isl.js","_app/immutable/chunks/index.Dk8PUFqT.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
>>>>>>> dev
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
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
