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
		client: {"start":"_app/immutable/entry/start.Df4lUj10.js","app":"_app/immutable/entry/app.Cn8M1Afm.js","imports":["_app/immutable/entry/start.Df4lUj10.js","_app/immutable/chunks/entry.DY_tWZkh.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/entry/app.Cn8M1Afm.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/entry.DY_tWZkh.js","_app/immutable/chunks/index.CdEBkEwf.js","_app/immutable/chunks/index.c2pjNB5R.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-9DuP_vS3.js')),
			__memo(() => import('./chunks/1-DHkE_iep.js')),
			__memo(() => import('./chunks/2-y4iLuZR_.js')),
			__memo(() => import('./chunks/4-D2Slx-8Y.js')),
			__memo(() => import('./chunks/5-B_WXyFCn.js'))
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
