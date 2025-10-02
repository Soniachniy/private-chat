import { create } from 'zustand';
import { useUserStore } from './useUserStore';
import { useChatStore } from './useChatStore';
import { openAIClient } from '../api/openai';

interface AppInitializationStore {
	isInitialized: boolean;
	isLoading: boolean;
	initializeApp: () => Promise<void>;
}

export const useAppInitialization = create<AppInitializationStore>((set, get) => ({
	isInitialized: false,
	isLoading: false,

	initializeApp: async () => {
		if (get().isInitialized || get().isLoading) return;

		set({ isLoading: true });

		try {
			const [user, models] = await Promise.all([openAIClient.authUser(), openAIClient.getModels()]);

			useChatStore.getState().setModels(models);
			useUserStore.getState().setUser(user);

			if (user) {
				const chats = await openAIClient.getChats();
				useChatStore.getState().setChats(chats);
			}

			set({ isInitialized: true, isLoading: false });
		} catch (error) {
			console.error('Failed to initialize app:', error);
			set({ isLoading: false });
		}
	}
}));
