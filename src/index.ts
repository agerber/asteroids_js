import { Game } from "./controller/Game";
import { ImageLoader } from "./controller/ImageLoader";
import { SoundLoader } from "./controller/SoundLoader";

async function init() {
	await ImageLoader.init();
	await SoundLoader.init();
	const game = new Game();
	game.init();
}

init();
