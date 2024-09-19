import { AllArgsConstructor } from "../../decorators/AllArgsConstructor";
import { Getter } from "../../decorators/Getter";
import { Setter } from "../../decorators/Setter";

@AllArgsConstructor()
@Getter()
@Setter()
export class Dimension {
	private width: number = 0;
	private height: number = 0;
}
