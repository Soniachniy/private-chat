import React, { useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

interface ThemeProviderProps {
	children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const { settings } = useSettingsStore();

	useEffect(() => {
		const root = document.documentElement;

		// Remove existing theme classes
		root.classList.remove('light', 'dark');

		// Add the current theme class
		root.classList.add(settings.theme);

		// Force override system dark mode by setting color-scheme
		if (settings.theme === 'dark') {
			root.style.colorScheme = 'dark';
		} else {
			root.style.colorScheme = 'light';
		}
	}, [settings.theme]);

	return <>{children}</>;
};

export default ThemeProvider;
