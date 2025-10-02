import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import LoadingScreen from './components/common/LoadingScreen';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';

import { useAppInitialization } from './stores/useAppInitialization';

import { useSettingsStore } from './stores/useSettingsStore';

function App() {
	const { isInitialized, isLoading: isAppLoading, initializeApp } = useAppInitialization();
	const { settings } = useSettingsStore();

	useEffect(() => {
		initializeApp();
	}, [initializeApp]);

	if (!isInitialized || isAppLoading) {
		return <LoadingScreen />;
	}

	// Determine theme for Toaster
	const getToasterTheme = () => {
		if (settings.theme?.includes('dark')) {
			return 'dark';
		}
		if (settings.theme === 'system') {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return 'light';
	};

	return (
		<div className="app relative bg-gray-900">
			<Toaster theme={getToasterTheme()} richColors position="top-right" />
			<Routes>
				<Route
					path="/"
					element={
						<Layout>
							<Home />
						</Layout>
					}
				/>
				<Route
					path="/c/:chatId"
					element={
						<Layout>
							<Home />
						</Layout>
					}
				/>

				<Route path="/welcome" element={<WelcomePage />} />
				<Route path="/auth" element={<AuthPage />} />
			</Routes>
		</div>
	);
}

export default App;
