import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getTimeRange = (timestamp: number | string) => {
	const now = new Date();
	const date = new Date(Number(timestamp) * 1000); // Convert Unix timestamp to milliseconds

	// Calculate the difference in milliseconds
	const diffTime = now.getTime() - date.getTime();
	const diffDays = diffTime / (1000 * 3600 * 24);

	const nowDate = now.getDate();
	const nowMonth = now.getMonth();
	const nowYear = now.getFullYear();

	const dateDate = date.getDate();
	const dateMonth = date.getMonth();
	const dateYear = date.getFullYear();

	if (nowYear === dateYear && nowMonth === dateMonth && nowDate === dateDate) {
		return 'Today';
	} else if (nowYear === dateYear && nowMonth === dateMonth && nowDate - dateDate === 1) {
		return 'Yesterday';
	} else if (diffDays <= 7) {
		return 'Previous 7 days';
	} else if (diffDays <= 30) {
		return 'Previous 30 days';
	} else if (nowYear === dateYear) {
		return date.toLocaleString('default', { month: 'long' });
	} else {
		return date.getFullYear().toString();
	}
};
