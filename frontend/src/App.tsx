import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import LoadingScreen from './components/common/LoadingScreen';

import { useAppInitialization } from './stores/useAppInitialization';
import { useChats } from './hooks/useChat';

function App() {
	const { isInitialized, isLoading: isAppLoading, initializeApp } = useAppInitialization();

	// Load chats
	useChats();

	useEffect(() => {
		initializeApp();
	}, [initializeApp]);

	console.log('isInitialized', isInitialized);
	console.log('isAppLoading', isAppLoading);

	if (!isInitialized || isAppLoading) {
		return <LoadingScreen />;
	}

	return (
		<div className="app relative">
			<div className="text-gray-700 dark:text-gray-100 h-screen max-h-[100dvh] w-full overflow-auto flex flex-row stretch grow-1">
				<Layout>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/c/:chatId" element={<ChatPage />} />
					</Routes>
				</Layout>
			</div>
		</div>
	);
}

export default App;
