'use client';

import CheckMark from '@/components/CheckMark';
import ExclamationTriangle from '@/components/ExclamationTriangle';
import VerificationSummary from '@/components/VerificationSummary';
import { formatDate, formatRelativeDate } from '@/lib/format';
import { getHistory, updateHistoryItem } from '@/lib/history';
import { useEffect, useMemo, useState } from 'react';

async function refreshStatus(id: string) {
	const res = await fetch(`/api/otp/${id}`);
	const json = await res.json();
	return json;
}

export default function Page({ params }: { params: { verificationCodeId: string } }) {
	const [history, setHistory] = useState(
		useMemo(() => {
			const items = getHistory();
			return items.find(item => item.id === params.verificationCodeId);
		}, [params.verificationCodeId]),
	);
	const date = history ? new Date(history.date) : null;

	useEffect(() => {
		if (history?.id && !history?.result) {
			void (async () => {
				const result = await refreshStatus(history.id);
				if (result.status === 'verified') {
					const updatedHistory = {
						...history,
						result: result.result,
						date: result.date,
					};
					setHistory(updatedHistory);
					updateHistoryItem(updatedHistory);
				}
			})();
		}
	}, [history]);

	const overallResults = [history?.result?.company, history?.result?.abn || history?.result?.acn];
	const score = overallResults.filter(Boolean).length / overallResults.length;

	return (
		<main className="flex min-h-screen flex-col items-center py-24 px-4 max-w-lg mx-auto gap-4 text-center">
			{history ? (
				<>
					<div className="text-center mt-8 bg-blue-100 px-4 py-2 rounded-lg text-slate-800">
						<h2 className={`text-4xl font-bold`}>{history.code}</h2>
					</div>
					<VerificationSummary history={history} />
				</>
			) : (
				<p>not found</p>
			)}
		</main>
	);
}
