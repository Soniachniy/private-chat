import { create } from 'zustand';
import type { Chat, ChatInfo, ChatStore, Model, Message, ChatHistory } from '../types';

export const useChatStore = create<ChatStore>((set) => ({
	chats: [],
	setChats: (chats: ChatInfo[]) => set({ chats }),

	currentChat: null,
	setCurrentChat: (chat: Chat | null) => set({ currentChat: chat }),

	isLoading: false,
	models: [],
	selectedModels: [''],
	history: { messages: {}, currentId: null },
	streamingMessage: null,

	setModels: (models: Model[]) => set({ models }),

	addChat: (chat: ChatInfo) => set((state) => ({ chats: [chat, ...state.chats] })),

	updateChat: (id: string, chatUpdate: Partial<ChatInfo>) =>
		set((state) => ({
			chats: state.chats.map((chat) => (chat.id === id ? { ...chat, ...chatUpdate } : chat))
		})),

	deleteChat: (id: string) =>
		set((state) => ({
			chats: state.chats.filter((chat) => chat.id !== id)
		})),

	setLoading: (loading: boolean) => set({ isLoading: loading }),
	setSelectedModels: (models: string[]) => set({ selectedModels: models }),

	// Message management
	setHistory: (history: ChatHistory) => set({ history }),

	addMessage: (message: Message) =>
		set((state) => ({
			history: {
				...state.history,
				messages: {
					...state.history.messages,
					[message.id]: message
				},
				currentId: message.id
			}
		})),

	updateMessage: (messageId: string, update: Partial<Message>) =>
		set((state) => ({
			history: {
				...state.history,
				messages: {
					...state.history.messages,
					[messageId]: {
						...state.history.messages[messageId],
						...update
					}
				}
			}
		})),

	setStreamingMessage: (message: Message | null) => set({ streamingMessage: message }),

	appendToMessage: (messageId: string, content: string) =>
		set((state) => {
			const message = state.history.messages[messageId];
			if (!message) return state;

			return {
				history: {
					...state.history,
					messages: {
						...state.history.messages,
						[messageId]: {
							...message,
							content: message.content + content
						}
					}
				}
			};
		})
}));
