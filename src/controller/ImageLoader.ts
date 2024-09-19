export class ImageLoader {
	private static IMAGE_MAP: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>();
	private static isLoaded: boolean = false;

	public static async init(): Promise<void> {
		await ImageLoader.loadImages();
		ImageLoader.isLoaded = true;
	}

	private static async loadImages(): Promise<void> {
		const context = (require as any).context("../../assets/imgs", true, /\.(png)$/);
		const loadPromises: Promise<void>[] = [];

		context.keys().forEach((key: string) => {
			const imageName = key.replace("./", "");
			const imageUrl = context(key);
			const img = new Image();
			img.src = imageUrl;

			const loadPromise = new Promise<void>((resolve) => {
				img.onload = () => {
					ImageLoader.IMAGE_MAP.set(imageName.toLowerCase(), img);
					resolve();
				};
			});

			loadPromises.push(loadPromise);
		});

		await Promise.all(loadPromises);
	}

	public static getImage(imagePath: string): HTMLImageElement | undefined {
		if (!ImageLoader.isLoaded) {
			throw new Error("Images are not yet loaded.");
		}

		const image = ImageLoader.IMAGE_MAP.get(imagePath.toLowerCase());
		if (!image) {
			throw new Error(`Image not found: ${imagePath}`);
		}
		return image;
	}
}
