import React from 'react';
import LeftSidebar from './LeftSidebar';
import ChatVerifier from '../chat/ChatVerifier';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="flex flex-row h-screen w-full">
			<LeftSidebar />
			<div className="w-full flex-1 relative">{children}</div>
			<ChatVerifier />
		</div>
	);
};

export default Layout;
