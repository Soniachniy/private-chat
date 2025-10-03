import { useEffect, useRef, useCallback } from 'react';

import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../stores/useChatStore';
import { TEMP_API_BASE_URL } from '../api/constants';

interface ChatEventData {
	chat_id: string;
	message_id: string;
	data: {
		type: 'status' | 'message' | 'replace' | 'error';
		content?: string;
		description?: string;
		done?: boolean;
	};
}

export const useChatWebSocket = () => {
	const socketRef = useRef<Socket | null>(null);
	const { updateMessage, appendToMessage, setStreamingMessage } = useChatStore();

	// Initialize WebSocket connection
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) return;

		const socket = io(TEMP_API_BASE_URL, {
			path: '/ws/socket.io',
			auth: { token },
			transports: ['websocket', 'polling']
		});

		socket.on('connect', () => {
			console.log('WebSocket connected');
		});

		socket.on('chat-events', (data: ChatEventData) => {
			handleChatEvent(data);
		});

		socket.on('disconnect', () => {
			console.log('WebSocket disconnected');
		});

		socketRef.current = socket;

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleChatEvent = useCallback(
		(data: ChatEventData) => {
			const { message_id, data: eventData } = data;

			switch (eventData.type) {
				case 'status':
					updateMessage(message_id, {
						...eventData
					});
					break;

				case 'message':
					if (eventData.content) {
						appendToMessage(message_id, eventData.content);
					}
					break;

				case 'replace':
					if (eventData.content) {
						updateMessage(message_id, {
							content: eventData.content
						});
					}
					break;

				case 'error':
					updateMessage(message_id, {
						content: eventData.description || 'An error occurred',
						done: true
					});
					break;

				default:
					if (eventData.done) {
						updateMessage(message_id, {
							done: true
						});
						setStreamingMessage(null);
					}
					break;
			}
		},
		[updateMessage, appendToMessage, setStreamingMessage]
	);

	return {
		socket: socketRef.current
	};
};
