const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const serverDir = path.join(__dirname, "..", "server");
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(full);
    }
  }
}

walk(serverDir);

let failed = false;
for (const file of files) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (error) {
    failed = true;
    const detail = error.stderr ? error.stderr.toString() : `Syntax error in ${file}`;
    console.error(detail);
  }
}

if (failed) {
  console.error(`Syntax check failed (${files.length} files checked)`);
  process.exit(1);
}

console.log(`Syntax OK (${files.length} files checked)`);