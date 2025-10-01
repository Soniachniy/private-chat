import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageInput from '@/components/chat/MessageInput';
import ChatPlaceholder from '@/components/chat/ChatPlaceholder';
import UserMessage from '@/components/chat/messages/UserMessage';
import ResponseMessage from '@/components/chat/messages/ResponseMessage';
import MultiResponseMessages from '@/components/chat/messages/MultiResponseMessages';
import { useChat, useCreateChat } from '@/hooks/useChat';
import { useChatStore } from '@/stores/useChatStore';

import { useViewStore } from '@/stores/useViewStore';
import { openAIClient } from '@/api/openai';
import type { Message, ChatCompletionRequest, ChatHistory } from '@/types';
import NearAIIcon from '@/assets/icons/near-icon-green.svg?react';
import SafeLogo from '@/assets/images/safe.svg';

const Home: React.FC = () => {
	const { chatId } = useParams<{ chatId: string }>();
	const params = useParams();
	const navigate = useNavigate();
	const currentChatId = chatId || params.chatId;
	const { setCurrentChatId, updateChat, chats } = useChatStore();

	const { isLeftSidebarOpen, setIsLeftSidebarOpen, isRightSidebarOpen, setIsRightSidebarOpen } =
		useViewStore();
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

	const handleNewChat = async () => {
		try {
			const newChat = await createChatMutation.mutateAsync('');
			navigate(`/c/${newChat.id}`);
		} catch (error) {
			console.error('Failed to create new chat:', error);
		}
	};

	const handleToggleSidebar = () => {
		setIsLeftSidebarOpen(!isLeftSidebarOpen);
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

	const handleRateMessage = (messageId: string, rating: number) => {
		console.log('Rate message:', messageId, rating);
		if (currentChatId) {
			updateChat(currentChatId, {
				messages: messages.map((msg) =>
					msg.id === messageId ? { ...msg, annotation: { ...msg.annotation, rating } } : msg
				)
			});
		}
	};

	const handleActionMessage = (messageId: string, action: string) => {
		console.log('Action message:', messageId, action);
	};

	const handleSubmitMessage = (content: string) => {
		handleSendMessage(content);
	};

	const handleContinueResponse = () => {
		console.log('Continue response');
	};

	const handleRegenerateResponse = () => {
		console.log('Regenerate response');
	};

	const handleMergeResponses = () => {
		console.log('Merge responses');
	};

	const handleAddMessages = (newMessages: Message[]) => {
		console.log('Add messages:', newMessages);
		if (currentChatId) {
			updateChat(currentChatId, {
				messages: [...messages, ...newMessages]
			});
		}
	};

	const handleTriggerScroll = () => {
		console.log('Trigger scroll');
	};

	const handleUpdateChat = (
		chatId: string,
		updates: Partial<{ messages: Message[]; updated_at: number; title?: string }>
	) => {
		updateChat(chatId, updates);
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
			<nav className="sticky top-0 z-30 w-full py-1.5 -mb-6 flex flex-col items-center drag-region">
				<div className="flex items-center w-full px-1.5">
					<div className="bg-gradient-to-b via-50% from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent pointer-events-none absolute inset-0 -bottom-7 z-[-1]"></div>

					<div className="flex max-w-full w-full mx-auto px-1 pt-1 bg-transparent">
						<div className="flex w-full max-w-full">
							{/* Left Sidebar Controls */}
							{!isLeftSidebarOpen && (
								<div
									className={`mr-2 md:mr-4 pt-0.5 gap-y-3 self-start flex flex-col text-gray-600 dark:text-gray-400`}
								>
									{/* Expand Sidebar Button */}
									<button
										type="button"
										className="text-white shadow h-8 w-8 cursor-pointer rounded flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-850 dark:bg-[rgba(248,248,248,0.04)]"
										onClick={handleToggleSidebar}
										title="Expand Sidebar"
									>
										<svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 6h16M4 12h16M4 18h16"
											/>
										</svg>
									</button>

									{/* New Chat Button */}
									<button
										id="new-chat-button"
										type="button"
										className="text-white shadow hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 h-8 w-8 rounded flex items-center justify-center dark:bg-[rgba(248,248,248,0.04)] transition-colors"
										onClick={handleNewChat}
										aria-label="New Chat"
										title="New Chat"
									>
										<svg
											className="size-4.5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											strokeWidth="2"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
											/>
										</svg>
									</button>
								</div>
							)}

							{/* Center Content */}
							<div className="flex-1 overflow-hidden max-w-full py-0.5">
								{/* Model Selector would go here if needed */}
							</div>

							{/* Right Side Controls */}
							<div className="self-start flex flex-none items-center text-gray-600 dark:text-gray-400">
								{/* Chat Menu Button */}
								{currentChatId && (
									<button
										className="flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition"
										id="chat-context-menu-button"
										title="Chat Options"
									>
										<div className="m-auto self-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												className="size-5"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
												/>
											</svg>
										</div>
									</button>
								)}
								{!isRightSidebarOpen && (
									<button
										onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
										className=" right-4 top-4 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200"
										title="Toggle Verification Panel"
									>
										<img alt="safe" src={SafeLogo} className="w-8 h-8" />
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</nav>
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
									chatId={currentChatId || ''}
									history={mockHistory}
									messageId={message.id}
									isLastMessage={idx === messages.length - 1}
									readOnly={false}
									webSearchEnabled={false}
									updateChat={handleUpdateChat}
									editMessage={handleEditMessage}
									saveMessage={handleSaveMessage}
									rateMessage={handleRateMessage}
									actionMessage={handleActionMessage}
									submitMessage={handleSubmitMessage}
									deleteMessage={handleDeleteMessage}
									continueResponse={handleContinueResponse}
									regenerateResponse={handleRegenerateResponse}
									mergeResponses={handleMergeResponses}
									addMessages={handleAddMessages}
									triggerScroll={handleTriggerScroll}
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
