import { create } from 'zustand';
import type { Chat, ChatInfo, ChatStore, Model } from '../types';

export const useChatStore = create<ChatStore>((set) => ({
	chats: [],
	currentChat: null,
	isLoading: false,
	models: [],
	selectedModels: [''],
	setChats: (chats: ChatInfo[]) => set({ chats }),
	setCurrentChat: (chat: Chat | null) => set({ currentChat: chat }),
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
	setSelectedModels: (models: string[]) => set({ selectedModels: models })
}));
