'use client';
import { useEffect, useState } from 'react';
import Pusher, { Channel } from 'pusher-js';
import { updateHistoryItem } from '@/lib/history';
import CheckMark from '@/components/CheckMark';
import ExclamationTriangle from '@/components/ExclamationTriangle';

async function getVerificationCode() {
	const res = await fetch('/api/otp/generate', { method: 'POST' });
	const json = await res.json();
	return json as { id: string; code: string };
}

export default function Home() {
	const [verificationCode, setVerificationCode] = useState<Awaited<ReturnType<typeof getVerificationCode>>>();
	const [verificationResult, setVerificationResult] = useState<any>(null);
	const [secondsLeft, setSecondsLeft] = useState<number>(0);
	const [score, setScore] = useState<number | null>(null);

	const displayMinutes = Math.floor(secondsLeft / 60);
	const displaySeconds = secondsLeft % 60;

	useEffect(() => {
		const pusher = new Pusher('9111c089ddd5ab37e914', {
			cluster: 'ap1',
		});

		let channel: Channel | undefined;

		async function fetchVerificationCode() {
			try {
				const verificationCode = await getVerificationCode();
				setVerificationCode(verificationCode);
				setSecondsLeft(5 * 60); // 5 minutes

				channel = pusher.subscribe(`look-who-otp-verify-${verificationCode.id}`);

				channel.bind('verified', function (data: any) {
					setVerificationResult(data);
					updateHistoryItem({
						id: verificationCode.id,
						code: verificationCode.code,
						date: new Date().toISOString(),
						result: {
							...data,
						},
					});

					const overallResults = [data?.company, data?.abn || data?.acn];

					setScore(overallResults.filter(Boolean).length / overallResults.length);
				});

				updateHistoryItem({
					id: verificationCode.id,
					code: verificationCode.code,
					date: new Date().toISOString(),
				});
			} catch (error) {
				console.error('Failed to fetch verification code:', error);
			}
		}

		void fetchVerificationCode();

		return () => {
			if (channel) {
				channel.unbind('verified');
				pusher.unsubscribe(channel.name);
			}
		};
	}, []);

	useEffect(() => {
		if (!verificationCode || verificationResult) return;

		const interval = setInterval(() => {
			if (secondsLeft > 0) {
				setSecondsLeft(secondsLeft - 1);
			} else {
				clearInterval(interval);
				if (!verificationResult) {
					alert('The verification code has expired!');
				}
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [secondsLeft, verificationCode, verificationResult]);

	let statusColor = '';
	if (verificationResult) {
		if (verificationResult.status === 'trusted') {
			statusColor = score === 1 ? 'bg-green-400' : 'bg-amber-400';
		} else if (verificationResult.status === 'not-trusted') {
			statusColor = 'bg-red-400';
		}
	}

	return (
		<main className="flex min-h-screen flex-col items-center py-24 px-4 max-w-lg mx-auto">
			{verificationCode && !verificationResult ? (
				<div className="absolute right-4 top-7">
					{secondsLeft
						? `Code expires in ${displayMinutes}:${displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds}`
						: 'Code expired'}
				</div>
			) : null}
			<div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:opacity-10 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:opacity-40 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-900 after:via-[#0141ff] after:blur-2xl after:content-[''] before:lg:h-[360px] z-[-1]">
				<h1 className="text-3xl text-center font-bold mb-4">Stop, Check ... Reject?</h1>
			</div>
			<blockquote className="text-xl italic font-semibold text-white">
				<svg
					className="w-8 h-8 text-gray-600 mb-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 18 14"
				>
					<path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
				</svg>
			</blockquote>
			<div className="text-center mt-8">
				<p>🧘 Take a breath. Real organisations won’t put you under pressure to act instantly.</p>
			</div>
			{verificationCode ? (
				<>
					<div className="text-center mt-8 bg-blue-100 px-4 py-2 rounded-lg text-slate-800">
						<h2 className={`text-4xl font-bold`}>{verificationCode.code}</h2>
					</div>

					<div className="text-center mt-8">
						<div className="text-lg text-center">
							<p className="mb-2">Ask the caller to email</p>
							<a
								href={`mailto:${verificationCode.code}@verifyfor.me?subject=${verificationCode.code}`}
								className="inline-block px-3 py-2 my-1 bg-indigo-600 text-white rounded-md text-xl font-semibold hover:bg-indigo-800 transition duration-200"
							>
								please@verifyfor.me
							</a>
							<p className="mt-2">from their work address with the code above in the subject.</p>
						</div>

						<div className="text-center mt-4 mb-8">
							{verificationResult ? (
								<div>
									<p className={`mb-4 p-4 rounded-lg text-slate-700 ${statusColor}`}>
										{verificationResult.status === 'trusted' ? (
											<>
												This code was verified by <span className="font-bold">{verificationResult.company}</span>
											</>
										) : (
											<>
												Verification was not possbile from{' '}
												<span className="font-bold">{verificationResult.domain}</span>
											</>
										)}
									</p>

									{verificationResult.status === 'trusted' && (
										<div className="flex flex-col gap-2">
											<div className="flex flex-row gap-2 mx-4">
												<span className="text-green-600">
													<CheckMark />
												</span>
												<span className="font-bold">{verificationResult.company}</span>
											</div>
											<div className="flex flex-row gap-2 mx-4">
												<span
													className={
														verificationResult.abn || verificationResult.abn ? 'text-green-600' : 'text-amber-600'
													}
												>
													{verificationResult.abn || verificationResult.abn ? <CheckMark /> : <ExclamationTriangle />}
												</span>
												<span className="font-bold">
													{verificationResult.abn || verificationResult.acn || 'No ABN or ACN'}
												</span>
											</div>
										</div>
									)}
								</div>
							) : null}
						</div>
						<div className="mt-5">
							<p>We&apos;ll let you know if the caller has access to a mailbox in a registered Australian company.</p>
						</div>
					</div>
				</>
			) : null}
		</main>
	);
}
