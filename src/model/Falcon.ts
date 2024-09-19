// @ts-nocheck
import { CommandCenter } from "../controller/CommandCenter";
import { ImageLoader } from "../controller/ImageLoader";
import { SoundLoader } from "../controller/SoundLoader";
import { Getter } from "../decorators/Getter";
import { Setter } from "../decorators/Setter";
import { Movable, Team } from "./Movable";
import { LinkedList } from "./prime/LinkedList";
import { Sprite } from "./Sprite";

export enum ImageState {
	FALCON_INVISIBLE,
	FALCON,
	FALCON_THR,
	FALCON_SHIELD,
	FALCON_SHIELD_THR,
}
/* TODO The enum TurnState as well as the boolean thrusting are examples of the State design pattern. This pattern
	allows an object to change its behavior when its internal state changes. In this case, the boolean thrusting, and
	 the TurnState (with values IDLE, LEFT, and RIGHT) affects how the Falcon moves and draws itself. */
export enum TurnState {
	IDLE,
	LEFT,
	RIGHT,
}

@Getter()
@Setter()
export class Falcon extends Sprite {
	public static readonly TURN_STEP: number = 11;
	public static readonly INITIAL_SPAWN_TIME: number = 48;
	public static readonly MAX_SHIELD: number = 200;
	public static readonly MAX_NUKE: number = 600;
	public static readonly MIN_RADIUS: number = 28;

	private shield: number = 0;
	private nukeMeter: number = 0;
	private invisible: number = 0;
	private maxSpeedAttained: boolean = false;
	private showLevel: number = 0;
	private thrusting: boolean = false;

	private turnState: TurnState = TurnState.IDLE;

	constructor() {
		super();
		this.setTeam(Team.FRIEND);
		this.setRadius(Falcon.MIN_RADIUS);

		const rasterMap = new Map<ImageState, HTMLImageElement | null | undefined>();
		rasterMap.set(ImageState.FALCON_INVISIBLE, null);
		rasterMap.set(ImageState.FALCON, ImageLoader.getImage("fal/falcon125.png"));
		rasterMap.set(ImageState.FALCON_THR, ImageLoader.getImage("fal/falcon125_thr.png"));
		rasterMap.set(ImageState.FALCON_SHIELD, ImageLoader.getImage("fal/falcon125_SHIELD.png"));
		rasterMap.set(ImageState.FALCON_SHIELD_THR, ImageLoader.getImage("fal/falcon125_SHIELD_thr.png"));
		this.setRasterMap(rasterMap);
	}

	public move(): void {
		if (!CommandCenter.getInstance().isFalconPositionFixed()) {
			super.move();
		}

		if (this.invisible > 0) this.invisible--;
		if (this.shield > 0) this.shield--;
		if (this.nukeMeter > 0) this.nukeMeter--;
		if (this.showLevel > 0) this.showLevel--;

		const THRUST: number = 0.85;
		const MAX_VELOCITY: number = 39;

		if (this.thrusting) {
			// Orientation (deg) to radians: PI/180 * orientation
			const vectorX = Math.cos((Math.PI / 180) * this.getOrientation()) * THRUST;
			const vectorY = Math.sin((Math.PI / 180) * this.getOrientation()) * THRUST;

			const absVelocity = Math.round(
				Math.sqrt(Math.pow(this.getDeltaX() + vectorX, 2) + Math.pow(this.getDeltaY() + vectorY, 2))
			);

			if (absVelocity < MAX_VELOCITY) {
				this.setDeltaX(this.getDeltaX() + vectorX);
				this.setDeltaY(this.getDeltaY() + vectorY);
				this.setRadius(Falcon.MIN_RADIUS + absVelocity / 3);
				this.maxSpeedAttained = false;
			} else {
				this.maxSpeedAttained = true;
			}
		}

		let adjustOr = this.getOrientation();
		switch (this.turnState) {
			case TurnState.LEFT:
				adjustOr =
					this.getOrientation() <= 0 ? 360 - Falcon.TURN_STEP : this.getOrientation() - Falcon.TURN_STEP;
				break;
			case TurnState.RIGHT:
				adjustOr = this.getOrientation() >= 360 ? Falcon.TURN_STEP : this.getOrientation() + Falcon.TURN_STEP;
				break;
			case TurnState.IDLE:
			default:
				break;
		}
		this.setOrientation(adjustOr);
	}

	public draw(g: CanvasRenderingContext2D): void {
		if (this.nukeMeter > 0) {
			this.drawNukeHalo(g);
		}

		let imageState: ImageState;
		if (this.invisible > 0) {
			imageState = ImageState.FALCON_INVISIBLE;
		} else if (this.shield > 0) {
			imageState = this.thrusting ? ImageState.FALCON_SHIELD_THR : ImageState.FALCON_SHIELD;
			this.drawShieldHalo(g);
		} else {
			imageState = this.thrusting ? ImageState.FALCON_THR : ImageState.FALCON;
		}

		this.renderRaster(g, this.getRasterMap().get(imageState));
	}

	private drawShieldHalo(g: CanvasRenderingContext2D): void {
		g.strokeStyle = "cyan";
		g.beginPath();
		g.arc(this.getCenter().getX(), this.getCenter().getY(), this.getRadius(), 0, Math.PI * 2);
		g.stroke();
	}

	private drawNukeHalo(g: CanvasRenderingContext2D): void {
		if (this.invisible > 0) {
			return;
		}

		g.strokeStyle = "yellow";
		g.beginPath();
		g.arc(this.getCenter().getX(), this.getCenter().getY(), this.getRadius() - 10, 0, Math.PI * 2);
		g.stroke();
	}

	public removeFromGame(list: LinkedList<Movable>): void {
		if (this.shield === 0) {
			this.decrementFalconNumAndSpawn();
		}
	}

	public decrementFalconNumAndSpawn(): void {
		CommandCenter.getInstance().setNumFalcons(CommandCenter.getInstance().getNumFalcons() - 1);
		if (CommandCenter.getInstance().isGameOver()) return;

		SoundLoader.playSound("shipspawn.wav");
		this.shield = Falcon.INITIAL_SPAWN_TIME;
		this.invisible = Falcon.INITIAL_SPAWN_TIME / 5;
		this.setOrientation(Math.floor(Math.random() * (360 / Falcon.TURN_STEP)) * Falcon.TURN_STEP);
		this.setDeltaX(0);
		this.setDeltaY(0);
		this.setRadius(Falcon.MIN_RADIUS);
		this.maxSpeedAttained = false;
		this.nukeMeter = 0;
	}
}
