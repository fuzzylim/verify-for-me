import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const categories = [
		{
			name: 'Bank',
			description: 'Banking institutions',
			businesses: [
				{
					name: 'Commonwealth Bank',
					claims: [
						{ claimType: 'Website', details: 'https://www.commbank.com.au' },
						{ claimType: 'Phone', details: '13 2221' },
						{ claimType: 'Email', details: 'customersupport@commbank.com.au' },
						{ claimType: 'Live Chat', details: 'https://www.commbank.com.au/support.html' },
						{ claimType: 'Domain', details: '@cba.com.au' },
						{ claimType: 'ABN', details: '48 123 123 124' },
					],
				},
				{
					name: 'Westpac',
					claims: [
						{ claimType: 'Website', details: 'https://www.westpac.com.au' },
						{ claimType: 'Phone', details: '132 032' },
						{ claimType: 'Email', details: '' },
						{ claimType: 'Live Chat', details: 'https://www.westpac.com.au/contact-us/' },
						{ claimType: 'Domain', details: '@westpac.com.au' },
						{ claimType: 'ABN', details: '33 007 457 141' },
					],
				},
			],
		},
		{
			name: 'Energy',
			description: 'Energy providers',
			businesses: [
				{
					name: 'Energy Australia',
					claims: [
						{ claimType: 'Website', details: 'https://www.energyaustralia.com.au' },
						{ claimType: 'Phone', details: '13 15 35' },
						{ claimType: 'Email', details: 'customer@energyaustralia.com.au' },
						{ claimType: 'Live Chat', details: 'https://www.energyaustralia.com.au/contact-us' },
						{ claimType: 'Domain', details: '@energyaustralia.com.au' },
						{ claimType: 'ABN', details: '99 086 014 968' },
					],
				},
				// Add more energy providers here...
			],
		},
		{
			name: 'Telecommunications',
			description: 'Telecommunications providers',
			businesses: [
				{
					name: 'Telstra',
					claims: [
						{ claimType: 'Website', details: 'https://www.telstra.com.au' },
						{ claimType: 'Phone', details: '13 22 00' },
						{ claimType: 'Email', details: '' },
						{ claimType: 'Live Chat', details: 'https://www.telstra.com.au/contact-us' },
						{ claimType: 'Domain', details: '@telstra.com.au' },
						{ claimType: 'ABN', details: '33 051 775 556' },
					],
				},
				{
					name: 'Optus',
					claims: [
						{ claimType: 'Website', details: 'https://www.optus.com.au' },
						{ claimType: 'Phone', details: '13 39 37' },
						{ claimType: 'Email', details: '' },
						{ claimType: 'Live Chat', details: 'https://www.optus.com.au/shop/notices/service-chat' },
						{ claimType: 'Domain', details: '@optus.com.au' },
					],
				},
			],
		},
		// add insurance, etc...
	];

	for (const category of categories) {
		const newCategory = await prisma.category.create({
			data: {
				name: category.name,
				description: category.description,
			},
		});

		for (const business of category.businesses) {
			const existingBusiness = await prisma.business.findFirst({
				where: { name: business.name },
			});

			if (!existingBusiness) {
				const newBusiness = await prisma.business.create({
					data: {
						name: business.name,
						categoryId: newCategory.id,
					},
				});

				for (const claim of business.claims) {
					await prisma.claim.create({
						data: {
							claimType: claim.claimType,
							details: claim.details,
							votes: 0, // assuming initial votes are 0
							businessId: newBusiness.id,
						},
					});
				}
			}
		}
	}
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
