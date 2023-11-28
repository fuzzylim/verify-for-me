import { formatDate, formatRelativeDate } from '@/lib/format';
import { HistoryItem } from '@/lib/history';
import CheckMark from './CheckMark';
import ExclamationTriangle from './ExclamationTriangle';

export default function VerificationSummary({ history }: { history: HistoryItem }) {
	const date = new Date(history.date);
	const overallResults = [history?.result?.company, history?.result?.abn || history?.result?.acn];
	const score = overallResults.filter(Boolean).length / overallResults.length;

	return history.result ? (
		<div className="flex flex-col gap-2">
			<p className={`mb-4 p-4 rounded-lg text-slate-700 ${score === 1 ? 'bg-green-400' : 'bg-amber-400'}`}>
				This code was verified by <span className="font-bold">{history.result.company}</span>{' '}
				<span title={formatDate(date!)}>{formatRelativeDate(date!)}</span>.
			</p>
			<div className="flex flex-row gap-2 mx-4">
				<span className="text-green-600">
					<CheckMark />
				</span>
				<span className="font-bold">{history.result.company}</span>
			</div>
			<div className="flex flex-row gap-2 mx-4">
				<span className={history.result.abn || history.result.abn ? 'text-green-600' : 'text-amber-600'}>
					{history.result.abn || history.result.abn ? <CheckMark /> : <ExclamationTriangle />}
				</span>
				<span className="font-bold">{history.result.abn || history.result.acn || 'No ABN or ACN'}</span>
			</div>
		</div>
	) : (
		<p>
			This code was not verified <span title={formatDate(date!)}>{formatRelativeDate(date!)}</span>.
		</p>
	);
}
