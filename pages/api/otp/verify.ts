import { handleVerification } from '@/lib/handleVerification';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).end();
	}

	const { email_address, subject } = req.body;

	if (!email_address || !subject) {
		return res.status(400).json({ error: 'Invalid request payload' });
	}

	await handleVerification(email_address, subject);

	return res.status(200).end();
}
