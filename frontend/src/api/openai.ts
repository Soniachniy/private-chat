import type { Model } from '../types';

const API_BASE_URL = 'https://private-chat.near.ai/api';

class OpenAIClient {
	private baseURL: string;

	constructor(baseURL: string = API_BASE_URL) {
		this.baseURL = baseURL;
	}

	async getModels(): Promise<Model[]> {
		const token = localStorage.getItem('token');
		if (!token) {
			throw new Error('No token found');
		}
		const response = await fetch(`${this.baseURL}/models`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const { data } = await response.json();
		return data;
	}
}

export const openAIClient = new OpenAIClient();
