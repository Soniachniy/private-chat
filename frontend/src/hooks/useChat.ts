import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useChatStore } from '../stores/useChatStore';
import type { ChatInfo, Message } from '../types';
import { chatClient } from '@/api/chat';
import { useUserStore } from '@/stores/useUserStore';

export const useChats = () => {
	const { setChats } = useChatStore();
	const { user } = useUserStore();

	return useQuery({
		queryKey: ['chats'],
		queryFn: async () => {
			const chats = await chatClient.getAllChats(); // TODO: add pagination
			setChats(chats);
			return chats;
		},
		enabled: !!user
	});
};

export const useChat = (setCurrentMessages: (messages: Message[]) => void, chatId?: string) => {
	const { setCurrentChat } = useChatStore();
	return useQuery({
		queryKey: ['chat', chatId],
		queryFn: async () => {
			const chat = await chatClient.getChatById(chatId!);
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
		mutationFn: (title?: string) => chatClient.createChat(title),
		onSuccess: (newChat) => {
			addChat(newChat as unknown as ChatInfo); //TODO: fix this
			queryClient.invalidateQueries({ queryKey: ['chats'] });
		}
	});
};

export const useDeleteChatById = () => {
	const queryClient = useQueryClient();
	const { deleteChat } = useChatStore(); //TODO: remove this

	return useMutation({
		mutationFn: (chatId: string) => chatClient.deleteChatById(chatId),
		onSuccess: (_, chatId) => {
			deleteChat(chatId);
			queryClient.invalidateQueries({ queryKey: ['chats'] });
		}
	});
};

export const useToggleChatPinnedStatusById = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (chatId: string) => chatClient.toggleChatPinnedStatusById(chatId),
		onSuccess: (_, chatId) => {
			queryClient.invalidateQueries({ queryKey: ['chats'] });
			queryClient.invalidateQueries({ queryKey: ['chatPinnedStatusById', chatId] });
		}
	});
};

export const useChatPinnedStatusById = (chatId: string) => {
	return useQuery({
		queryKey: ['chatPinnedStatusById', chatId],
		queryFn: async () => chatClient.getChatPinnedStatusById(chatId),
	});
};

export const useCloneChatById = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (chatId: string) => chatClient.cloneChatById(chatId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['chats'] });
		}
	});
};

export const useArchiveChatById = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (chatId: string) => chatClient.archiveChatById(chatId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['chats'] });
		}
	});
};

export const useRenameChatById = () => {
	const queryClient = useQueryClient();
	const { updateChat } = useChatStore();

	return useMutation({
		mutationFn: ({ chatId, title }: { chatId: string, title: string }) => chatClient.updateChatById(chatId, { title }),
		onSuccess: (_, { chatId, title }) => {
			updateChat(chatId, { title });
			queryClient.invalidateQueries({ queryKey: ['chats'] });
		}
	});
};