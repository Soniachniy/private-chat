import { useEffect, useRef, useCallback, useState } from 'react';

import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../stores/useChatStore';
import { TEMP_API_BASE_URL } from '../api/constants';

interface ChatEventData {
	chat_id: string;
	message_id: string;
	data: {
		type:
			| 'status'
			| 'message'
			| 'replace'
			| 'error'
			| 'chat:completion'
			| 'chat:message:delta'
			| 'chat:message'
			| 'chat:message:files'
			| 'chat:title'
			| 'source'
			| 'citation'
			| 'files';
		content?: string;
		description?: string;
		done?: boolean;
		error?: unknown;
		files?: unknown[];
		data?: unknown; // For nested data in chat:completion events
	};
}

interface CompletionData {
	id?: string;
	done?: boolean;
	choices?: Array<{
		message?: {
			content?: string;
		};
		delta?: {
			content?: string;
		};
	}>;
	content?: string;
	sources?: unknown[];
	selected_model_id?: string;
	error?: {
		content?: string;
		message?: string;
	};
	usage?: {
		prompt_tokens?: number;
		completion_tokens?: number;
		total_tokens?: number;
	};
}

export const useChatWebSocket = () => {
	const socketRef = useRef<Socket | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<
		'connecting' | 'connected' | 'disconnected' | 'error'
	>('disconnected');
	const { updateMessage, appendToMessage, history } = useChatStore();

	// Helper function to handle chat completion events similar to Svelte's chatCompletionEventHandler
	const handleChatCompletion = useCallback(
		(data: CompletionData, messageId: string) => {
			const { id, done, choices, content, sources, selected_model_id, error, usage } = data;

			if (error) {
				updateMessage(messageId, {
					content: error.content || error.message || 'An error occurred',
					done: true,
					error: true
				});
				return;
			}

			// Store the chat completion ID if provided
			if (id) {
				updateMessage(messageId, {
					chatCompletionId: id
				});
			}

			// Handle sources if present
			if (sources) {
				updateMessage(messageId, {
					sources: sources
				});
			}

			// Handle usage statistics if present
			if (usage) {
				updateMessage(messageId, {
					usage: usage
				});
			}

			// Handle choices for streaming and non-streaming responses
			if (choices && choices.length > 0) {
				const choice = choices[0];

				if (choice.message?.content) {
					// Non-streaming response: append content
					appendToMessage(messageId, choice.message.content);
				} else if (choice.delta?.content) {
					// Streaming response: append delta content
					const deltaContent = choice.delta.content;

					// Similar to Svelte: skip empty responses that are just newlines
					const currentMessage = history.messages[messageId];
					if (currentMessage && currentMessage.content === '' && deltaContent === '\n') {
						console.log('Empty response');
					} else {
						appendToMessage(messageId, deltaContent);
					}
				}
			}

			// Handle direct content (for cases where it's not in choices)
			if (content) {
				appendToMessage(messageId, content);
			}

			// Handle completion
			if (done) {
				updateMessage(messageId, {
					done: true,
					modelName: selected_model_id || ''
				});
			}
		},
		[updateMessage, appendToMessage, history.messages]
	);

	const handleChatEvent = useCallback(
		(data: ChatEventData) => {
			const { message_id, data: eventData } = data;

			console.log('WebSocket chat event:', data);

			// Only process events for current chat (similar to Svelte logic)
			const type = eventData.type;

			switch (type) {
				case 'status':
					updateMessage(message_id, {
						done: eventData.done,
						content: eventData.content
					});
					break;

				case 'chat:completion':
					handleChatCompletion(
						(eventData.data as CompletionData) || (eventData as CompletionData),
						message_id
					);
					break;

				case 'chat:message:delta':
				case 'message':
					if (eventData.content) {
						appendToMessage(message_id, eventData.content);
					}
					break;

				case 'chat:message':
				case 'replace':
					if (eventData.content) {
						updateMessage(message_id, {
							content: eventData.content
						});
					}
					break;

				case 'chat:message:files':
				case 'files':
					if (eventData.files) {
						updateMessage(message_id, {
							files: eventData.files
						});
					}
					break;

				case 'chat:title':
					// Handle chat title updates (could update store)
					console.log('Chat title updated:', eventData);
					break;

				case 'source':
				case 'citation':
					if (eventData.content) {
						appendToMessage(message_id, eventData.content);
					}
					break;

				case 'error':
					updateMessage(message_id, {
						content: eventData.description || String(eventData.error) || 'An error occurred',
						done: true,
						error: true
					});
					break;

				default:
					console.log('Unknown message type:', type, eventData);
					break;
			}
		},
		[updateMessage, appendToMessage, handleChatCompletion]
	);

	// Initialize WebSocket connection
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token || socketRef.current) return;

		setConnectionStatus('connecting');

		const socket = io(TEMP_API_BASE_URL, {
			path: '/ws/socket.io',
			auth: { token },
			transports: ['websocket', 'polling'],
			autoConnect: true,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			timeout: 10000,
			forceNew: false
		});

		socket.on('connect', () => {
			console.log('WebSocket connected with ID:', socket.id);
			setConnectionStatus('connected');
		});

		socket.on('chat-events', handleChatEvent);

		socket.on('disconnect', (reason) => {
			console.log('WebSocket disconnected:', reason);
			setConnectionStatus('disconnected');
			// Clear streaming message on disconnect to prevent UI issues
		});

		socket.on('connect_error', (error) => {
			console.error('WebSocket connection error:', error);

			setConnectionStatus('error');
		});

		socket.on('error', (error) => {
			console.error('WebSocket error:', error);
			setConnectionStatus('error');
		});

		socket.on('reconnect', (attemptNumber) => {
			console.log(`WebSocket reconnected after ${attemptNumber} attempts`);
			setConnectionStatus('connected');
		});

		socket.on('reconnect_attempt', (attemptNumber) => {
			console.log(`WebSocket reconnection attempt ${attemptNumber}`);
			setConnectionStatus('connecting');
		});

		socket.on('reconnect_error', (error) => {
			console.error('WebSocket reconnection error:', error);
			setConnectionStatus('error');
		});

		socket.on('reconnect_failed', () => {
			console.error('WebSocket reconnection failed');
			setConnectionStatus('error');
		});

		socketRef.current = socket;
		console.log('CONNNNNNECTEDD socket', socket);
		return () => {
			if (socket.connected) {
				socket.disconnect();
			}
			socketRef.current = null;
		};
	}, []);

	return {
		socket: socketRef.current,
		connectionStatus
	};
};
