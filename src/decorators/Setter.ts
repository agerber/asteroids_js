import { DecoratorUtils } from "./DecoratorUtils";

type Constructor<T> = new (...args: any[]) => T;

export const Setter =
	() =>
	<T extends Constructor<{}>>(constructor: T) => {
		return class extends constructor {
			constructor(...args: any[]) {
				super(...args);
				const properties = Reflect.ownKeys(this);
				properties.forEach((property: string | symbol) => {
					if (DecoratorUtils.isFunction(this, property)) return;

					const capitalizedProperty = DecoratorUtils.capitalizeProperty(property);
					const methodName = `set${capitalizedProperty}`;

					// Check if method already exists
					if ((this as any)[methodName]) return;

					Object.defineProperty(this, methodName, {
						value: (newValue: any) => {
							if (DecoratorUtils.getPropertyType(this, property) !== typeof newValue) {
								throw new TypeError(
									`Type of ${String(property)} is ${DecoratorUtils.getPropertyType(
										this,
										property
									)} but received ${typeof newValue}`
								);
							}

							(this as any)[property] = newValue;
						},
					});
				});
			}
		};
	};
