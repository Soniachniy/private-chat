import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageInput from '@/components/chat/MessageInput';
import ChatPlaceholder from '@/components/chat/ChatPlaceholder';
import UserMessage from '@/components/chat/messages/UserMessage';
import ResponseMessage from '@/components/chat/messages/ResponseMessage';
import MultiResponseMessages from '@/components/chat/messages/MultiResponseMessages';
import { useChat, useCreateChat } from '@/hooks/useChat';
import { useChatStore } from '@/stores/useChatStore';

import { openAIClient } from '@/api/openai';
import type { Message, ChatCompletionRequest, ChatHistory } from '@/types';
import NearAIIcon from '@/assets/icons/near-icon-green.svg?react';

import Navbar from '@/components/chat/Navbar';

const Home: React.FC = () => {
	const { chatId } = useParams<{ chatId: string }>();
	const params = useParams();
	const navigate = useNavigate();
	const currentChatId = chatId || params.chatId;
	const { setCurrentChatId, updateChat, chats } = useChatStore();

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

	const handleEditMessage = (messageId: string, content: string) => {
		console.log('Edit message:', messageId, content);
		// Update the message in the chat
		if (currentChatId) {
			updateChat(currentChatId, {
				messages: messages.map((msg) => (msg.id === messageId ? { ...msg, content } : msg))
			});
		}
	};

	const handleSaveMessage = (messageId: string, content: string) => {
		console.log('Save message:', messageId, content);
		handleEditMessage(messageId, content);
	};

	const handleDeleteMessage = (messageId: string) => {
		console.log('Delete message:', messageId);
		if (currentChatId) {
			updateChat(currentChatId, {
				messages: messages.filter((msg) => msg.id !== messageId)
			});
		}
	};

	const handleRegenerateResponse = () => {
		console.log('Regenerate response');
	};

	const handleMergeResponses = () => {
		console.log('Merge responses');
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
			<Navbar />
			<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
