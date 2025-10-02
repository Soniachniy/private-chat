export interface SessionUser {
	id: string;
	name: string;
	email: string;
	role: 'user' | 'admin';
	profile_image_url?: string;
	permissions?: {
		chat?: {
			temporary?: boolean;
			temporary_enforced?: boolean;
		};
	};
}

export interface ChatInfo {
	id: string;
	content: string;
	title: string;
	created_at: number;
	updated_at: string;
}

export interface Chat {
	id: string;
	user_id: string;
	title: string;
	chat: {
		id: string;
		title: string;
		models: string[];
		params: object;
		history: {
			messages: Record<string, Message>;
			currentId: string;
		};
		messages: Message[];
		tags: string[];
		timestamp: number;
		files: File[];
	};
	updated_at: number;
	created_at: number;
	share_id: string | null;
	archived: false;
	pinned: boolean;
	meta: object;
	folder_id: string | null;
}

export interface Message {
	id: string;
	parentId: null;
	childrenIds: string[];
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp: number;
	models: string[];
	modelName: string;
	chatCompletionId?: string;
	done?: boolean;
	model?: string;
}

export interface ChatHistory {
	messages: Record<string, Message>;
	currentId: string | null;
}

// OpenAI API types
export interface ChatCompletionRequest {
	model: string;
	messages: Array<{
		role: 'user' | 'assistant' | 'system';
		content: string;
	}>;
	stream?: boolean;
	temperature?: number;
	max_tokens?: number;
	top_p?: number;
	frequency_penalty?: number;
	presence_penalty?: number;
}

export interface ChatCompletionResponse {
	id: string;
	object: 'chat.completion';
	created: number;
	model: string;
	choices: Array<{
		index: number;
		message: {
			role: 'assistant';
			content: string;
		};
		finish_reason: string;
	}>;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

export interface ChatCompletionStreamResponse {
	id: string;
	object: 'chat.completion.chunk';
	created: number;
	model: string;
	choices: Array<{
		index: number;
		delta: {
			role?: 'assistant';
			content?: string;
		};
		finish_reason?: string;
	}>;
}

// Model types
export interface Model {
	id: string;
	object: string;
	created: number;
	owned_by: string;
	name: string;
	openai?: {
		id: string;
		object: string;
		created: number;
		owned_by: string;
	};
	urlIdx?: number;
	info?: {
		id: string;
		user_id: string;
		base_model_id: string | null;
		name: string;
		params: Record<string, unknown>;
		meta: {
			profile_image_url?: string;
			description?: string;
			[key: string]: unknown;
		};
	};
}

// Settings types
export interface Settings {
	theme: 'light' | 'dark' | 'system';
	notificationEnabled: boolean;
	showChangelog: boolean;
	version: string;
	directConnections?: unknown;
	toolServers?: unknown[];
	// MessageInput specific settings
	imageCompression?: boolean;
	imageCompressionSize?: {
		width?: number;
		height?: number;
	};
	widescreenMode?: boolean;
	chatDirection?: 'ltr' | 'rtl' | 'auto';
	richTextInput?: boolean;
	ctrlEnterToSend?: boolean;
	largeTextAsFile?: boolean;
	chatBubble?: boolean;
}

// Config types
export interface Config {
	name: string;
	version: string;
	features: {
		enable_websocket?: boolean;
		enable_direct_connections?: boolean;
	};
	default_locale?: string;
}

// Banner types
export interface Banner {
	id: string;
	type: 'info' | 'warning' | 'error';
	content: string;
	dismissible: boolean;
}

// Folder types
export interface Folder {
	id: string;
	name: string;
	parent_id?: string;
	user_id: string;
	created_at: number;
	updated_at: number;
}

// Tag types
export interface Tag {
	name: string;
	count: number;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
	data?: T;
	error?: string;
	message?: string;
}

// Store types
export interface UserStore {
	user: SessionUser | null;
	setUser: (user: SessionUser | null) => void;
}

export interface ViewStore {
	isMobile: boolean;
	setIsMobile: (isMobile: boolean) => void;
	isLeftSidebarOpen: boolean;
	setIsLeftSidebarOpen: (isOpen: boolean) => void;
	isRightSidebarOpen: boolean;
	setIsRightSidebarOpen: (isOpen: boolean) => void;
}

export interface ChatStore {
	chats: ChatInfo[];
	currentChat: Chat | null;
	isLoading: boolean;
	models: Model[];
	selectedModels: string[];
	setChats: (chats: ChatInfo[]) => void;
	setCurrentChat: (chat: Chat | null) => void;
	setModels: (models: Model[]) => void;
	addChat: (chat: ChatInfo) => void;
	updateChat: (id: string, chat: Partial<ChatInfo>) => void;
	deleteChat: (id: string) => void;
	setLoading: (loading: boolean) => void;
	setSelectedModels: (models: string[]) => void;
}

export interface SettingsStore {
	settings: Settings;
	setSettings: (settings: Partial<Settings>) => void;
}

// Chat History types
export interface ChatHistory {
	messages: Record<string, Message>;
	currentId: string | null;
}

// File types
export interface File {
	id: string;
	name: string;
	size: number;
	type: string;
	url?: string;
	content?: string;
}
