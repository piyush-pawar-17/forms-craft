import { toast as sonner, type ExternalToast } from 'sonner';

const toast = (message: React.ReactNode, options: ExternalToast = {}) =>
	sonner(message, {
		unstyled: true,
		classNames: {
			toast: 'bg-neutral-900 border border-neutral-50 text-neutral-50 rounded p-3 font-normal text-sm w-full'
		},
		duration: 3000,
		...options
	});

export default toast;
