import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageInput from '@/components/chat/MessageInput';
import ChatPlaceholder from '@/components/chat/ChatPlaceholder';
import { useChat, useCreateChat } from '@/hooks/useChat';
import { useChatStore } from '@/stores/useChatStore';
import { useUserStore } from '@/stores/useUserStore';
import { openAIClient } from '@/api/openai';
import type { Message, ChatCompletionRequest } from '@/types';
import NearAIIcon from '@/assets/icons/near-icon-green.svg?react';

const Home: React.FC = () => {
	const { chatId } = useParams<{ chatId: string }>();
	const params = useParams();
	const navigate = useNavigate();
	const currentChatId = chatId || params.chatId;
	const { setCurrentChatId, updateChat, chats } = useChatStore();
	const { user } = useUserStore();
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const { data: chat, isLoading: isChatLoading } = useChat(currentChatId);
	const createChatMutation = useCreateChat();

	useEffect(() => {
		if (currentChatId) {
			setCurrentChatId(currentChatId);
		}
	}, [currentChatId, setCurrentChatId]);

	useEffect(() => {
		if (chat) {
			setMessages(chat.messages || chats.find((c) => c.id === currentChatId)?.messages || []);
		} else if (!currentChatId) {
			setMessages([]);
		}
	}, [chat, currentChatId, chats]);

	const handleSendMessage = async (content: string) => {
		let activeChatId = currentChatId;

		// Create new chat if we don't have one
		if (!activeChatId) {
			try {
				const newChat = await createChatMutation.mutateAsync('');
				activeChatId = newChat.id;
				navigate(`/c/${activeChatId}`);
			} catch (error) {
				console.error('Failed to create chat:', error);
				return;
			}
		}

		const userMessage: Message = {
			id: `msg-${Date.now()}`,
			role: 'user',
			content,
			timestamp: Date.now()
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			const request: ChatCompletionRequest = {
				model: 'gpt-3.5-turbo',
				messages: [...messages, userMessage].map((msg) => ({
					role: msg.role,
					content: msg.content
				})),
				stream: true,
				temperature: 0.7,
				max_tokens: 1000
			};

			const assistantMessage: Message = {
				id: `msg-${Date.now() + 1}`,
				role: 'assistant',
				content: '',
				timestamp: Date.now()
			};

			setMessages((prev) => [...prev, assistantMessage]);
			setIsLoading(false);

			// Handle streaming response
			let fullContent = '';
			for await (const chunk of openAIClient.createChatCompletionStream(request)) {
				const content = chunk.choices[0]?.delta?.content;
				if (content) {
					fullContent += content;
					setMessages((prev) =>
						prev.map((msg) =>
							msg.id === assistantMessage.id ? { ...msg, content: fullContent } : msg
						)
					);
				}

				if (chunk.choices[0]?.finish_reason === 'stop') {
					break;
				}
			}

			// Update the chat with new messages
			const updatedMessages = [
				...messages,
				userMessage,
				{ ...assistantMessage, content: fullContent }
			];
			updateChat(activeChatId!, {
				messages: updatedMessages,
				updated_at: Date.now(),
				title: updatedMessages.length === 2 ? content.slice(0, 50) + '...' : undefined
			});
		} catch (error) {
			console.error('Failed to send message:', error);
			setIsLoading(false);

			// Add error message
			const errorMessage: Message = {
				id: `msg-${Date.now() + 1}`,
				role: 'assistant',
				content: 'Sorry, I encountered an error while processing your message. Please try again.',
				timestamp: Date.now()
			};
			setMessages((prev) => [...prev, errorMessage]);
		}
	};

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

	if (messages.length === 0) {
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
			<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
				{messages.map((message) => (
					<div key={message.id} className="group flex space-x-3">
						{/* Avatar */}
						<div className="flex-shrink-0">
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
									message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
								}`}
							>
								{message.role === 'user' ? (
									user?.profile_image_url ? (
										<img
											src={user.profile_image_url}
											alt={user.name}
											className="w-8 h-8 rounded-full object-cover"
										/>
									) : (
										user?.name?.charAt(0).toUpperCase() || 'U'
									)
								) : (
									<NearAIIcon className="w-5 h-5" />
								)}
							</div>
						</div>

						{/* Message Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-center space-x-2 mb-1">
								<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
									{message.role === 'user' ? user?.name || 'You' : 'Assistant'}
								</span>
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{new Date(message.timestamp).toLocaleTimeString()}
								</span>
							</div>
							<div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
								{message.content}
							</div>
						</div>

						{/* Actions */}
						<div className="flex-shrink-0 flex items-start space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
							<button
								className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
								onClick={() => navigator.clipboard.writeText(message.content)}
								title="Copy message"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
							</button>
						</div>
					</div>
				))}

				{/* Loading indicator */}
				{isLoading && (
					<div className="flex space-x-3">
						<div className="flex-shrink-0">
							<div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-medium text-white">
								<NearAIIcon className="w-5 h-5" />
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center space-x-2 mb-1">
								<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
									Assistant
								</span>
							</div>
							<div className="text-sm text-gray-700 dark:text-gray-300">
								<div className="flex items-center space-x-1">
									<div className="flex space-x-1">
										<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: '0.1s' }}
										></div>
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: '0.2s' }}
										></div>
									</div>
									<span className="text-xs text-gray-500">Thinking...</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Message Input */}
			<MessageInput messages={messages} createMessagePair={handleSendMessage} />
		</div>
	);
};

export default Home;
