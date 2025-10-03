import React, { useCallback, useEffect, useState } from 'react';
import NearAIIcon from '@/assets/icons/near-icon-green.svg?react';
import Bolt from '@heroicons/react/24/outline/BoltIcon';
import HeadsetIcon from '@/assets/icons/headset.svg?react';

import Fuse from 'fuse.js';

import { allPrompts } from '@/pages/welcome/data';

interface Prompt {
	title: string[];
	content: string;
}

interface ChatPlaceholderProps {
	submitPrompt: (value: string) => void;
	submitVoice: (value: string) => void;
}

const ChatPlaceholder: React.FC<ChatPlaceholderProps> = ({ submitPrompt, submitVoice }) => {
	const [inputValue, setInputValue] = useState('');
	const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);

	const handlePromptClick = (content: string) => {
		setInputValue(content);
	};
	const handleSubmit = (value: string) => {
		submitPrompt(value);
		setInputValue('');
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		const enterPressed = e.key === 'Enter' || e.keyCode === 13;
		if (enterPressed && inputValue) {
			submitPrompt(inputValue);
			setInputValue('');
		}
	};

	const getFilteredPrompts = useCallback(
		(inputValue: string) => {
			const sortedPrompts = [...(allPrompts ?? [])].sort(() => Math.random() - 0.5);
			if (inputValue.length > 500) {
				setFilteredPrompts([]);
			} else {
				const fuse = new Fuse(sortedPrompts, {
					keys: ['content', 'title'],
					threshold: 0.5
				});

				const newFilteredPrompts =
					inputValue.trim() && fuse
						? fuse.search(inputValue.trim()).map((result) => result.item)
						: sortedPrompts;

				if (filteredPrompts.length !== newFilteredPrompts.length) {
					setFilteredPrompts(newFilteredPrompts);
				}
			}
		},
		[filteredPrompts]
	);

	useEffect(() => {
		getFilteredPrompts(inputValue);
	}, [inputValue, getFilteredPrompts]);

	return (
		<div className="w-full h-full flex flex-col">
			<div className="m-auto w-full max-w-6xl px-2 2xl:px-20 translate-y-6 py-24 text-center">
				<div className="w-full text-3xl text-gray-800 dark:text-gray-100 text-center flex items-center gap-4 font-primary">
					<div className="w-full flex flex-col justify-center items-center">
						{/* Title */}
						<div className="flex flex-col justify-center gap-3 items-center sm:gap-3.5 w-fit px-2 pb-3 max-w-2xl">
							<h1 className="text-3xl text-white sm:text-3xl flex gap-2 items-center">
								<NearAIIcon className="h-6" /> AI
							</h1>
							<p className="text-base text-white dark:text-gray-300">
								Chat with your personal assistant without worrying about leaking private
								information.
							</p>
						</div>

						{/* Input */}
						<div className="text-base font-normal md:max-w-3xl w-full py-3">
							<div className="w-full font-primary dark:bg-gray-900 px-2.5 mx-auto inset-x-0">
								<div className="flex-1 flex flex-col app-chat-input relative w-full shadow-lg rounded-3xl border border-gray-50 dark:border-gray-850 hover:border-gray-100 focus-within:border-gray-100 hover:dark:border-gray-800 focus-within:dark:border-gray-800 transition px-1 bg-white/90 dark:bg-gray-400/5 dark:text-gray-100">
									<div className="px-2.5">
										<div className="scrollbar-hidden rtl:text-right ltr:text-left bg-transparent dark:text-gray-100 outline-hidden w-full pt-2.5 pb-[5px] px-1 resize-none h-fit max-h-80 overflow-auto">
											<textarea
												className="scrollbar-hidden bg-transparent placeholder:text-gray-400  outline-hidden w-full pt-3 px-1 resize-none"
												placeholder="How can I help you today?"
												rows={1}
												value={inputValue}
												onChange={(e) => setInputValue(e.target.value)}
												onKeyDown={handleKeyDown}
											/>
										</div>
										<div className="flex justify-between mt-0.5 mb-2.5 mx-0.5 max-w-full" dir="ltr">
											<div className="ml-1 self-end flex items-center flex-1 max-w-[80%]">
												{/* Input menu placeholder */}
											</div>

											<div className="self-end flex space-x-1 mr-1 shrink-0">
												{inputValue === '' ? (
													<div className="flex items-center">
														<button
															className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition rounded-full p-1.5 self-center"
															type="button"
															onClick={() => submitVoice('')}
															aria-label="Voice mode"
														>
															<HeadsetIcon className="w-5 h-5" />
														</button>
													</div>
												) : (
													<div className="flex items-center">
														<button
															className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition rounded-full p-1.5 self-center"
															type="button"
															onClick={() => handleSubmit(inputValue)}
															aria-label="Send message"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 16 16"
																fill="currentColor"
																className="w-5 h-5"
															>
																<path
																	fillRule="evenodd"
																	d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z"
																	clipRule="evenodd"
																/>
															</svg>
														</button>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Suggestions */}
						<div className="mx-auto max-w-2xl w-full font-primary mt-2">
							<div className="mx-5">
								<div className="mb-1 flex gap-1 text-xs font-medium items-center text-gray-400 dark:text-gray-400">
									<Bolt className="w-4 h-4" />
									Suggested
								</div>
								<div className="h-40 w-full">
									<div role="list" className="max-h-40 overflow-auto scrollbar-none items-start">
										{filteredPrompts.map((prompt, idx) => (
											<button
												key={prompt.content}
												role="listitem"
												className="waterfall flex flex-col flex-1 shrink-0 w-full justify-between px-3 py-2 rounded-xl bg-transparent hover:bg-black/5 text-base font-normal dark:hover:bg-white/5 transition group"
												style={{ animationDelay: `${idx * 60}ms` }}
												onClick={() => handlePromptClick(prompt.content)}
											>
												<div className="flex flex-col text-left">
													{prompt.title && prompt.title[0] !== '' ? (
														<>
															<div className="font-medium text-white dark:text-gray-300 dark:group-hover:text-gray-200 transition line-clamp-1">
																{prompt.title[0]}
															</div>
															<div className="text-xs text-gray-400 dark:text-gray-400 font-normal line-clamp-1">
																{prompt.title[1]}
															</div>
														</>
													) : (
														<>
															<div className="font-medium dark:text-gray-300 dark:group-hover:text-gray-200 transition line-clamp-1">
																{prompt.content}
															</div>
															<div className="text-xs text-gray-600 dark:text-gray-400 font-normal line-clamp-1">
																Prompt
															</div>
														</>
													)}
												</div>
											</button>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatPlaceholder;
