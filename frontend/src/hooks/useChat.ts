import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { openAIClient } from '../api/openai';
import { useChatStore } from '../stores/useChatStore';
import type { ChatInfo, Message } from '../types';

export const useChats = () => {
	const { setChats } = useChatStore();

	return useQuery({
		queryKey: ['chats'],
		queryFn: async () => {
			const chats = await openAIClient.getChats();
			setChats(chats);
			return chats;
		}
	});
};

export const useChat = (setCurrentMessages: (messages: Message[]) => void, chatId?: string) => {
	const { setCurrentChat } = useChatStore();
	return useQuery({
		queryKey: ['chat', chatId],
		queryFn: async () => {
			const chat = await openAIClient.getChatById(chatId!);
			console.log(chat);
			setCurrentChat(chat);
			setCurrentMessages(Object.values(chat.chat.history.messages));
			return chat;
		},
		enabled: !!chatId
	});
};

export const useCreateChat = () => {
	const queryClient = useQueryClient();
	const { addChat } = useChatStore();

	return useMutation({
		mutationFn: (title?: string) => openAIClient.createChat(title),
		onSuccess: (newChat) => {
			addChat(newChat as unknown as ChatInfo); //TODO: fix this
			queryClient.invalidateQueries({ queryKey: ['chats'] });
		}
	});
};

export const useDeleteChat = () => {
	const queryClient = useQueryClient();
	const { deleteChat } = useChatStore();

	return useMutation({
		mutationFn: (chatId: string) => openAIClient.deleteChat(chatId),
		onSuccess: (_, chatId) => {
			deleteChat(chatId);
			queryClient.invalidateQueries({ queryKey: ['chats'] });
		}
	});
};
