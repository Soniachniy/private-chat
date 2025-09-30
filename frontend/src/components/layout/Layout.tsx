import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { useViewStore } from '@/stores/useViewStore';
import { cn } from '@/lib/utils';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [showRight, setShowRight] = React.useState(false);
	const { isLeftSidebarOpen, isMobile } = useViewStore();

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
				<RightSidebar
					show={showRight}
					width="320px"
					onClose={() => setShowRight(false)}
					className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200"
				>
					<div className="h-full flex flex-col">
						<div className="p-3 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
							<div className="text-sm font-medium">Details</div>
							<button
								onClick={() => setShowRight(false)}
								className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
							>
								<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
									<path
										fillRule="evenodd"
										d="M10 8.586L3.707 2.293 2.293 3.707 8.586 10l-6.293 6.293 1.414 1.414L10 11.414l6.293 6.293 1.414-1.414L11.414 10l6.293-6.293-1.414-1.414L10 8.586z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
						<div className="flex-1 overflow-y-auto p-3">
							{/* Right sidebar content goes here */}
						</div>
					</div>
				</RightSidebar>
			</div>
		</div>
	);
};

export default Layout;
