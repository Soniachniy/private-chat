import type { Config } from '@/types';
import { TEMP_API_BASE_URL } from './constants';

class ConfigClient {
	private baseURL: string;

	constructor(baseURL: string = TEMP_API_BASE_URL) {
		this.baseURL = `${baseURL}/api`;
		console.log('ConfigClient constructor', this.baseURL);
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		try {
			const response = await fetch(`${this.baseURL}${endpoint}`, {
				...options,
				headers: {
					'Content-Type': 'application/json',
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

	async getConfig(): Promise<Config> {
		return this.request<Config>('/config', {
			method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
		});
	}
}

export const configClient = new ConfigClient();
