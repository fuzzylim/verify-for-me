export function sortComparer<T, S extends string | number | boolean | Date>(
	getter: (obj: T) => S,
	direction: 'asc' | 'desc' = 'asc',
) {
	const directionMultiplier = direction === 'asc' ? 1 : -1;
	return (objA: T, objB: T) => {
		const valA = getter(objA);
		const valB = getter(objB);

		if (valA < valB) {
			return -1 * directionMultiplier;
		}
		if (valA > valB) {
			return 1 * directionMultiplier;
		}
		return 0;
	};
}
