import React, { useMemo, useState } from 'react';
import i18n from 'i18next';

import { useUserStore } from '../../stores/useUserStore';
import UserIcon from '@/assets/icons/user-icon.png';
import NearAIIcon from '@/assets/icons/near-icon-green.svg?react';
import CloseIcon from '@/assets/icons/close-icon.svg?react';
import PencilIcon from '@/assets/icons/pencil-icon.svg?react';
import SettingsIcon from '@/assets/icons/settings-icon.svg?react';
import ArchiveIcon from '@/assets/icons/archive-icon.svg?react';
import SignOutIcon from '@/assets/icons/sign-out-icon.svg?react';
import ChatArrowDown from '@/assets/icons/chat-arrow-down.svg?react';
import EllipsisHorizontal from '@/assets/icons/ellipsis-horizontal.svg?react';
import Bookmark from '@heroicons/react/24/outline/BookmarkIcon';
import Pencil from '@heroicons/react/24/outline/PencilIcon';
import Clone from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import Archive from '@heroicons/react/24/outline/ArchiveBoxIcon';
import Download from '@heroicons/react/24/outline/ArrowDownTrayIcon';
import Trash from '@heroicons/react/24/outline/TrashIcon';

import { useViewStore } from '@/stores/useViewStore';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useChatStore } from '@/stores/useChatStore';
import { cn, getTimeRange } from '@/lib/utils';
import SettingsDialog from '@/components/common/dialogs/settings/SettingsDialog';
import { useTranslation } from 'react-i18next';
import ArchivedChatsModal from '@/components/common/dialogs/archived-chats/ArchivedChatsModal';
import type { ChatInfo } from '@/types';

export const DropdownType = { Item: 'Item', Separator: 'Separator' } as const;

const chatDropdownItems = [
	{ title: i18n.t('Pin'), icon: <Bookmark stroke="white" />, type: DropdownType.Item },
	{ title: i18n.t('Rename'), icon: <Pencil stroke="white" />, type: DropdownType.Item },
	{ title: i18n.t('Clone'), icon: <Clone stroke="white" />, type: DropdownType.Item },
	{ title: i18n.t('Archive'), icon: <Archive stroke="white" />, type: DropdownType.Item },
	{ title: i18n.t('Download'), icon: <Download stroke="white" />, type: DropdownType.Item },
	{ title: i18n.t('Delete'), icon: <Trash stroke="white" />, type: DropdownType.Item }
];

