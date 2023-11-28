'use client';

import React from 'react';
import ClaimList from '@/components/ClaimList';

interface BusinessProps {
	business: {
		name: string;
		claims: any[]; // Update with a more detailed type if you have one for claims
	};
}

function verifyWithWhois(claims: any[]) {
	// look up any domains in the claims and verify with WHOIS
	// look for abn or acns returned and add verifications that records that the
	// registar has verified the domain to the  following abn
	// if no abn or acn is returned, add a verification that records that the
	// registar has verified the domain to the  returned business name
	// if the domain matches the abr abn or acn claim then add a verification that
	// the domain registar agrees with the abr record

	console.log('Verifying with WHOIS:', claims);
}

function verifyWithAbr(claims: any[]) {
	// look at any abn/acr claims from either the abr of whois sources and verify with the abr
	// include status and date of status
	console.log('Verifying with ABR:', claims);
}

const Business: React.FC<BusinessProps> = ({ business }) => {
	return (
		<div className="shadow p-6 bg-blue-100 text-slate-800 rounded-md">
			<h3 className="text-xl font-semibold mb-4">{business.name}</h3>
			<ClaimList claims={business.claims} />

			<div className="mt-4 flex space-x-2">
				<button
					onClick={() => verifyWithWhois(business.claims)}
					className="flex-1 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors duration-200"
				>
					Verify with WHOIS
				</button>
				<button
					onClick={() => verifyWithAbr(business.claims)}
					className="flex-1 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors duration-200"
				>
					Verify with ABR
				</button>
			</div>
		</div>
	);
};

export default Business;
