import { DecoratorUtils } from "./DecoratorUtils";

type Constructor<T> = new (...args: any[]) => T;

export const Getter =
	() =>
	<T extends Constructor<{}>>(constructor: T) => {
		return class extends constructor {
			constructor(...args: any[]) {
				super(...args);
				const properties = Reflect.ownKeys(this);
				properties.forEach((property: string | symbol) => {
					if (DecoratorUtils.isFunction(this, property)) return;

					const capitalizedProperty = DecoratorUtils.capitalizeProperty(property);
					const methodPreffix = DecoratorUtils.getPropertyType(this, property) === "boolean" ? "is" : "get";
					const methodName = `${methodPreffix}${capitalizedProperty}`;

					// Check if method already exists
					if ((this as any)[methodName]) return;

					Object.defineProperty(this, methodName, {
						value: () => (this as any)[property],
					});
				});
			}
		};
	};