const LeftSidebar: React.FC = () => {
	const { t } = useTranslation("translation", { useSuspense: false });
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isArchivedChatsOpen, setIsArchivedChatsOpen] = useState(false);
	const { isLeftSidebarOpen, setIsLeftSidebarOpen } = useViewStore();
	const { user } = useUserStore();
	const { chats, currentChat } = useChatStore();

	const chatsGroupedByFolder = useMemo(
		() =>
			Object.entries(
				chats?.reduce(
					(acc, chat) => {
						const timeRange = getTimeRange(chat.updated_at);
						acc[timeRange] = [...(acc[timeRange] || []), chat];
						return acc;
					},
					{} as Record<string, ChatInfo[]>
				)
			),
		[chats]
	);

	const [isChatsOpen, setIsChatsOpen] = useState(true);

	const dropdownItems = useMemo(() => [
		{ title: t('Settings'), icon: <SettingsIcon />, type: DropdownType.Item, action: () => setIsSettingsOpen(true) },
		{ title: t('Archived Chats'), icon: <ArchiveIcon />, type: DropdownType.Item, action: () => setIsArchivedChatsOpen(true) },
		{ type: DropdownType.Separator },
		//TODO: add sign out action
		{ title: t('Sign Out'), icon: <SignOutIcon />, type: DropdownType.Item, action: () => {} }
	], [t]);

	return (
		<>
			<nav className="shrink-0 text-sm z-50 top-0 left-0 overflow-x-hidden transition-width duration-200 ease-in-out">
				<div
					id="sidebar"
					className={cn(
						'h-screen max-h-[100dvh] min-h-screen fixed select-none', 
						isLeftSidebarOpen ? 'md:relative w-[260px] max-w-[260px]' : '-translate-x-[260px] w-[0px]',
						'transition-width duration-200 ease-in-out shrink-0 bg-gray-900 text-gray-900 dark:bg-gray-900 dark:text-gray-200 text-sm fixed z-50 top-0 left-0 overflow-x-hidden'
					)}
				>
						<div
							id="sidebar"
							className={`h-screen max-h-[100dvh] min-h-screen select-none ${
								isLeftSidebarOpen ? 'md:relative w-[260px] max-w-[260px]' : '-translate-x-[260px] w-[0px]'
							}' transition-width duration-200 ease-in-out shrink-0 bg-gray-900 text-gray-900 dark:bg-gray-900 dark:text-gray-200 text-sm fixed z-50 top-0 left-0 overflow-x-hidden
					`}
						>
							<div
								className={`py-2 my-auto flex flex-col justify-between h-screen max-h-[100dvh] w-[260px] overflow-x-hidden z-50 ${
									isLeftSidebarOpen ? '' : 'invisible'
								}`}
							>
								{/* Top section */}
								<div className="flex flex-col items-center justify-between  px-2">
									<div className="flex w-full justify-between my-4 px-2">
										<button
											type="button"
											className="h-8 w-8 cursor-pointer shadow rounded flex items-center justify-center hover:bg-gray-850 dark:bg-[rgba(248,248,248,0.04)]"
										>
											<NearAIIcon className="w-4 h-4" />
										</button>
										<button
											type="button"
											className="text-white shadow dark:hover:text-gray-300 hover:bg-gray-850 h-8 w-8 rounded flex items-center justify-center dark:bg-[rgba(248,248,248,0.04)] transition-colors"
											onClick={() => setIsLeftSidebarOpen(false)}
										>
											<CloseIcon />
										</button>
									</div>
									<div className="w-full">
										<div className="flex justify-center mb-5 space-x-1 text-gray-600 dark:text-white h-9 items-center">
											<a
												id="sidebar-new-chat-button"
												className="flex justify-center items-center flex-1 gap-x-2 rounded-lg px-2 py-1 h-full text-right transition no-drag-region text-white bg-[#F8F8F80A] hover:bg-gray-850"
												href="/"
												draggable="false"
											>
												<div className="flex items-center">
													<div className=" self-center font-medium text-sm font-primary">
														{t('New Chat')}
													</div>
												</div>
												<div>
													<PencilIcon fill={'#000'} />
												</div>
											</a>
										</div>
									</div>
									<div className="w-full cursor-pointer" onClick={() => setIsChatsOpen(!isChatsOpen)}>
										<div>
											<div className="flex items-start justify-between">
												<div className="w-full group rounded-md relative flex items-center justify-between  text-gray-500  transition">
													<button className="w-full py-1.5 pl-2 flex items-center gap-1.5 text-xs font-medium">
														<div className="text-gray-300 dark:text-gray-600 size-3">
															<ChatArrowDown
																stroke="#676767"
																className={!isChatsOpen ? 'rotate-270 ' : ''}
															/>
														</div>
														<div className="translate-y-[0.5px]">{t('Chats')}</div>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="flex flex-col  w-full justify-between rounded-lg  py-[6px]  group-hover:bg-gray-100 dark:group-hover:bg-gray-950 whitespace-nowrap text-ellipsis">
									{isChatsOpen &&
										chatsGroupedByFolder.map(([timeRange, chats], index) => (
											<div>
												<div
													className={cn(
														'w-full 5 text-xs text-gray-500 pl-2.5 dark:text-gray-500 font-medium  pb-1.5',
														index !== 0 && 'pt-5'
													)}
												>
													{timeRange}
												</div>
												{currentChat &&
													chats.map((chat) => (
														<div className="w-full  relative group" key={chat.id} draggable="true">
															<a
																className={
																	`w-full flex justify-between rounded-lg px-[11px] py-[6px] whitespace-nowrap text-ellipsis` +
																	(chat.id === currentChat.id ? ' bg-[#00ec9714]' : '')
																}
																href={`/c/${chat.id}`}
																draggable="false"
															>
																<div className="flex self-center flex-1 w-full">
																	<div
																		dir="auto"
																		className="text-left self-center text-white overflow-hidden w-full h-[20px]"
																	>
																		{chat.title}
																	</div>
																</div>
																<DropdownMenu>
																	<DropdownMenuTrigger>
																		<EllipsisHorizontal
																			className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
																			fill="white"
																			stroke="white"
																		/>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent
																		className="w-full bg-gray-875 min-w-[240px] outline-none ring-none border-none"
																		loop
																	>
																		{chatDropdownItems.map((item) => (
																			<DropdownMenuItem className="flex flex-row gap-2 py-2 px-3 hover:bg-gray-800 focus:bg-gray-800 focus:text-white hover:text-white text-white">
																				{item.icon} {item.title}
																			</DropdownMenuItem>
																		))}
																	</DropdownMenuContent>
																</DropdownMenu>
															</a>
														</div>
													))}
											</div>
										))}
								</div>

								{/* Bottom section */}
								<div className="px-2">
									<DropdownMenu>
										<DropdownMenuTrigger className="flex items-center outline-none ring-none rounded-xl py-2.5 px-2.5 w-full transition">
											<>
												<div className="self-center mr-3">
													<img
														src={UserIcon}
														alt="User"
														className=" max-w-[30px] object-cover rounded-full"
													/>
												</div>
												<div className="self-center font-medium text-white">{user?.name}</div>
											</>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											className="w-full bg-gray-875 min-w-[240px] outline-none ring-none border-none"
											loop
											side="top"
										>
											{dropdownItems.map((el, index) => (
												<React.Fragment key={el.type + index}>
													{el.type === DropdownType.Separator && <DropdownMenuSeparator className="border-gray-100 bg-gray-850" />}
													{el.type === DropdownType.Item && (
														<DropdownMenuItem className="flex flex-row gap-2 py-2 px-3 hover:bg-gray-800 focus:bg-gray-800 text-white" onClick={el.action}>
															{el.icon} {el.title}
														</DropdownMenuItem>
													)}
												</React.Fragment>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						</div>
					</div>
				</nav>

			<SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
			<ArchivedChatsModal open={isArchivedChatsOpen} onOpenChange={setIsArchivedChatsOpen} />
		</>
	);
};

export default LeftSidebar;
