import type { Chat, ChatInfo, Tag } from '@/types';
import { TEMP_API_BASE_URL } from './constants';
import { getTimeRange } from '@/lib/utils';

class ChatClient {
	private baseURL: string;

	constructor(baseURL: string = TEMP_API_BASE_URL) {
		this.baseURL = `${baseURL}/api/v1`;
	}

	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const token = localStorage.getItem('token');
		try {
			const response = await fetch(`${this.baseURL}${endpoint}`, {
				...options,
				headers: {
					Accept: 'application/json',
					...options.headers,
					...(token && { Authorization: `Bearer ${token}` })
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

	//TODO: or use createNewChat
	async createChat(title: string = 'New Chat') {
		return {
			id: `chat-${Date.now()}`,
			title,
			user_id: 'user1',
			created_at: Date.now(),
			updated_at: Date.now()
		};
	}

	async createNewChat(chat: object) {
		return this.request<Chat>('/chats/new', {
			method: 'POST',
			body: JSON.stringify({
				chat: chat
			})
		});
	}

	async importChat(chat: object, meta: object | null, pinned?: boolean, folderId?: string | null) {
		return this.request<Chat>('/chats/import', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat: chat,
				meta: meta ?? {},
				pinned: pinned,
				folder_id: folderId
			})
		});
	}

	async getChatList(page: number | null = null) {
		const searchParams = new URLSearchParams();
		if (page !== null) {
			searchParams.append('page', `${page}`);
		}
		const res = await this.request<ChatInfo[]>(`/chats/?${searchParams.toString()}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return res.map((chat) => ({
			...chat,
			time_range: getTimeRange(chat.updated_at)
		}));
	}

	//TODO: Is it necessary?
	async getChatListByUserId(userId: string) {
		const res = await this.request<Chat[]>(`/chats/list/user/${userId}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});

		return res.map((chat) => ({
			...chat,
			time_range: getTimeRange(chat.updated_at)
		}));
	}

	async getArchivedChatList() {
		return this.request<Chat[]>(`/chats/archived`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async getAllChats() {
		return this.request<ChatInfo[]>(`/chats/all`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async getChatListBySearchText(text: string, page: number = 1) {
		const searchParams = new URLSearchParams();
		searchParams.append('text', text);
		searchParams.append('page', `${page}`);

		const res = await this.request<Chat[]>(`/chats/search?${searchParams.toString()}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return res.map((chat) => ({
			...chat,
			time_range: getTimeRange(chat.updated_at)
		}));
	}

	async getChatsByFolderId(folderId: string) {
		return this.request<Chat[]>(`/chats/folder/${folderId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async getAllArchivedChats() {
		return this.request<Chat[]>(`/chats/all/archived`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async getAllUserChats() {
		return this.request<Chat[]>(`/chats/all/db`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async getAllTags() {
		return [];
	}

	async getPinnedChatList() {
		const res = await this.request<Chat[]>(`/chats/pinned`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return res.map((chat) => ({
			...chat,
			time_range: getTimeRange(chat.updated_at)
		}));
	}

	async getChatListByTagName(tagName: string) {
		const res = await this.request<Chat[]>(`/chats/tags`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: tagName
			})
		});

		return res.map((chat) => ({
			...chat,
			time_range: getTimeRange(chat.updated_at)
		}));
	}

	async getChatById(id: string) {
		return this.request<Chat>(`/chats/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async getChatByShareId(shareId: string) {
		return this.request<Chat>(`/chats/share/${shareId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async getChatPinnedStatusById(id: string) {
		return this.request<boolean>(`/chats/${id}/pinned`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async toggleChatPinnedStatusById(id: string) {
		return this.request<Chat>(`/chats/${id}/pin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async cloneChatById(id: string, title?: string) {
		return this.request<Chat>(`/chats/${id}/clone`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...(title && { title: title })
			})
		});
	}

	async cloneSharedChatById(id: string) {
		return this.request<Chat>(`/chats/${id}/clone/shared`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async shareChatById(id: string) {
		return this.request<Chat>(`/chats/${id}/share`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async updateChatFolderIdById(id: string, folderId?: string) {
		return this.request<Chat>(`/chats/${id}/folder`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				folder_id: folderId
			})
		});
	}

	async archiveChatById(id: string) {
		return this.request<Chat>(`/chats/${id}/archive`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async deleteSharedChatById(id: string) {
		return this.request<Chat>(`/chats/${id}/share`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async updateChatById(id: string, chat: object) {
		return this.request<Chat>(`/chats/${id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat: chat
			})
		});
	}

	async deleteChatById(id: string) {
		return this.request<Chat>(`/chats/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async getTagsById(id: string) {
		console.log('getTagsById', id);
		return [];
		// return this.request<Tag[]>(`/chats/${id}/tags`, {
		//     method: 'GET',
		//     headers: {
		//         'Content-Type': 'application/json',
		//     }
		// });
	}

	async addTagById(id: string, tagName: string) {
		return this.request<Tag>(`/chats/${id}/tags`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: tagName
			})
		});
	}

	async deleteTagById(id: string, tagName: string) {
		return this.request<Tag>(`/chats/${id}/tags`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: tagName
			})
		});
	}

	async deleteTagsById(id: string) {
		return this.request<Tag>(`/chats/${id}/tags/all`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async deleteAllChats() {
		return this.request<Chat>(`/chats/`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async archiveAllChats() {
		return this.request<Chat>(`/chats/archive/all`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}

export const chatClient = new ChatClient();
