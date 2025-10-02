import React, { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';

import Spinner from '../components/common/Spinner';
import NearAIIcon from '@/assets/icons/near-icon-green.svg?react';
import CheckIcon from '@/assets/icons/check-icon.svg?react';
import GoogleIcon from '@/assets/icons/google-icon.svg?react';
import GitHubIcon from '@/assets/icons/github-icon.svg?react';

const WEBUI_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
const WEBUI_NAME = 'NEAR AI Private Chat';

type AuthMode = 'signin' | 'signup' | 'ldap';

interface Config {
	features?: {
		enable_login_form?: boolean;
		enable_ldap?: boolean;
		enable_signup?: boolean;
		auth_trusted_header?: boolean;
		auth?: boolean;
	};
	onboarding?: boolean;
	oauth?: {
		providers?: {
			google?: boolean;
			microsoft?: boolean;
			github?: boolean;
			oidc?: boolean;
		};
	};
}

const AuthPage: React.FC = () => {
	// const navigate = useNavigate();
	// const [searchParams] = useSearchParams();

	const [loaded] = useState(false);
	const [config] = useState<Config>({});
	const [mode, setMode] = useState<AuthMode>('signin');

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [ldapUsername, setLdapUsername] = useState('');

	const [agreedTerms, setAgreedTerms] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const TERMS_VERSION = 'V1';

	useEffect(() => {
		setAgreedTerms(localStorage.getItem('agreedTerms') === TERMS_VERSION);
		loadConfig();
		checkOAuthCallback();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const loadConfig = async () => {
		// try {
		// 	const backendConfig = await getBackendConfig();
		// 	setConfig(backendConfig);
		// 	if (backendConfig.features?.enable_ldap) {
		// 		setMode('ldap');
		// 	}
		// 	setLoaded(true);
		// } catch (error) {
		// 	console.error('Failed to load config:', error);
		// 	setLoaded(true);
		// }
	};

	const checkOAuthCallback = async () => {
		// const hash = window.location.hash.substring(1);
		// if (!hash) return;
		// const params = new URLSearchParams(hash);
		// const token = params.get('token');
		// if (!token) return;
		// try {
		// 	const sessionUser = await getSessionUser(token);
		// 	localStorage.setItem('token', token);
		// 	await handleSuccessfulAuth(sessionUser);
		// } catch (error) {
		// 	console.error('OAuth authentication failed:', error);
		// }
	};

	const checkAgreeTerms = () => {
		if (!agreedTerms) {
			alert('You must agree to the Terms of Service and Privacy Policy to proceed.');
			return false;
		}
		return true;
	};

	const signInHandler = async () => {
		// setIsLoading(true);
		// try {
		// 	const response = await userSignIn(email, password);
		// 	await handleSuccessfulAuth(response.user);
		// } catch (error: unknown) {
		// 	alert(error instanceof Error ? error.message : 'An error occurred');
		// } finally {
		// 	setIsLoading(false);
		// }
	};

	const signUpHandler = async () => {
		setIsLoading(true);
		// try {
		// 	const profileImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00EC97&color=fff`;
		// 	const response = await userSignUp(name, email, password, profileImageUrl);
		// 	await handleSuccessfulAuth(response.user);
		// } catch (error: unknown) {
		// 	alert(error instanceof Error ? error.message : 'An error occurred');
		// } finally {
		// 	setIsLoading(false);
		// }
	};

	const ldapSignInHandler = async () => {
		// setIsLoading(true);
		// try {
		// 	const response = await ldapUserSignIn(ldapUsername, password);
		// 	await handleSuccessfulAuth(response.user);
		// } catch (error: unknown) {
		// 	alert(error instanceof Error ? error.message : 'An error occurred');
		// } finally {
		// 	setIsLoading(false);
		// }
	};

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!checkAgreeTerms()) return;

		if (mode === 'ldap') {
			await ldapSignInHandler();
		} else if (mode === 'signin') {
			await signInHandler();
		} else {
			await signUpHandler();
		}
	};

	const handleOAuthLogin = (provider: string) => {
		if (!checkAgreeTerms()) return;
		window.location.href = `${WEBUI_BASE_URL}/oauth/${provider}/login`;
	};

	if (!loaded) {
		return (
			<div className="h-screen max-h-[100dvh] text-white relative">
				<div className="w-full h-full absolute top-0 left-0 bg-white dark:bg-black"></div>
				<div className="flex items-center justify-center h-full">
					<Spinner />
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-screen max-h-[100dvh] text-white relative">
			<div className="w-full h-full absolute top-0 left-0 bg-white dark:bg-black"></div>

			{/* Logo */}
			<div className="fixed m-10 z-50">
				<div className="flex space-x-2">
					<div className="self-center">
						<NearAIIcon className="w-6 h-6" />
					</div>
				</div>
			</div>

			<div className="fixed bg-transparent min-h-screen w-full flex justify-center font-primary z-50 text-black dark:text-white">
				<div className="w-full sm:max-w-md px-10 min-h-screen flex flex-col text-center">
					{/* Auto sign-in for trusted header or disabled auth */}
					{config.features?.auth_trusted_header || config.features?.auth === false ? (
						<div className="my-auto pb-10 w-full">
							<div className="flex items-center justify-center gap-3 text-xl sm:text-2xl text-center font-semibold dark:text-gray-200">
								<div>Signing in to {WEBUI_NAME}</div>
								<div>
									<Spinner />
								</div>
							</div>
						</div>
					) : (
						<div className="my-auto pb-10 w-full dark:text-gray-100">
							<form className="flex flex-col justify-center" onSubmit={submitHandler}>
								{/* Title */}
								<div className="mb-1">
									<div className="text-2xl font-medium">
										{config.onboarding
											? `Get started with ${WEBUI_NAME}`
											: mode === 'ldap'
												? `Sign in to ${WEBUI_NAME} with LDAP`
												: mode === 'signin'
													? `Sign in to ${WEBUI_NAME}`
													: `Sign up to ${WEBUI_NAME}`}
									</div>

									{config.onboarding && (
										<div className="mt-1 text-xs font-medium text-gray-500">
											ⓘ {WEBUI_NAME} does not make any external connections, and your data stays
											securely on your locally hosted server.
										</div>
									)}
								</div>

								{/* Form Fields */}
								{(config.features?.enable_login_form || config.features?.enable_ldap) && (
									<div className="flex flex-col mt-4">
										{/* Name field for signup */}
										{mode === 'signup' && (
											<div className="mb-2">
												<div className="text-sm font-medium text-left mb-1">Name</div>
												<input
													value={name}
													onChange={(e) => setName(e.target.value)}
													type="text"
													className="my-0.5 w-full text-sm outline-hidden bg-transparent border-b border-gray-300 dark:border-gray-600"
													placeholder="Enter Your Full Name"
													required
												/>
											</div>
										)}

										{/* Username field for LDAP */}
										{mode === 'ldap' ? (
											<div className="mb-2">
												<div className="text-sm font-medium text-left mb-1">Username</div>
												<input
													value={ldapUsername}
													onChange={(e) => setLdapUsername(e.target.value)}
													type="text"
													className="my-0.5 w-full text-sm outline-hidden bg-transparent border-b border-gray-300 dark:border-gray-600"
													placeholder="Enter Your Username"
													required
												/>
											</div>
										) : (
											<div className="mb-2">
												<div className="text-sm font-medium text-left mb-1">Email</div>
												<input
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													type="email"
													className="my-0.5 w-full text-sm outline-hidden bg-transparent border-b border-gray-300 dark:border-gray-600"
													placeholder="Enter Your Email"
													required
												/>
											</div>
										)}

										{/* Password field */}
										<div>
											<div className="text-sm font-medium text-left mb-1">Password</div>
											<input
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												type="password"
												className="my-0.5 w-full text-sm outline-hidden bg-transparent border-b border-gray-300 dark:border-gray-600"
												placeholder="Enter Your Password"
												required
											/>
										</div>
									</div>
								)}

								{/* Submit Button */}
								<div className="mt-5">
									{(config.features?.enable_login_form || config.features?.enable_ldap) && (
										<button
											className="bg-gray-700/5 hover:bg-gray-700/10 dark:bg-gray-750 dark:hover:bg-gray-100/10 dark:text-gray-300 dark:hover:text-white transition w-full rounded-full font-medium text-sm py-2.5"
											type="submit"
											disabled={isLoading}
										>
											{isLoading ? (
												<Spinner />
											) : mode === 'ldap' ? (
												'Authenticate'
											) : mode === 'signin' ? (
												'Sign in'
											) : config.onboarding ? (
												'Create Admin Account'
											) : (
												'Create Account'
											)}
										</button>
									)}

									{/* Toggle between signin/signup */}
									{config.features?.enable_signup && !config.onboarding && mode !== 'ldap' && (
										<div className="mt-4 text-sm text-center">
											{mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
											<button
												className="font-medium underline ml-1"
												type="button"
												onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
											>
												{mode === 'signin' ? 'Sign up' : 'Sign in'}
											</button>
										</div>
									)}
								</div>
							</form>

							{/* OAuth Providers */}

							<>
								<div className="inline-flex items-center justify-center w-full">
									<hr className="w-32 h-px my-4 border-0 dark:bg-gray-100/10 bg-gray-700/10" />
									{(config.features?.enable_login_form || config.features?.enable_ldap) && (
										<span className="px-3 text-sm font-medium text-gray-900 dark:text-white bg-transparent">
											or
										</span>
									)}
									<hr className="w-32 h-px my-4 border-0 dark:bg-gray-100/10 bg-gray-700/10" />
								</div>

								<div className="flex flex-col space-y-2">
									<button
										className="flex justify-center items-center bg-gray-700/5 hover:bg-gray-700/10 dark:bg-gray-100/5 dark:hover:bg-gray-100/10 dark:text-gray-300 dark:hover:text-white transition w-full rounded-full font-medium text-sm py-2.5"
										onClick={() => handleOAuthLogin('google')}
									>
										<GoogleIcon className="w-6 h-6 mr-3" />
										<span>Continue with Google</span>
									</button>
									<button
										className="flex justify-center items-center bg-gray-700/5 hover:bg-gray-700/10 dark:bg-gray-100/5 dark:hover:bg-gray-100/10 dark:text-gray-300 dark:hover:text-white transition w-full rounded-full font-medium text-sm py-2.5"
										onClick={() => handleOAuthLogin('github')}
									>
										<GitHubIcon className="w-6 h-6 mr-3" />
										<span>Continue with GitHub</span>
									</button>
								</div>
							</>

							{/* LDAP/Email Toggle */}
							{config.features?.enable_ldap && config.features?.enable_login_form && (
								<div className="mt-2">
									<button
										className="flex justify-center items-center text-xs w-full text-center underline"
										type="button"
										onClick={() =>
											setMode(mode === 'ldap' ? (config.onboarding ? 'signup' : 'signin') : 'ldap')
										}
									>
										<span>{mode === 'ldap' ? 'Continue with Email' : 'Continue with LDAP'}</span>
									</button>
								</div>
							)}

							{/* Terms and Privacy Checkbox */}
							<label className="text-xs  pt-10 flex items-start cursor-pointer">
								<input
									className="sr-only"
									type="checkbox"
									checked={agreedTerms}
									onChange={(e) => {
										setAgreedTerms(e.target.checked);
										localStorage.setItem('agreedTerms', e.target.checked ? TERMS_VERSION : 'false');
									}}
								/>
								<div
									className={`w-4 h-4 mt-0.5 ${agreedTerms ? 'bg-[#00EC97]' : 'bg-gray-50'} flex items-center justify-center shadow rounded`}
								>
									<CheckIcon
										className={`w-3 h-3 mt-[1px] transition-opacity ${agreedTerms ? 'opacity-100' : 'opacity-0'}`}
									/>
								</div>
								<div className="inline-block text-left ml-2 flex-1">
									{'By signing in, I agree to the '}
									<a className="underline" href="/terms">
										Terms of Service
									</a>
									{' and '}
									<a className="underline" href="/privacy">
										Privacy Policy
									</a>
									.
								</div>
							</label>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
