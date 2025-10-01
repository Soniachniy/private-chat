<script lang="ts">
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';

	import {
		WEBUI_NAME,
		banners,
		chatId,
		config,
		mobile,
		settings,
		showArchivedChats,
		showControls,
		showSidebar,
		temporaryChatEnabled,
		user
	} from '$lib/stores';

	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';

	import ShareChatModal from '../chat/ShareChatModal.svelte';
	import ModelSelector from '../chat/ModelSelector.svelte';
	import Tooltip from '../common/Tooltip.svelte';
	import Menu from '$lib/components/layout/Navbar/Menu.svelte';
	import UserMenu from '$lib/components/layout/Sidebar/UserMenu.svelte';
	import MenuLines from '../icons/MenuLines.svelte';
	import AdjustmentsHorizontal from '../icons/AdjustmentsHorizontal.svelte';
	import NearAIIcon from '$lib/components/icons/NearAIGreen.svelte';

	import PencilSquare from '../icons/PencilSquare.svelte';
	import Banner from '../common/Banner.svelte';
	import AccountButton from './AccountButton.svelte';

	const i18n = getContext('i18n');

	export let initNewChat: Function;
	export let title: string = $WEBUI_NAME;
	export let shareEnabled: boolean = false;
	export let showChatVerifier: boolean = false;

	export let chat;
	export let history;
	export let selectedModels;
	export let showModelSelector = true;

	let showShareChatModal = false;
	let showDownloadChatModal = false;

	const toggleVerifier = () => {
		showChatVerifier = !showChatVerifier;
	};
</script>

<ShareChatModal bind:show={showShareChatModal} chatId={$chatId} />

<nav class="sticky top-0 z-30 w-full py-1.5 -mb-6 fl6x flex-col items-center drag-region">
	<div class="flex items-center w-full px-1.5">
		<div
			class=" bg-linear-to-b via-50% from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent pointer-events-none absolute inset-0 -bottom-7 z-[-1]"
		></div>

		<div class=" flex max-w-full w-full mx-auto px-1 pt-1 bg-transparent">
			<div class="flex w-full max-w-full">
				<div
					class="{$showSidebar
						? 'md:hidden'
						: ''} mr-2 md:mr-4 pt-0.5 gap-y-3 self-start flex flex-col text-gray-600 dark:text-gray-400"
				>
					<Tooltip content="Expand Sidebar" autoHide={true}>
						<button
							type="button"
							class="text-white shadow h-8 w-8 cursor-pointer rounded flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-850 dark:bg-[rgba(248,248,248,0.04)]"
							on:click={() => {
								showSidebar.set(!$showSidebar);
							}}
						>
							<MenuLines className="size-5" />
						</button>
					</Tooltip>
					<Tooltip content={$i18n.t('New Chat')} autoHide={true}>
						<button
							id="new-chat-button"
							type="button"
							class="text-white shadow hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 h-8 w-8 rounded flex items-center justify-center dark:bg-[rgba(248,248,248,0.04)] transition-colors"
							on:click={() => {
								initNewChat();
							}}
							aria-label="New Chat"
						>
							<PencilSquare className="size-4.5" strokeWidth="2" />
						</button>
					</Tooltip>
				</div>

				<div
					class="flex-1 overflow-hidden max-w-full py-0.5
			{$showSidebar ? 'ml-1' : ''}
			"
				>
					{#if showModelSelector}
						<ModelSelector bind:selectedModels showSetDefault={!shareEnabled} />
					{/if}
				</div>

				<div class="self-start flex flex-none items-center text-gray-600 dark:text-gray-400">
					<!-- <div class="md:hidden flex self-center w-[1px] h-5 mx-2 bg-gray-300 dark:bg-stone-700" /> -->
					{#if shareEnabled && chat && (chat.id || $temporaryChatEnabled)}
						<Menu
							{chat}
							{shareEnabled}
							shareHandler={() => {
								showShareChatModal = !showShareChatModal;
							}}
							downloadHandler={() => {
								showDownloadChatModal = !showDownloadChatModal;
							}}
							chatVerifierHandler={toggleVerifier}
						>
							<button
								class="flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition"
								id="chat-context-menu-button"
							>
								<div class=" m-auto self-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
										/>
									</svg>
								</div>
							</button>
						</Menu>
					{/if}

					<button
						on:click={toggleVerifier}
						class="p-1.5 text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition-all duration-200
							{showChatVerifier ? 'hidden!' : ''}"
						title="Toggle Verification Panel"
					>
						<img alt="safe" src="/assets/images/safe.svg" class="w-6 h-6" />
					</button>
				</div>
			</div>
		</div>
	</div>
</nav>
