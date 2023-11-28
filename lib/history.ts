'use client';

export interface HistoryItem {
	id: string;
	code: string;
	date: string;
	result?: {
		company?: string;
		abn?: string;
		acn?: string;
	};
}

const defaultData: HistoryItem[] = [];

export function getHistory() {
	const items = JSON.parse(localStorage.getItem('history') || JSON.stringify(defaultData)) as HistoryItem[];
	return items.slice(0, 100);
}

export function updateHistoryItem(item: HistoryItem) {
	const history = getHistory();
	const index = history.findIndex(h => h.id === item.id);

	if (index === -1) {
		history.unshift(item);
	} else {
		history[index] = item;
	}

	localStorage.setItem('history', JSON.stringify(history));
}
