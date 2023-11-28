'use client';

import { sortComparer } from '@/lib/array';
import { formatDate, formatRelativeDate } from '@/lib/format';
import { getHistory } from '@/lib/history';
import Link from 'next/link';
import { useMemo } from 'react';

export default function VerificationHistory({ all }: { all?: boolean }) {
	const items = useMemo(
		() =>
			getHistory()
				.filter(item => all || item.result)
				.sort(sortComparer(item => item.date, 'desc'))
				.slice(0, 10),
		[all],
	);
	return items.length ? (
		<ul className="flex flex-col">
			{items.map(item => (
				<li key={item.id}>
					<Link href={`/history/${item.id}`} className="flex flex-col hover:bg-slate-600 py-1 px-3 rounded">
						<div>{item.result?.company ?? `Unverified: ${item.code}`}</div>
						<div className="text-sm text-slate-400" title={formatDate(new Date(item.date))}>
							{formatRelativeDate(new Date(item.date))}
						</div>
					</Link>
				</li>
			))}
		</ul>
	) : (
		<p className="text-sm py-1 px-3 text-slate-400">{all ? 'No history' : 'No verified history'}</p>
	);
}
