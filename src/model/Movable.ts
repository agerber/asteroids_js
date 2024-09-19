import { Point } from "./prime/Point";
import { LinkedList } from "./prime/LinkedList";

export enum Team {
	FRIEND,
	FOE,
	FLOATER,
	DEBRIS,
}
/* TODO This interface is an example of the Facade design pattern which provides a simplified
interface to a complex subsystem or set of classes. It hides the complexity by offering a more straightforward and unified API.
The goal is to make subsystems easier to use by providing a higher-level interface that clients can interact with.
 */
export interface Movable {
	move(): void;
	draw(g: CanvasRenderingContext2D): void;

	getCenter(): Point;
	getRadius(): number;
	getTeam(): Team;

	addToGame(list: LinkedList<Movable>): void;
	removeFromGame(list: LinkedList<Movable>): void;
}
