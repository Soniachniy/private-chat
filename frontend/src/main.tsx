import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { initI18n } from './i18n';
import ThemeProvider from './components/common/ThemeProvider';

// Initialize i18n asynchronously
initI18n(localStorage?.locale);

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 10 // 10 minutes
		}
	}
});

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<ThemeProvider>
					<App />
				</ThemeProvider>
			</BrowserRouter>
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	</React.StrictMode>
);
