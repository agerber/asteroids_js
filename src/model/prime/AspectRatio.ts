import { AllArgsConstructor } from "../../decorators/AllArgsConstructor";
import { Getter } from "../../decorators/Getter";
import { Setter } from "../../decorators/Setter";

@AllArgsConstructor()
@Getter()
@Setter()
export class AspectRatio {
	private width: number = 0;
	private height: number = 0;


    /* TODO This is an example of the Fluent_Interface design pattern, which relies on method chaining to make the code
    more readable and intuitive. In this pattern, methods return the instance of the object, allowing multiple method
    calls to be linked together in a single, fluid expression.
   */
	public scale(scale: number): AspectRatio {
		this.width *= scale;
		this.height *= scale;
		return this;
	}
}
