import prisma from '@/lib/prisma';
import { WhoisDetails, getWhoisData } from '@/lib/whois';
import pusher from './pusher';
import { Business, TrustedDomain } from '@prisma/client';
import { AbnResponse, getBusinessDetails } from './abr';

const EVENT_PREFIX = 'look-who-otp-verify-';

export class InvalidVerificationRequest extends Error {
	constructor() {
		super('Invalid verification request');
		this.name = 'InvalidVerificationRequest';
	}
}

export async function handleVerification(emailAddress: string, subject: string) {
	console.debug('Starting handleVerification process...');

	if (!emailAddress || !subject) {
		console.debug('Invalid request. Missing emailAddress or subject.');
		throw new InvalidVerificationRequest();
	}

	const verificationCode = await fetchVerificationCode(subject);
	if (!verificationCode) return;

	await expireVerificationCode(verificationCode);
	await logVerificationAttempt(emailAddress, subject, verificationCode);

	const suppliedDomain = emailAddress.split('@')[1];
	const trustedDomain = await getOrCreateTrustedDomain(suppliedDomain);
	const business = trustedDomain && trustedDomain.abn ? await getOrCreateBusiness(trustedDomain.abn) : null;

	console.debug('About to trigger Pusher event...');
	if (trustedDomain) {
		await triggerPusherEvent(verificationCode.id, trustedDomain, business, 'trusted');
	} else {
		await triggerPusherEvent(
			verificationCode.id,
			{ domain: suppliedDomain, company: '', abn: '' },
			null,
			'not-trusted',
		);
	}
}

async function fetchVerificationCode(userCode: string) {
	const verificationCode = await prisma.verificationCode.findFirst({
		where: {
			code: userCode,
			expiry: { gt: new Date() },
		},
	});

	if (!verificationCode) {
		console.debug('No valid verificationCode found in the database.');
		throw new InvalidVerificationRequest();
	}

	return verificationCode;
}

async function expireVerificationCode(verificationCode: { id: string }) {
	console.debug('Expiring verificationCode...');
	await prisma.verificationCode.update({
		where: { id: verificationCode.id },
		data: { expiry: new Date() },
	});
}

async function logVerificationAttempt(emailAddress: string, attemptedCode: string, verificationCode: { id: string }) {
	await prisma.verificationAttempt.create({
		data: {
			attemptedCode,
			emailAddress,
			verificationCode: { connect: { id: verificationCode.id } },
		},
	});
}

async function getOrCreateTrustedDomain(domain: string) {
	let trustedDomain = await prisma.trustedDomain.findFirst({ where: { domain } });
	if (trustedDomain) {
		console.debug('Trusted domain found in database.', trustedDomain);
		return trustedDomain;
	}

	console.debug('Trusted domain not found in database. Fetching Whois data...');
	const details = await fetchWhoisData(domain);
	if (details) {
		trustedDomain = await prisma.trustedDomain.create({
			data: {
				domain: details.domainName,
				company: details.company,
				abn: details.abn || '',
			},
		});
	}

	return trustedDomain;
}

async function getOrCreateBusiness(abn: string) {
	let business = await prisma.business.findFirst({ where: { abn } });
	if (business) {
		console.debug('Business found in database.');
		return business;
	}

	console.debug('Business not found in database. Fetching ABN data...');
	const details = await getBusinessDetails(abn);


	if (details) {
		business = await prisma.business.create({
			data: {
				abn: details.Abn,
				name: details.EntityName,
				abnStatus: details.AbnStatus,
				abnStatusEffectiveFrom: details.AbnStatusEffectiveFrom,
			},
		});
		console.debug('Saved ABN data:', details);

	}

	return business;
}

async function fetchWhoisData(domain: string): Promise<WhoisDetails | null> {
	try {
		const details: WhoisDetails | null = await getWhoisData(domain);
		if (!details || !details.company || !details.domainName) {
			console.debug('Issue with domain or company in Whois data:', details);
			return null;
		}
		return details;
	} catch (error) {
		console.error('Error fetching Whois data:', error);
		return null;
	}
}

async function triggerPusherEvent(
	verificationId: string,
	{ domain, company, abn }: Partial<TrustedDomain>,
	business: Business | null,
	status: 'trusted' | 'not-trusted',
) {
	const domainData = {
		domain,
		company,
		abn,
		status,
		abnStatus: business ? business.abnStatus : undefined,
		abnStatusEffectiveFrom: business ? business.abnStatusEffectiveFrom : undefined,
	};

	try {
		console.debug(`${EVENT_PREFIX}${verificationId}`, domainData);
		await pusher.trigger(`${EVENT_PREFIX}${verificationId}`, 'verified', domainData);
	} catch (error) {
		console.error('Error triggering Pusher event:', error);
	}
}
