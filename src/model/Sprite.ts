// @ts-nocheck
import { CommandCenter } from "../controller/CommandCenter";
import { Game } from "../controller/Game";
import { GameOpAction } from "../controller/GameOp";
import { Utils } from "../controller/Utils";
import { Movable, Team } from "./Movable";
import { LinkedList } from "./prime/LinkedList";
import { Point } from "./prime/Point";
import { PolarPoint } from "./prime/PolarPoint";
import { Getter } from "../decorators/Getter";
import { Setter } from "../decorators/Setter";

@Getter()
@Setter()
export abstract class Sprite implements Movable {
	private center: Point = new Point(0, 0);
	private deltaX: number = 0;
	private deltaY: number = 0;
	private team: Team = Team.FRIEND; // Default value provided to avoid null pointer exceptions, should be overridden
	private radius: number = 0;
	private orientation: number = 0;
	private expiry: number = 0;
	private spin: number = 0;
	private cartesians: Point[] = [];
	private color: string = "white"; // Default value provided to avoid null pointer exceptions, should be overridden
	private rasterMap: Map<any, HTMLImageElement | null | undefined> = new Map<
		any,
		HTMLImageElement | null | undefined
	>();

	constructor() {
		// Places the sprite somewhere random on the screen
		// Math.floor rounds down to the nearest integer
		// Math.random generates a random number between 0 and 1
		this.center = new Point(
			Math.floor(Math.random() * Game.DIM.getWidth()),
			Math.floor(Math.random() * Game.DIM.getHeight())
		);
		this.color = "white";
	}

	// Abstract method would require the subclass to implement its own draw method
	abstract draw(g: CanvasRenderingContext2D): void;

    /* TODO The following methods are an example of the Template_Method design pattern. The Sprite class provides
    the common framework for Movable, such as move(), expire(), somePosNegValue(), renderRaster(), renderVector(), etc.
   while delegating certain details to its subclasses. Also note that Sprite omits draw() and this contract debt
   (inherited from Movable) is passed to Sprite's subclasses which must satisfy the contract by providing implementations for draw(), and this will depend on whether the
   subclass renders as raster or vector.
*/
	public override move(): void {
		// Keeps the sprite inside the bounds of the game
		const scalarX = CommandCenter.getInstance().getUniDim().getWidth();
		const scalarY = CommandCenter.getInstance().getUniDim().getHeight();

		if (this.center.getX() > scalarX * Game.DIM.getWidth()) {
			this.center.setX(1);
		} else if (this.center.getX() < 0) {
			this.center.setX(scalarX * Game.DIM.getWidth() - 1);
		} else if (this.center.getY() > scalarY * Game.DIM.getHeight()) {
			this.center.setY(1);
		} else if (this.center.getY() < 0) {
			this.center.setY(scalarY * Game.DIM.getHeight() - 1);
		} else {
			let newXPos: number = this.center.getX();
			let newYPos: number = this.center.getY();

			if (CommandCenter.getInstance().isFalconPositionFixed()) {
				newXPos -= CommandCenter.getInstance().getFalcon().getDeltaX();
				newYPos -= CommandCenter.getInstance().getFalcon().getDeltaY();
			}
			this.center.setX(Math.floor(newXPos + this.deltaX));
			this.center.setY(Math.floor(newYPos + this.deltaY));
		}

		if (this.expiry > 0) {
			this.expire();
		}

		if (this.spin !== 0) {
			this.orientation += this.spin;
		}
	}

	private expire(): void {
		if (this.expiry === 1) {
			CommandCenter.getInstance().getOpsQueue().enqueue(this, GameOpAction.REMOVE);
		}
		this.expiry--;
	}

	protected somePosNegValue(seed: number): number {
		const randomNumber = Math.floor(Math.random() * seed);
		return randomNumber % 2 === 0 ? randomNumber : -randomNumber;
	}

	protected renderRaster(g: CanvasRenderingContext2D, image: HTMLImageElement | null | undefined): void {
		if (image === null || image === undefined) return;

		const centerX = this.getCenter().getX();
		const centerY = this.getCenter().getY();
		const width = this.getRadius() * 2;
		const height = this.getRadius() * 2;
		const angleRadians = (Math.PI / 180) * this.getOrientation();

		g.save();
		g.translate(centerX, centerY);
		g.scale(width / (image.width as number), height / (image.height as number));
		g.rotate(angleRadians);
		g.drawImage(image, -((image.width as number) / 2), -((image.height as number) / 2));
		g.restore();
	}


	protected renderVector(g: CanvasRenderingContext2D): void {
		const polars = Utils.cartesiansToPolars(this.cartesians);

		const rotatePolarByOrientation = (pp: PolarPoint): PolarPoint =>
			new PolarPoint(pp.getR(), pp.getTheta() + (Math.PI / 180) * this.orientation);

		const polarToCartesian = (pp: PolarPoint): Point =>
			new Point(
				pp.getR() * this.radius * Math.sin(pp.getTheta()),
				pp.getR() * this.radius * Math.cos(pp.getTheta())
			);

		const adjustForLocation = (p: Point): Point =>
			new Point(this.getCenter().getX() + p.getX(), this.getCenter().getY() - p.getY());

        /*TODO The following is an example of the Pipeline design pattern, which is a way of chaining a series of operations
        where the output of one operation becomes the input for the next, forming a "pipeline" of transformations and
        processing steps. This is a key concept in functional programming and data processing.
        */
		const adjustedCarts = polars
            .map(rotatePolarByOrientation)
            .map(polarToCartesian)
            .map(adjustForLocation);

		Utils.drawPolygonFromPoints(g, adjustedCarts, this.color);
	}

	public override addToGame(list: LinkedList<Movable>): void {
		list.add(this);
	}

	public override removeFromGame(list: LinkedList<Movable>): void {
		list.remove(this);
	}
}
