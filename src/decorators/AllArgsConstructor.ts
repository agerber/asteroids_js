import { DecoratorUtils } from "./DecoratorUtils";

type Constructor<T> = new (...args: any[]) => T;

export const AllArgsConstructor =
	() =>
	<T extends Constructor<{}>>(constructor: T) => {
		return class extends constructor {
			constructor(...args: any[]) {
				super(...args);
				const properties = Reflect.ownKeys(this).filter(
					(property) => !DecoratorUtils.isFunction(this, property)
				);

				if (args.length !== properties.length) {
					throw new Error(`Expected ${properties.length} arguments but received ${args.length}`);
				}

				properties.forEach((property: string | symbol, index: number) => {
					if (DecoratorUtils.getPropertyType(this, property) !== typeof args[index]) {
						throw new TypeError(
							`Type of ${String(property)} is ${DecoratorUtils.getPropertyType(
								this,
								property
							)} but received ${typeof args[index]}`
						);
					}
					(this as any)[property] = args[index];
				});
			}
		};
	};
