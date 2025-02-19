import { cn } from '@utils';

type ButtonProps = React.ComponentProps<'button'> & {
	variant?: 'primary' | 'secondary' | 'link';
};

const Button = ({ variant = 'primary', type = 'button', className, ...props }: ButtonProps) => {
	return (
		<button
			className={cn(
				'cursor-pointer rounded px-3 py-2 transition-colors focus-visible:bg-neutral-900 focus-visible:text-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed',
				{
					'border border-neutral-900 bg-neutral-900 text-neutral-50 disabled:border-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-800':
						variant === 'primary',
					'border border-neutral-900 bg-neutral-100 text-neutral-900 hover:bg-neutral-900 hover:text-white disabled:border-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-800 disabled:hover:bg-neutral-200 disabled:hover:text-neutral-800':
						variant === 'secondary',
					'border-none p-0 underline hover:bg-transparent hover:text-neutral-900 focus-visible:bg-neutral-100 focus-visible:text-neutral-900 focus-visible:ring-offset-0 disabled:text-neutral-500':
						variant === 'link'
				},
				className
			)}
			type={type}
			{...props}
		/>
	);
};

export default Button;
