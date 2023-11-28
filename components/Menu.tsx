'use client';

import { useEffect, useRef, useState } from 'react';
import VerificationHistory from './VerificationHistory';
import Link from 'next/link';

export default function Menu() {
	const [visible, setVisible] = useState(false);
	const [showAll, setShowAll] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		document.addEventListener('click', e => {
			const button = (e.target as HTMLElement).closest('button');
			const keepOpen = (e.target as HTMLElement).closest('.keep-menu-open');

			if (button === buttonRef.current) {
				setVisible(!visible);
			} else if (!keepOpen) {
				setVisible(false);
			}
		});
	}, [visible]);

	return (
		<div className="flex flex-col absolute left-4 top-4">
			<button ref={buttonRef} className="p-2 rounded-full bg-black/50 self-start">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-6 h-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			{visible ? (
				<div className="bg-slate-700 py-3 px-1 mt-1 shadow-md text-slate-100 min-w-[300px] gap-2 flex flex-col rounded">
					<Link className="text-lg font-semibold px-3 grow underline hover:no-underline cursor-pointer" href="/legends">
						The Legends of Trust
					</Link>
					<div className="divider h-[1px] bg-gray-300 my-2"></div>
					<div className="flex gap-4">
						<h2 className="text-lg font-semibold px-3 grow">History</h2>
						<div className="mt-1 mr-4">
							<label className="keep-menu-open relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									value=""
									className="sr-only peer"
									checked={showAll}
									onChange={e => setShowAll(e.currentTarget.checked)}
								/>
								<div className="w-9 h-5 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
								<span className="ml-2 text-sm font-medium">all</span>
							</label>
						</div>
					</div>
					<VerificationHistory all={showAll} />
				</div>
			) : null}
		</div>
	);
}
