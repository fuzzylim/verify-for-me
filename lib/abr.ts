import fetch from 'node-fetch';

export interface AbnResponse {
	/*
    "Abn": "74172177893",
    "AbnStatus": "Active",
    "AbnStatusEffectiveFrom": "1999-11-01",
    "Acn": "",
    "AddressDate": "2020-02-04",
    "AddressPostcode": "2601",
    "AddressState": "ACT",
    "BusinessName": [],
    "EntityName": "THE TRUSTEE FOR PSS FUND",
    "EntityTypeCode": "CSP",
    "EntityTypeName": "Commonwealth Government APRA Regulated Public Sector Scheme",
    "Gst": "2000-07-01",
    "Message": ""
    */
	Abn: string;
	AbnStatus: string;
	AbnStatusEffectiveFrom: string;
	Acn: string;
	AddressDate: string;
	AddressPostcode: string;
	AddressState: string;
	BusinessName: string[];
	EntityName: string;
	EntityTypeCode: string;
	EntityTypeName: string;
	Gst: string;
	Message: string;
}

export async function getBusinessDetails(abn: string): Promise<AbnResponse> {
	const abnGuid = process.env.ABN_GUID;
	if (!abnGuid) {
		console.error('Error: ABN_GUID is not set in the environment.');
		throw new Error('ABN_GUID is not set in the environment.');
	}

	const url = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${abn}&guid=${abnGuid}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}
		const data = await response.text();

		// The response is wrapped in a callback function, so we need to extract the JSON part
		const jsonStr = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
		return JSON.parse(jsonStr) as AbnResponse;
	} catch (error) {
		console.error('Error fetching ABN details:', error);
		throw error;
	}
}
