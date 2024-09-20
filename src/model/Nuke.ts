// @ts-nocheck
import { Sprite } from "./Sprite";
import { Falcon } from "./Falcon";
import { Point } from "./prime/Point";
import { Movable, Team } from "./Movable";
import { LinkedList } from "./prime/LinkedList";
import { CommandCenter } from "../controller/CommandCenter";
import { SoundLoader } from "../controller/SoundLoader";

export class Nuke extends Sprite {
	private static readonly EXPIRE: number = 60;
	private nukeState: number = 0;

	constructor(falcon: Falcon) {
		super();
		this.setCenter(falcon.getCenter().clone());
		this.setColor("yellow");
		this.setExpiry(Nuke.EXPIRE);
		this.setRadius(0);
		this.setTeam(Team.FRIEND);
		this.setOrientation(falcon.getOrientation());

		const FIRE_POWER: number = 11;

		const vectorX: number = Math.cos((Math.PI / 180) * this.getOrientation()) * FIRE_POWER;
		const vectorY: number = Math.sin((Math.PI / 180) * this.getOrientation()) * FIRE_POWER;
		this.setDeltaX(falcon.getDeltaX() + vectorX);
		this.setDeltaY(falcon.getDeltaY() + vectorY);
	}

	public override draw(g: CanvasRenderingContext2D): void {
		g.strokeStyle = this.getColor();
		g.beginPath();
		g.arc(this.getCenter().getX(), this.getCenter().getY(), this.getRadius(), 0, Math.PI * 2);
		g.stroke();
	}

	public override  move(): void {
		super.move();
		if (this.getExpiry() % (Nuke.EXPIRE / 6) === 0) {
			this.nukeState++;
		}

		switch (this.nukeState) {
			// Travelling
			case 0:
				this.setRadius(17);
				break;
			// Exploding
			case 1:
			case 2:
			case 3:
				this.setRadius(this.getRadius() + 8);
				break;
			// Imploding
			case 4:
			case 5:
			default:
				this.setRadius(this.getRadius() - 11);
				break;
		}
	}

    /* TODO The following overrides are examples of Observer design pattern (Lifecycle Callbacks). Lifecycle
     Callbacks allow an object to perform specific actions at
    well-defined stages of its lifecycle. Lifecycle Callbacks encapsulate logic that would otherwise be scattered throughout
    other classes, thereby making the code more organized and easier to manage.

    Subject (Game): The Game class acts as the subject that triggers changes in the state of Movable objects in the
    processGameOpsQueue() method.

    Observer (Movable): Each Movable object implements the lifecycle methods (addToGame, removeFromGame). These methods are
    called by the Game's processGameOpsQueue() method to notify the Movable objects about their state changes (e.g.,
    being added to or removed from the game).

      */
	public override addToGame(list: LinkedList<Movable>): void {
		if (CommandCenter.getInstance().getFalcon().getNukeMeter() > 0) {
			list.add(this);
			SoundLoader.playSound("nuke.wav");
			CommandCenter.getInstance().getFalcon().setNukeMeter(0);
		}
	}

	public override removeFromGame(list: LinkedList<Movable>): void {
		if (this.getExpiry() === 0) {
			list.remove(this);
		}
	}
}
