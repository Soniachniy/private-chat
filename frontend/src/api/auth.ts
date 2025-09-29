const WEBUI_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface User {
	id: string;
	name: string;
	email: string;
	profile_image_url?: string;
	token?: string;
}

export interface AuthResponse {
	user: User;
	token?: string;
}

export const userSignIn = async (email: string, password: string): Promise<AuthResponse> => {
	const res = await fetch(`${WEBUI_API_BASE_URL}/auths/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			email,
			password
		})
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.detail || 'Sign in failed');
	}

	return res.json();
};

export const userSignUp = async (
	name: string,
	email: string,
	password: string,
	profile_image_url: string
): Promise<AuthResponse> => {
	const res = await fetch(`${WEBUI_API_BASE_URL}/auths/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			name,
			email,
			password,
			profile_image_url
		})
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.detail || 'Sign up failed');
	}

	return res.json();
};

export const ldapUserSignIn = async (username: string, password: string): Promise<AuthResponse> => {
	const res = await fetch(`${WEBUI_API_BASE_URL}/auths/ldap`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			user: username,
			password
		})
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.detail || 'LDAP authentication failed');
	}

	return res.json();
};

export const getSessionUser = async (token: string): Promise<User> => {
	const res = await fetch(`${WEBUI_API_BASE_URL}/auths/session`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.detail || 'Failed to get session user');
	}

	return res.json();
};

export const getBackendConfig = async () => {
	const res = await fetch(`${WEBUI_API_BASE_URL}/configs`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error('Failed to get backend config');
	}

	return res.json();
};
