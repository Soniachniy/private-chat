import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import LoadingScreen from './components/common/LoadingScreen';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';

import { useAppInitialization } from './stores/useAppInitialization';
import { useChats } from './hooks/useChat';

function App() {
	const { isInitialized, isLoading: isAppLoading, initializeApp } = useAppInitialization();

	// Load chats
	useChats();

	useEffect(() => {
		initializeApp();
	}, [initializeApp]);

	if (!isInitialized || isAppLoading) {
		return <LoadingScreen />;
	}

	return (
		<div className="app relative bg-gray-900">
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
