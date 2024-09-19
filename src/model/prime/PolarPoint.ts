import { AllArgsConstructor } from "../../decorators/AllArgsConstructor";
import { Getter } from "../../decorators/Getter";
import { Setter } from "../../decorators/Setter";

@AllArgsConstructor()
@Getter()
@Setter()
export class PolarPoint {
	private r = 0;
	private theta = 0;

	public compareTheta(other: PolarPoint): number {
		if (this.theta < other.theta) {
			return -1;
		} else if (this.theta > other.theta) {
			return 1;
		} else {
			return 0;
		}
	}
}
