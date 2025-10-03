import type { Chat, Model, SessionUser, ChatInfo } from '../types';

const API_BASE_URL = 'https://private-chat.near.ai/api';

class OpenAIClient {
	private apiKey: string;
	private baseURL: string;

	constructor(apiKey: string = '', baseURL: string = API_BASE_URL) {
		this.apiKey = apiKey;
		this.baseURL = baseURL;
		console.log('OpenAIClient constructor', this.apiKey, this.baseURL);
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

	async authUser(): Promise<SessionUser> {
		const token = localStorage.getItem('token');
		if (!token) {
			throw new Error('No token found');
		}

		const response = await fetch(`${this.baseURL}/v1/auths/`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const data = await response.json();
		return data;
	}

	// Chat management functions
	async getChats(): Promise<ChatInfo[]> {
		const token = localStorage.getItem('token');
		if (!token) {
			throw new Error('No token found');
		}
		const response = await fetch(`${this.baseURL}/v1/chats/?page=1`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const data = await response.json();
		console.log('ChatInfo', response, data);
		return data;
	}

	async getChatById(id: string): Promise<Chat> {
		const token = localStorage.getItem('token');
		if (!token) {
			throw new Error('No token found');
		}
		const response = await fetch(`${this.baseURL}/v1/chats/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const data = await response.json();
		console.log('response', response, data);
		return data;
	}

	async getArchivedChatList(token: string = '') {
		let error = null;

		const res = await fetch(`${this.baseURL}/chats/archived`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...(token && { authorization: `Bearer ${token}` })
			}
		})
			.then(async (res) => {
				if (!res.ok) throw await res.json();
				return res.json();
			})
			.then((json) => {
				return json;
			})
			.catch((err) => {
				error = err;
				console.log(err);
				return null;
			});

		if (error) {
			throw error;
		}

		return res;
	}

	async createNewChat(token: string, chat: object) {
		let error = null;

		const res = await fetch(`${this.baseURL}/v1/chats/new`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				chat: chat
			})
		})
			.then(async (res) => {
				if (!res.ok) throw await res.json();
				return res.json();
			})
			.catch((err) => {
				error = err;
				console.log(err);
				return null;
			});

		if (error) {
			throw error;
		}

		return res;
	}

	async createChat(title: string = 'New Chat') {
		return {
			id: `chat-${Date.now()}`,
			title,
			user_id: 'user1',
			created_at: Date.now(),
			updated_at: Date.now()
		};
	}

	async deleteChat(id: string): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, 300));
		console.log('deleteChat', id);
	}
}

export const openAIClient = new OpenAIClient();
