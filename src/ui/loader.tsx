import { cn } from '@utils';

type LoaderProps = {
	size?: number;
	className?: string;
};

const Loader = ({ size = 8, className }: LoaderProps) => {
	return (
		<div className={cn('loader flex justify-center gap-2', className)}>
			<div
				className="rounded-full bg-neutral-500 opacity-100"
				style={{ width: size, height: size }}
			/>
			<div
				className="rounded-full bg-neutral-500 opacity-100"
				style={{ width: size, height: size }}
			/>
			<div
				className="rounded-full bg-neutral-500 opacity-100"
				style={{ width: size, height: size }}
			/>
		</div>
	);
};

export default Loader;
