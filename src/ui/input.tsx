import { useId } from 'react';
import { CircleX, Info } from 'lucide-react';

import { cn } from '@utils';

type InputProps = React.ComponentProps<'input'> & {
	label?: string;
	wrapperClassName?: string;
	message?: string;
	messageType?: 'error' | 'info';
};

const Input = ({
	label,
	required,
	wrapperClassName,
	className,
	id,
	type,
	message,
	messageType = 'info',
	...props
}: InputProps) => {
	const generatedId = useId();

	if (type === 'checkbox') {
		return (
			<div className={cn('flex items-center gap-2', wrapperClassName)}>
				<input
					id={id ?? generatedId}
					className={cn(
						'rounded p-2 accent-neutral-900 focus-visible:border-neutral-900',
						className
					)}
					required={required}
					type={type}
					{...props}
				/>
				{label && (
					<label htmlFor={id ?? generatedId} className="inline-block text-sm">
						{label} {required && <span className="text-xs text-red-500">*</span>}
					</label>
				)}
			</div>
		);
	}

	return (
		<div className={cn('flex grow flex-col gap-2', wrapperClassName)}>
			{label && (
				<label htmlFor={id ?? generatedId} className="inline-block text-sm">
					{label} {required && <span className="text-xs text-red-500">*</span>}
				</label>
			)}
			<div className="flex flex-col gap-1.5">
				<input
					id={id ?? generatedId}
					className={cn(
						'w-full rounded border border-neutral-300 bg-neutral-50 p-2 text-sm placeholder:text-neutral-400 focus-visible:border-neutral-900',
						className
					)}
					required={required}
					type={type}
					{...props}
					onWheel={(event) => {
						// Prevent the input value change
						(event.target as HTMLInputElement).blur();

						// Prevent the page/container scrolling
						event.stopPropagation();

						// Refocus immediately, on the next tick (after the current
						setTimeout(() => {
							(event.target as HTMLInputElement).focus();
						}, 0);
					}}
				/>
				{message && (
					<p
						className={cn('flex items-center gap-1 text-sm', {
							'text-red-400': messageType === 'error',
							'text-blue-500': messageType === 'info'
						})}
					>
						{messageType === 'error' ? <CircleX size={18} /> : <Info size={18} />}
						<span>{message}</span>
					</p>
				)}
			</div>
		</div>
	);
};

export default Input;
