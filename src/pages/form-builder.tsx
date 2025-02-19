import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { Loader } from '@ui';
import { Form } from '@components';

import { getRandomInt, getForm } from '@utils';

import notFound from '@assets/form-not-found.svg';

import type { FormType } from '@components';

const FormBuilder = () => {
	const params = useParams();

	const {
		data: formData,
		isLoading,
		isError
	} = useQuery({
		queryKey: ['form', params.formId],
		queryFn: () => {
			return new Promise<FormType>((resolve, reject) => {
				setTimeout(
					() => {
						const form = getForm(params.formId as string);

						if (!form) {
							reject('Form not found');
						} else {
							resolve(form);
						}
					},
					getRandomInt(500, 1500)
				);
			});
		}
	});

	if (isLoading) {
		return (
			<div className="px-8">
				<header className="py-8 pb-4">
					<h1 className="mb-2 text-2xl font-semibold tracking-wide">Form Builder</h1>
					<h2 className="text-sm">Build a form with simple validation rules</h2>
				</header>

				<Loader size={12} />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="px-8">
				<header className="py-8 pb-4">
					<h1 className="mb-2 text-2xl font-semibold tracking-wide">Form Builder</h1>
					<h2 className="text-sm">Build a form with simple validation rules</h2>
				</header>

				<div className="flex flex-col items-center">
					<img src={notFound} alt="Form not found" className="mt-4 h-60 w-60" />
					<p className="mt-8 text-xl font-semibold">Uh oh!</p>
					<p>Form you are looking for does not exist</p>
				</div>
			</div>
		);
	}

	return (
		<div className="px-8 pb-20">
			<header className="py-8 pb-4">
				<h1 className="mb-2 text-2xl font-semibold tracking-wide">Form Builder</h1>
				<h2 className="text-sm">Build a form with simple validation rules</h2>
			</header>

			<Form
				key={params.formId}
				id={params.formId}
				name={formData?.name}
				inputs={formData?.inputs}
			/>
		</div>
	);
};

export default FormBuilder;
