import { StaticServer } from "@mousepox/static-server";
import { copy, remove } from "fs-extra";
import { join, resolve } from "path";
import { rollup } from "rollup";
import * as nodeResolve from "rollup-plugin-node-resolve";

const AssetsPath = resolve(__dirname, "../..", "assets");

export async function build(gamePath: string) {
  const buildPath = join(gamePath, ".jack-build");

  // Clean existing build output
  await remove(buildPath);

  // Start by copying the game's assets into the build folder
  const gameAssetsPath = join(gamePath, "assets");
  await copy(gameAssetsPath, buildPath);

  // Bundle JavaScript
  // HACK: rollup-plugin-node-resolve doesn't play nice with TypeScript :(
  const nodeRes = nodeResolve as any;
  const bundle = await rollup({
    input: join(gamePath, "dist", "main.js"),
    plugins: [
      nodeRes(),
    ],
  });

  // Write JavaScript bundle
  await bundle.write({
    file: join(buildPath, "main.js"),
    format: "iife",
  });

  // Copy index.html
  // TODO: Tokenize values, e.g. game title
  await copy(join(AssetsPath, "templates", "index.html"), join(buildPath, "index.html"));

  // Start static server
  const server = new StaticServer(buildPath);
  server.listen(8081);
}

export async function develop() {
  // TODO: build/watch javascript source using rollup
  // TODO: watch static files for
}
