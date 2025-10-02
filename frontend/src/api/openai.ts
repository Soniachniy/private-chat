import type {
	ChatCompletionRequest,
	ChatCompletionResponse,
	ChatCompletionStreamResponse,
	Chat,
	Model,
	SessionUser,
	ChatInfo
} from '../types';

const API_BASE_URL = 'https://private-chat.near.ai/api';

export class OpenAIClient {
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

	async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
		// For now, return mock data
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

		return {
			id: `chatcmpl-${Date.now()}`,
			object: 'chat.completion',
			created: Math.floor(Date.now() / 1000),
			model: request.model,
			choices: [
				{
					index: 0,
					message: {
						role: 'assistant',
						content: `This is a mock response to: "${request.messages[request.messages.length - 1].content}". In a real implementation, this would come from the OpenAI API.`
					},
					finish_reason: 'stop'
				}
			],
			usage: {
				prompt_tokens: 50,
				completion_tokens: 30,
				total_tokens: 80
			}
		};
	}

	async *createChatCompletionStream(
		request: ChatCompletionRequest
	): AsyncIterable<ChatCompletionStreamResponse> {
		const responseText = `This is a mock streaming response to: "${request.messages[request.messages.length - 1].content}". Each word will appear one by one to simulate streaming.`;
		const words = responseText.split(' ');

		for (let i = 0; i < words.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate streaming delay

			yield {
				id: `chatcmpl-${Date.now()}`,
				object: 'chat.completion.chunk',
				created: Math.floor(Date.now() / 1000),
				model: request.model,
				choices: [
					{
						index: 0,
						delta: {
							role: i === 0 ? 'assistant' : undefined,
							content: (i === 0 ? '' : ' ') + words[i]
						},
						finish_reason: i === words.length - 1 ? 'stop' : undefined
					}
				]
			};
		}
	}

	// Chat management functions (these would normally be separate from OpenAI client)
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
