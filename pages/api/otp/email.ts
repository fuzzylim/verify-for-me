import { InvalidVerificationRequest, handleVerification } from '@/lib/handleVerification';
import { NextApiRequest, NextApiResponse } from 'next';
import type { InboundMessage } from 'postmark/dist/client/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).end();
	}

	// FIXME: Webhook protection, postmark doesn't have signature verification but a rudimentary one

	const { FromFull, Subject } = req.body as InboundMessage;

	console.log('code: ' + Subject);

	try {
		await handleVerification(FromFull.Email, Subject);
	} catch (error: any) {
		// This verification deserves no retries, just tell Postmark to stop sending it.
		if (error instanceof InvalidVerificationRequest) {
			return res.status(200).end();
		}

		// Any other error _can be_ retried, so we'll let Postmark know.
		return res.status(500).end({ message: error?.message ?? 'Unknown error' });
	}

	return res.status(200).end();
}
