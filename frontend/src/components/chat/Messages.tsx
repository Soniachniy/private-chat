import React from 'react';
import type { Message } from '../../types';
import NearAIIcon from '@/assets/icons/near-icon-green.svg?react';

interface MessagesProps {
	messages: Message[];
	isLoading?: boolean;
}

const Messages: React.FC<MessagesProps> = ({ messages, isLoading = false }) => {
	return (
		<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
			{messages.length === 0 && !isLoading ? (
				<div className="flex items-end justify-center h-full">
					<div className="flex flex-col justify-center gap-3 items-center sm:gap-3.5 w-fit px-5 max-w-2xl">
						<h1 className="text-3xl sm:text-3xl flex gap-2 text-white items-center">
							<NearAIIcon className="h-6" /> AI
						</h1>
					</div>
				</div>
			) : (
				messages.map((message) => (
					<div key={message.id} className="group flex space-x-3">
						{/* Avatar */}
						<div className="flex-shrink-0">
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
									message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
								}`}
							>
								{message.role === 'user' ? 'U' : 'AI'}
							</div>
						</div>

						{/* Message Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-center space-x-2 mb-1">
								<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
									{message.role === 'user' ? 'You' : 'Assistant'}
								</span>
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{new Date(message.timestamp).toLocaleTimeString()}
								</span>
							</div>
							<div
								className="markdown-prose text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
								dangerouslySetInnerHTML={{
									__html: message.content.replace(/\n/g, '<br>')
								}}
							/>
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
				))
			)}

			{isLoading && (
				<div className="flex space-x-3">
					<div className="flex-shrink-0">
						<div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-medium text-white">
							AI
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
	);
};

export default Messages;
