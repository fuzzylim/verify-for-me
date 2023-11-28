import React from 'react';
import { PrismaClient } from '@prisma/client';
import Business from '@/components/Business'; // Import the new client component

const prisma = new PrismaClient();

async function getData() {
	return await prisma.category.findMany({
		include: {
			businesses: {
				include: {
					claims: {
						where: {
							claimType: {
								in: ['Website', 'Email Domain', 'ABN', 'ACN'],
							},
						},
						include: {
							verifications: true,
						},
					},
				},
			},
		},
	});
}

export default async function Page() {
	const categories = await getData();
	return (
		<main className="flex min-h-screen flex-col items-center py-16 px-4 max-w-lg mx-auto">
			<div className="p-2">
				{categories.map(category => (
					<div key={category.name} className="mb-6">
						<h2 className="text-2xl font-bold mb-4">{category.name}</h2>
						<div className="grid grid-cols-1 gap-4">
							{category.businesses.map(business => (
								<Business key={business.name} business={business} /> // Use the new client component
							))}
						</div>
					</div>
				))}
			</div>
		</main>
	);
}
