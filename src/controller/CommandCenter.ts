// @ts-nocheck
import { Getter } from "../decorators/Getter";
import { Setter } from "../decorators/Setter";
import { Falcon } from "../model/Falcon";
import { MiniMap } from "../model/MiniMap";
import { Movable } from "../model/Movable";
import { Dimension } from "../model/prime/Dimension";
import { LinkedList } from "../model/prime/LinkedList";
import { Universe } from "../model/prime/Universe";
import { Star } from "../model/Star";
import { GameOpAction } from "./GameOp";
import { GameOpsQueue } from "./GameOpsQueue";

@Getter()
@Setter()
export class CommandCenter {
	private universe: Universe = Universe.FREE_FLY;
	private numFalcons: number = 0;
	private level: number = 0;
	private score: number = 0;
	private paused: boolean = false;
	private themeMusic: boolean = false;
	private radar: boolean = false;
	private frame: number = 0;

	private readonly falcon: Falcon = new Falcon();
	private readonly miniDimHash: Map<Universe, Dimension> = new Map<Universe, Dimension>();
	private readonly miniMap: MiniMap = new MiniMap();
    /*
     TODO The following LinkedList<Movable> are examples of the Composite design pattern which is used to allow
     compositions of objects to be treated uniformly. Here are the elements of the Composite design pattern:

     Component: Movable serves as the component interface. It defines common methods (move(), draw(Graphics g), etc.)
     that all concrete implementing classes must provide.

     Leaf: Concrete classes that implement Movable (e.g., Bullet, Asteroid) are the leaf nodes. They implement the
     Movable interface and provide specific behavior.

     Composite: The LinkedLists below that aggregate Movable objects (e.g., movFriends, movFoes) act as
     composites. They manage collections of Movable objects and provide a way to iterate over and operate on them as a
     group.

     */
	private readonly movDebris: LinkedList<Movable> = new LinkedList<Movable>();
	private readonly movFriends: LinkedList<Movable> = new LinkedList<Movable>();
	private readonly movFoes: LinkedList<Movable> = new LinkedList<Movable>();
	private readonly movFloaters: LinkedList<Movable> = new LinkedList<Movable>();

	private readonly opsQueue: GameOpsQueue = new GameOpsQueue();

	// Singleton instance
	private static instance: CommandCenter;

	// Singleton private constructor
	private constructor() {}

    /* TODO This is an example of the Singleton design pattern. The Singleton ensures that a class has one (and only
    one) instance on the heap and provides a global point of access at instance. This is useful when you need to
    coordinate actions among objects in your system or manage state. CommandCenter manages the state of the game.
    */
	// Singleton instance getter
	public static getInstance(): CommandCenter {
		if (!CommandCenter.instance) {
			CommandCenter.instance = new CommandCenter();
		}
		return CommandCenter.instance;
	}

	public initGame(): void {
		this.clearAll();
		this.generateStarField();
		this.setDimHash();
		this.setLevel(0);
		this.setScore(0);
		this.setPaused(false);
		this.setNumFalcons(4);
		this.falcon.decrementFalconNumAndSpawn();

		this.opsQueue.enqueue(this.falcon, GameOpAction.ADD);
		this.opsQueue.enqueue(this.miniMap, GameOpAction.ADD);
	}

	private setDimHash(): void {
		this.miniDimHash.set(Universe.FREE_FLY, new Dimension(1, 1));
		this.miniDimHash.set(Universe.CENTER, new Dimension(1, 1));
		this.miniDimHash.set(Universe.BIG, new Dimension(2, 2));
		this.miniDimHash.set(Universe.HORIZONTAL, new Dimension(3, 1));
		this.miniDimHash.set(Universe.VERTICAL, new Dimension(1, 3));
		this.miniDimHash.set(Universe.DARK, new Dimension(4, 4));
	}

	private generateStarField(): void {
		let count: number = 100;
		while (count-- > 0) {
			this.opsQueue.enqueue(new Star(), GameOpAction.ADD);
		}
	}

	public incrementFrame(): void {
		this.frame++;
	}

	private clearAll(): void {
		this.movDebris.clear();
		this.movFriends.clear();
		this.movFoes.clear();
		this.movFloaters.clear();
	}

	public isGameOver(): boolean {
		return this.numFalcons < 1;
	}

	public getUniDim(): Dimension {
		if (this.universe === undefined) {
			throw new Error("Universe is not set");
		}
		return this.miniDimHash.get(this.universe)!;
	}

	public isFalconPositionFixed(): boolean {
		return this.universe !== Universe.FREE_FLY;
	}
}
