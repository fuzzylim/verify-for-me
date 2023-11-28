import fetch from 'node-fetch';

export interface WhoisDetails {
	domainName: string;
	company: string;
	abn?: string;
}

export async function getWhoisData(domain: string) {
	if (!domain) {
		console.error('Error: Domain is required.');
		throw new Error('Domain is required.');
	}

	const apiKey = process.env.WHOAMIXMLAPI_KEY;
	if (!apiKey) {
		console.error('Error: WHOAMIXMLAPI_KEY is not set in the environment.');
		throw new Error('WHOAMIXMLAPI_KEY is not set in the environment.');
	}

	const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${encodeURIComponent(
		domain,
	)}&outputFormat=JSON`;

	try {
		const response = await fetch(apiUrl);

		if (!response.ok) {
			const errorMessage = `Failed to fetch data for domain: ${domain}. Status: ${response.status} ${response.statusText}`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}

		const data = await response.json();

		if (!data || !data.WhoisRecord) {
			console.warn(`Warning: Unexpected response format for domain: ${domain}.`, data);
			return defaultWhoisDetails(domain);
		}

		const { WhoisRecord } = data;
		const { registryData = {}, registrant = {} } = WhoisRecord;
		const { registrant: registryRegistrant = {}, rawText = '' } = registryData;

		const company = registryRegistrant.organization ?? registrant.organization ?? '';
		const domainName = WhoisRecord.domainName ?? domain;
		const abnMatch = /^Registrant ID: (?<abn>.+)/gim.exec(rawText);
		const abn = abnMatch?.groups?.abn?.replace(/ /g, '') ?? '';

		return { company, domainName, abn };
	} catch (error) {
		console.error(`Error fetching whois data for domain ${domain}:`, error);
		return defaultWhoisDetails(domain);
	}
}

function defaultWhoisDetails(domain: string): WhoisDetails {
	return { company: '', domainName: domain, abn: '' };
}
