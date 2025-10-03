import { cn } from '@/lib/utils';
import React from 'react';

interface SpinnerProps {
	className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
	return <div className={cn("animate-spin rounded-full size-4 border-b-2 border-current", className)} />
};

export default Spinner;
