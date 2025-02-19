import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { Button } from '@ui';

import { createNewForm } from '@utils';

const Forms = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleCreateForm = () => {
		const id = createNewForm();

		navigate(`/forms/${id}`);

		queryClient.invalidateQueries({
			queryKey: ['forms']
		});
	};

	return (
		<div className="grid h-screen place-items-center">
			<div className="pb-24">
				<h1 className="text-center font-serif text-5xl font-semibold">FormsCraft</h1>
				<h2 className="mt-2 text-center text-neutral-700">
					Create forms, add validations effortlessly!
				</h2>

				<Button className="mx-auto mt-8 block text-sm" onClick={handleCreateForm}>
					Get started
				</Button>
			</div>
		</div>
	);
};

export default Forms;
