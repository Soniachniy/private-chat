import type { OAuth2Provider, SessionUser } from '@/types';
import { TEMP_API_BASE_URL } from './constants';
class AuthClient {
	private baseURL: string;

	constructor(baseURL: string = TEMP_API_BASE_URL) {
		this.baseURL = `${baseURL}/api/v1`;
	}

	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		try {
			const response = await fetch(`${this.baseURL}${endpoint}`, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				}
			});

			if (!response.ok) {
				const error = await response.json();
				throw error;
			}

			return await response.json();
		} catch (err) {
			console.error(err);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			throw (err as any)?.detail || err || 'An unknown error occurred';
		}
	}

	async getSessionUser(): Promise<SessionUser> {
		const token = localStorage.getItem('token');

		if (!token) {
			throw new Error('No token found');
		}
		return this.request<SessionUser>('/auths/', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	}

	async signIn(email: string, password: string) {
		return this.request('/auths/signin', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password
			})
		});
	}

	async signUp(name: string, email: string, password: string, profile_image_url: string) {
		return this.request('/auths/signup', {
			method: 'POST',
			body: JSON.stringify({
				name,
				email,
				password,
				profile_image_url
			})
		});
	}

	async signOut(): Promise<void> {
		await fetch(`${this.baseURL}/auths/signout`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(async (res) => {
				if (!res.ok) throw await res.json();
			})
			.catch((err) => {
				console.error(err);
				throw err.detail || err;
			});
	}

	async updateProfile(token: string, name: string, profileImageUrl: string) {
		return this.request('/auths/update/profile', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				name,
				profile_image_url: profileImageUrl
			})
		});
	}

	async updatePassword(token: string, password: string, newPassword: string) {
		return this.request('/auths/update/password', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				password,
				new_password: newPassword
			})
		});
	}

	oauth2SignIn(provider: OAuth2Provider) {
		window.location.href = `${this.baseURL}/oauth/${provider}/login`;
	}
}

export const authClient = new AuthClient();
