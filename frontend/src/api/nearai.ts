import { TEMP_API_BASE_URL } from './constants';

class NearAIClient {
	private baseURL: string;

	constructor(baseURL: string = TEMP_API_BASE_URL) {
		this.baseURL = `${baseURL}/api`;
		console.log('NearAIClient constructor', this.baseURL);
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		try {
			const response = await fetch(`${this.baseURL}${endpoint}`, {
				...options,
				headers: {
					Accept: 'application/json',
					...options.headers
				}
			});

			if (!response.ok) {
				const error = await response.json();
				throw error;
			}

			return await response.json();
		} catch (err) {
			console.error(err);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			throw (err as any)?.detail || err || 'An unknown error occurred';
		}
	}

	async getModelAttestationReport(
		token: string,
		model: string
	): Promise<ModelAttestationReport> {
		return this.request<ModelAttestationReport>(
			`/attestation/report?model=${encodeURIComponent(model)}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);
	}

	async getMessageSignature(
		token: string,
		model: string,
		chatCompletionId: string,
		signingAlgorithm: SigningAlgorithm = 'ecdsa'
	): Promise<MessageSignature> {
		return this.request<MessageSignature>(
			`/signature/${encodeURIComponent(chatCompletionId)}?model=${encodeURIComponent(model)}&signing_algo=${encodeURIComponent(signingAlgorithm)}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);
	}
}

export const nearAIClient = new NearAIClient();

// Type definitions
export type Address = `0x${string}`;

export type SigningAlgorithm = 'ecdsa';

export type ModelAttestationReport = {
	signing_address: Address;
	nvidia_payload: string;
	intel_quote: string;
	all_attestations: Array<{
		signing_address: Address;
		nvidia_payload: string;
		intel_quote: string;
	}>;
};

export type MessageSignature = {
	text: string; // Format: request_body_sha256:response_body_sha256
	signature: string;
	signing_address: Address;
	signing_algo: SigningAlgorithm;
	// params for error message
	message?: string;
	detail?: string;
};
