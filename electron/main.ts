import { app, BrowserWindow } from "electron";
const path = require("path");

let mainWindow: BrowserWindow | null;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1400,
		height: 900,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		resizable: false,
	});

	// Uncomment this if you want to maximize the window on startup
	// mainWindow.maximize();

	mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});
