import fs from "node:fs";
import * as esbuild from "esbuild";

// Imports for bundling Svelte
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

// Imports for bundling CSS
import { sassPlugin } from "esbuild-sass-plugin";
import { copy } from "esbuild-plugin-copy";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";
import purgecss from "@fullhuman/postcss-purgecss";

const isDev = process.argv.includes("--mode=dev");

// Before we build, we must destroy
const esbuildDestroy = {
	"name": "esbuild-destroy",
	setup(build) {
		build.onStart(() => {
			if (fs.existsSync("./build")) {
				fs.rmSync("./build", {
					"recursive": true,
					"force": true
				});
			}

			fs.mkdirSync("./build");
		});
	}
};

// HTML bundler
const esbuildHTML = {
	"name": "esbuild-html",
	setup(build) {
		build.onStart(() => {
			const pages = fs
				.readdirSync("./web/public")
				.filter((file) => file.includes(".html"));

			for (const page of pages) {
				if (!fs.existsSync(`./build/${page}`)) {
					fs.writeFileSync(`./build/${page}`, "");
				}

				fs.copyFileSync(`./web/public/${page}`, `./build/${page}`);
			}
		});
	}
};

const esbuildOptions = {
	"entryPoints": ["./web/src/main.js"],
	"bundle": true,
	"define": {},
	"minify": true,
	"treeShaking": true,
	"outfile": "build/build.js",
	"sourcemap": isDev,
	"platform": "browser",
	"logLevel": "info",
	"plugins": [
		sassPlugin({
			async transform(source) {
				const { css } = await postcss([
					purgecss({
						"content": [
							"./web/public/index.html",
							"./web/src/App.svelte",
							"./web/src/**/*.svelte"
						]
					}),
					autoprefixer,
					postcssPresetEnv({
						"stage": 1
					})
				]).process(source, { "from": undefined });
				return css;
			}
		}),
		esbuildSvelte({
			"preprocess": sveltePreprocess()
		}),
		esbuildDestroy,
		esbuildHTML,
		copy({
			"assets": [
				{
					"from": "./web/public/images/*",
					"to": "./images"
				}
			]
		})
	]
};

if (isDev) {
	const ctx = await esbuild.context(esbuildOptions);
	await ctx.watch();
} else {
	esbuild.build(esbuildOptions);
}
