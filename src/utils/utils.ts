import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const getRandomInt = (min: number, max: number) => {
	const lower = Math.ceil(min);
	const upper = Math.floor(max);

	return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};
