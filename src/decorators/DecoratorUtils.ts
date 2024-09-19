export class DecoratorUtils {
	public static getPropertyType(target: any, property: string | symbol): string {
		return typeof target[property];
	}

	public static isFunction(target: any, property: string | symbol): boolean {
		return this.getPropertyType(target, property) === "function";
	}

	public static capitalizeProperty(property: string | symbol): string {
		return property.toString().charAt(0).toUpperCase() + property.toString().slice(1);
	}
}
