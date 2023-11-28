import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ id: string; code: string }>) {
	const requestMethod = req.method;

	switch (requestMethod) {
		case 'POST':
			const code = Math.floor(100000 + Math.random() * 900000).toString();

			const verificationCode = await prisma.verificationCode.create({
				data: {
					code: code,
					expiry: new Date(Date.now() + 5 * 60 * 1000),
				},
			});

			res.status(200).json({ id: verificationCode.id, code: verificationCode.code });

			break;
		default:
			res.status(405).end();
			break;
	}
}
