#!/usr/bin/env node
import * as minimist from "minimist";
import { build } from "./commands";

// Parse CLI arguments
const args = minimist(process.argv.slice(2));

const cwd = process.cwd();

// Handle commands
switch (args._[0]) {
  case "build":
    build(cwd);
    break;
}
