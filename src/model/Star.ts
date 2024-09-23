// @ts-nocheck
import { CommandCenter } from "../controller/CommandCenter";
import { Game } from "../controller/Game";
import { Movable, Team } from "./Movable";
import { LinkedList } from "./prime/LinkedList";
import { Point } from "./prime/Point";

export class Star implements Movable {
	private center: Point;
	private color: string;

	constructor() {
		this.center = new Point(
			Math.floor(Math.random() * Game.DIM.getWidth()),
			Math.floor(Math.random() * Game.DIM.getHeight())
		);
        let num = Math.floor(Math.random() * 256);
        this.color = `rgb(${num}, ${num}, ${num})`;

    }

	public override draw(g: CanvasRenderingContext2D): void {
		g.strokeStyle = this.color;
		g.beginPath();
		g.arc(this.getCenter().getX(), this.getCenter().getY(), this.getRadius(), 0, Math.PI * 2);
		g.stroke();
	}

	public override getCenter(): Point {
		return this.center;
	}

	public override getRadius(): number {
		return 1;
	}

	public override getTeam(): Team {
		return Team.DEBRIS;
	}

	public override move(): void {
		if (!CommandCenter.getInstance().isFalconPositionFixed()) return;

		if (this.center.getX() > Game.DIM.getWidth()) {
			this.center.setX(1);
		} else if (this.center.getX() < 0) {
			this.center.setX(Game.DIM.getWidth() - 1);
		} else if (this.center.getY() > Game.DIM.getHeight()) {
			this.center.setY(1);
		} else if (this.center.getY() < 0) {
			this.center.setY(Game.DIM.getHeight() - 1);
		} else {
			this.center.setX(Math.round(this.center.getX() - CommandCenter.getInstance().getFalcon().getDeltaX()));
			this.center.setY(Math.round(this.center.getY() - CommandCenter.getInstance().getFalcon().getDeltaY()));
		}
	}

	public override addToGame(list: LinkedList<Movable>): void {
		list.add(this);
	}

	public override removeFromGame(list: LinkedList<Movable>): void {
		list.remove(this);
	}
}
