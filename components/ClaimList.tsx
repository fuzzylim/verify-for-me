import { Claim, Verification } from '@prisma/client';
import React from 'react';

function ClaimList({ claims }: { claims: Array<Claim & { verifications: Verification[] }> }) {
	return (
		<>
			{claims.map(claim => (
				<p key={claim.details} className="text-sm">
					{claim.claimType}: {claim.details}
					{claim.verifications.some(v => v.result === 'success') ? (
						<span className="text-green-500 ml-2">✅</span>
					) : (
						<button type="button" className="text-orange-500 ml-2 hover:underline" title="Check with authority">
							⚠️
						</button>
					)}
				</p>
			))}
		</>
	);
}

export default ClaimList;
