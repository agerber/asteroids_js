import { AllArgsConstructor } from "../../decorators/AllArgsConstructor";
import { Getter } from "../../decorators/Getter";
import { Setter } from "../../decorators/Setter";

// TODO: Fix AllArgsConstructor
// @AllArgsConstructor()
@Getter()
@Setter()
export class Point {
	private x: number = 0;
	private y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public distanceTo(other: Point): number {
		return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
	}

	public clone(): Point {
		return new Point(this.x, this.y);
	}
}
