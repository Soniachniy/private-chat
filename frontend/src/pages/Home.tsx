import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import MessageInput from '@/components/chat/MessageInput';
import ChatPlaceholder from '@/components/chat/ChatPlaceholder';
import UserMessage from '@/components/chat/messages/UserMessage';
import ResponseMessage from '@/components/chat/messages/ResponseMessage';
import MultiResponseMessages from '@/components/chat/messages/MultiResponseMessages';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/stores/useChatStore';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';

import type { Message, ChatHistory } from '@/types';

import { v4 as uuidv4 } from 'uuid';
import Navbar from '@/components/chat/Navbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TEMP_API_BASE_URL } from '@/api/constants';
import { openAIClient } from '@/api/openai';
import MessageSkeleton from '@/components/chat/MessageSkeleton';

interface SendPromptParams {
	prompt: string;
	chatId?: string;
	model?: string;
	files?: File[];
}

const Home: React.FC = () => {
	const { chatId } = useParams<{ chatId: string }>();
	const params = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const currentChatId = chatId || params.chatId;
	const {
		setCurrentChat,
		chats,
		history,
		selectedModels,
		addMessage,
		addChat,
		updateMessage,
		setStreamingMessage,
		models
	} = useChatStore();

	const { data: chat, isLoading: isChatLoading } = useChat(currentChatId);
	const { socket } = useChatWebSocket();
	const [messages, setMessages] = useState<Message[]>(chat?.chat.messages || []);

	useEffect(() => {
		if (currentChatId) {
			setCurrentChat(chat || null);
		}
	}, [currentChatId, setCurrentChat, chat]);

	useEffect(() => {
		if (chat) {
			setMessages(chat.chat.messages || []);
		} else if (!currentChatId) {
			// When no chat is selected, use history from store
			const historyMessages = Object.values(history.messages);
			setMessages(historyMessages);
		}
	}, [chat, currentChatId, chats, history]);

	const handleSendMessage = async (content: string) => {
		console.log('Send message:', content);

		sendPromptMutation(
			{
				prompt: content,
				chatId: currentChatId
			},
			{
				onSuccess: (data) => {
					// Navigate to the new chat if it was just created
					if (!currentChatId && data.chatId) {
						navigate(`/c/${data.chatId}`);
					}
				}
			}
		);
	};

	const handleEditMessage = (messageId: string, content: string) => {
		console.log('Edit message:', messageId, content);
		// Update the message in the chat
	};

	const handleSaveMessage = (messageId: string, content: string) => {
		console.log('Save message:', messageId, content);
		handleEditMessage(messageId, content);
	};

	const handleDeleteMessage = (messageId: string) => {
		console.log('Delete message:', messageId);
	};

	const handleRegenerateResponse = () => {
		console.log('Regenerate response');
	};

	const handleMergeResponses = () => {
		console.log('Merge responses');
	};

	const { mutate: sendPromptMutation } = useMutation({
		mutationFn: async ({ prompt, chatId, model, files }: SendPromptParams) => {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('No token found');

			// Validate
			if (!prompt && (!files || files.length === 0)) {
				throw new Error('Please enter a prompt');
			}

			const selectedModel = model || selectedModels[0];
			if (!selectedModel || selectedModel === '') {
				throw new Error('Model not selected');
			}

			// Create user message
			const userMessageId = uuidv4();
			const userMessage: Message = {
				id: userMessageId,
				parentId: null,
				childrenIds: [],
				role: 'user',
				content: prompt,
				timestamp: Math.floor(Date.now() / 1000),
				models: [selectedModel],
				modelName: '',
				done: true
			};

			// Add user message to store
			addMessage(userMessage);

			// Create assistant message
			const assistantMessageId = uuidv4();
			const modelInfo = models.find((m) => m.id === selectedModel);
			const assistantMessage: Message = {
				id: assistantMessageId,
				parentId: userMessageId,
				childrenIds: [],
				role: 'assistant',
				content: '',
				timestamp: Math.floor(Date.now()),
				models: [selectedModel],
				modelName: modelInfo?.name || selectedModel,
				model: selectedModel,
				done: false
			};

			// Add assistant message to store
			addMessage(assistantMessage);
			setStreamingMessage(assistantMessage);

			// Update parent-child relationship
			updateMessage(userMessageId, {
				childrenIds: [assistantMessageId]
			});

			// Create or update chat
			let currentChatId = chatId;
			if (!currentChatId) {
				// Create new chat
				const newChatHistory: ChatHistory = {
					messages: {
						[userMessageId]: userMessage,
						[assistantMessageId]: assistantMessage
					},
					currentId: assistantMessageId
				};

				const newChat = await openAIClient.createNewChat(token, {
					id: uuidv4(),
					title: prompt.slice(0, 50),
					models: [selectedModel],
					history: newChatHistory,
					messages: [userMessage, assistantMessage],
					timestamp: Date.now()
				});

				currentChatId = newChat.id;
				addChat({
					id: newChat.id,
					title: prompt.slice(0, 50),
					content: prompt,
					created_at: Date.now(),
					updated_at: new Date().toISOString()
				});
			}

			// Send chat completion request
			const response = await fetch(`${TEMP_API_BASE_URL}/api/chat/completions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					model: selectedModel,
					messages: [
						{
							role: 'user',
							content: prompt
						}
					],
					stream: true,
					session_id: socket?.id,
					chat_id: currentChatId,
					message_id: assistantMessageId
				})
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.detail || 'Failed to send message');
			}

			return {
				chatId: currentChatId,
				userMessageId,
				assistantMessageId
			};
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['chat', data.chatId] });
			queryClient.invalidateQueries({ queryKey: ['chats'] });
		},
		onError: (error) => {
			console.error('Failed to send message:', error);
			setStreamingMessage(null);
		}
	});

	if (isChatLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
					<div className="text-sm text-gray-500 dark:text-gray-400">Loading chat...</div>
				</div>
			</div>
		);
	}

	if (!currentChatId) {
		return (
			<ChatPlaceholder
				submitVoice={async (voice) => {
					await handleSendMessage(voice);
				}}
				submitPrompt={async (prompt) => {
					await handleSendMessage(prompt);
				}}
			/>
		);
	}

	return (
		<div className="flex flex-col h-full bg-gray-900">
			{/* Messages */}
			<Navbar />
			<div className="flex-1 overflow-y-auto px-4 py-4 pt-8 space-y-4">
				{/* Messages */}
				{messages.map((message, idx) => {
					// Create a mock history object for the message components
					const mockHistory: ChatHistory = {
						messages: { [message.id]: message },
						currentId: message.id
					};

					// Get siblings for navigation
					const siblings = messages.map((m) => m.id);

					if (message.role === 'user') {
						return (
							<UserMessage
								key={message.id}
								history={mockHistory}
								messageId={message.id}
								siblings={siblings}
								isFirstMessage={idx === 0}
								readOnly={false}
								editMessage={handleEditMessage}
								deleteMessage={handleDeleteMessage}
							/>
						);
					} else if (message.role === 'assistant') {
						return <MessageSkeleton />;
					} else {
						// For assistant messages, check if it's a multi-response scenario
						const hasMultipleResponses = message.childrenIds && message.childrenIds.length > 1;

						if (hasMultipleResponses) {
							return (
								<MultiResponseMessages
									key={message.id}
									history={mockHistory}
									messageId={message.id}
									isLastMessage={idx === messages.length - 1}
									readOnly={false}
									webSearchEnabled={false}
									saveMessage={handleSaveMessage}
									deleteMessage={handleDeleteMessage}
									regenerateResponse={handleRegenerateResponse}
									mergeResponses={handleMergeResponses}
								/>
							);
						} else {
							return (
								<ResponseMessage
									key={message.id}
									history={mockHistory}
									messageId={message.id}
									siblings={siblings}
									isLastMessage={idx === messages.length - 1}
									readOnly={false}
									webSearchEnabled={false}
									saveMessage={handleSaveMessage}
									deleteMessage={handleDeleteMessage}
									regenerateResponse={handleRegenerateResponse}
								/>
							);
						}
					}
				})}
			</div>

			<MessageInput
				messages={messages}
				onSubmit={handleSendMessage}
				createMessagePair={handleSendMessage}
			/>
		</div>
	);
};

export default Home;
