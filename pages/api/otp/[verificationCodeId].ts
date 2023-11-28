import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

interface VerificationResult {
	status: 'verified' | 'unverified';
	result?: {
		domain?: string;
		company?: string;
		abn?: string;
	};
	date?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).end();
	}

	// Extract the verificationCodeId from the URL parameters
	const { verificationCodeId } = req.query;

	if (!verificationCodeId) {
		return res.status(400).end();
	}

	const verificationAttempt = await prisma.verificationAttempt.findFirst({
		where: {
			verificationCodeId: verificationCodeId as string,
		},
	});

	if (!verificationAttempt) {
		return res.status(200).json({ status: 'unverified' } as VerificationResult);
	}

	const suppliedDomain = verificationAttempt.emailAddress.split('@')[1];

	const trustedDomain = await prisma.trustedDomain.findFirst({
		where: {
			domain: suppliedDomain,
		},
	});

	let company: string | undefined;
	let domain: string | undefined;
	let abn: string | undefined;

	if (!trustedDomain) {
		const result = await fetch(
			`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${process.env.WHOAMIXMLAPI_KEY}&domainName=${suppliedDomain}&outputFormat=JSON`,
		);
		const json = await result.json();
		company = json.WhoisRecord.registryData.registrant?.organization ?? json.WhoisRecord.registrant?.organization;
		domain = json.WhoisRecord.domainName;
		const rawtext = json.WhoisRecord.registryData.rawText;
		const abnExpression = /^Registrant ID: (?<abn>.+)/gim;
		const abnMatch = abnExpression.exec(rawtext);
		abn = abnMatch?.groups?.abn;
		const trustedDomain = await prisma.trustedDomain.create({
			data: {
				domain: domain ?? '',
				company: company ?? '',
				abn: abn ?? '',
			},
		});
	} else {
		company = trustedDomain.company;
		domain = trustedDomain.domain;
		abn = trustedDomain.abn;
	}

	return res.status(200).json({
		status: 'verified',
		result: {
			domain,
			company,
			abn,
		},
		date: verificationAttempt.attemptedAt.toISOString(),
	} as VerificationResult);
}
