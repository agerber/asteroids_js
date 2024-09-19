const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const configPath = path.join(__dirname, "../config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const mode = config.mode;
if (mode === "electron") {
	console.log("Starting game in Electron (desktop) mode...");
	exec("yarn start:electron", (err, stdout) => {
		if (err) {
			console.error(`Error launching Electron: ${err}`);
		}
		console.log(stdout);
	});
} else if (mode === "browser") {
	console.log("Starting game in browser mode...");
	exec("yarn start:browser", (err, stdout) => {
		if (err) {
			console.error(`Error launching browser: ${err}`);
			return;
		}
		console.log(stdout);
	});
} else {
	console.error(`Unknown mode: ${mode}. Please set the mode to 'electron' or 'browser' in config.json.`);
}
