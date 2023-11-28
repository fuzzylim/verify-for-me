const DATE_UNITS = [
	{
		unit: 'minute',
		milliseconds: 1000 * 60,
	},
	{
		unit: 'hour',
		milliseconds: 1000 * 60 * 60,
	},
	{
		unit: 'day',
		milliseconds: 1000 * 60 * 60 * 24,
	},
	{
		unit: 'week',
		milliseconds: 1000 * 60 * 60 * 24 * 7,
	},
	{
		unit: 'month',
		milliseconds: 1000 * 60 * 60 * 24 * 30,
	},
	{
		unit: 'year',
		milliseconds: 1000 * 60 * 60 * 24 * 365,
	},
];

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' });
const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { style: 'long' });

export function formatDate(date: Date) {
	return dateFormatter.format(date);
}

export function formatRelativeDate(date: Date) {
	const milliseconds = date.valueOf() - new Date().valueOf();
	const index = DATE_UNITS.findIndex(unitItem => Math.abs(milliseconds) < unitItem.milliseconds);

	if (index === 0) {
		return 'just now';
	}

	const unitDetails = DATE_UNITS[index > 0 ? index - 1 : DATE_UNITS.length - 1];

	const value = Math.round(milliseconds / unitDetails.milliseconds);

	return relativeFormatter.format(value, unitDetails.unit as Intl.RelativeTimeFormatUnit);
}
