<?php 
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
?><!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="./favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		
		<link rel="modulepreload" href="./_app/immutable/entry/start.d34cdc32.js">
		<link rel="modulepreload" href="./_app/immutable/chunks/scheduler.b5b41669.js">
		<link rel="modulepreload" href="./_app/immutable/chunks/singletons.07f920c5.js">
		<link rel="modulepreload" href="./_app/immutable/chunks/index.df17e498.js">
		<link rel="modulepreload" href="./_app/immutable/entry/app.c8e0ba16.js">
		<link rel="modulepreload" href="./_app/immutable/chunks/preload-helper.a4192956.js">
		<link rel="modulepreload" href="./_app/immutable/chunks/index.0caecd64.js">
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">
			<script>
				{
					__sveltekit_62xauv = {
						base: new URL(".", location).pathname.slice(0, -1),
						env: {}
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("./_app/immutable/entry/start.d34cdc32.js"),
						import("./_app/immutable/entry/app.c8e0ba16.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			</script>
		</div>
	</body>
</html>
