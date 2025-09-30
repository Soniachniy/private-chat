import React from 'react';
import LeftSidebar from './LeftSidebar';

import { cn } from '@/lib/utils';

import ChatVerifier from '../chat/ChatVerifier';
import { useViewStore } from '@/stores/useViewStore';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { isMobile, isLeftSidebarOpen } = useViewStore();

	return (
		<div className="flex flex-row h-screen w-full">
			<LeftSidebar />
			<div
				className={cn(
					'w-full flex-1 relative',
					!isMobile && isLeftSidebarOpen && 'max-w-[calc(100%-260px)] ml-[260px]'
				)}
			>
				{children}
			</div>
			<ChatVerifier />
		</div>
	);
};

export default Layout;
