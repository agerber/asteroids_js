const path = require("path");

module.exports = {
	mode: "development",
	entry: "./electron/main.ts",
	target: "electron-main",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: "ts-loader",
			},
		],
	},
};
