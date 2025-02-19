import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Button,
	Input,
	Loader,
	toast
} from '@ui';

import { cn, getRandomInt, getForm, validateInput } from '@utils';

import notFound from '@assets/form-not-found.svg';
import noFields from '@assets/no-fields.svg';

import type { FormType } from '@components';

const FormPreview = () => {
	const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

	const params = useParams();

	const {
		data: previewData,
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

	const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setValidationErrors({});

		const formData = new FormData(event.target as HTMLFormElement);

		const errors = (previewData?.inputs || []).reduce<Record<string, string[]>>(
			(fieldErrors, formField, fieldIdx) => {
				const fieldValue = formData.get(fieldIdx.toString());

				fieldErrors[fieldIdx.toString()] = validateInput({
					formField,
					value: fieldValue
				});

				return fieldErrors;
			},
			{}
		);

		const hasErrors = Object.values(errors).some((err) => err.length > 0);

		if (hasErrors) {
			setValidationErrors(errors);
		} else {
			toast('Valid form submitted');
		}
	};

	if (isLoading) {
		return (
			<div className="px-8">
				<header className="py-8 pb-4">
					<h1 className="mb-2 text-2xl font-semibold tracking-wide">Form Preview</h1>
				</header>

				<Loader size={12} />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="px-8">
				<header className="py-8 pb-4">
					<h1 className="mb-2 text-2xl font-semibold tracking-wide">Form Preview</h1>
				</header>

				<div className="flex flex-col items-center">
					<img src={notFound} alt="Form not found" className="mt-4 h-60 w-60" />
					<p className="mt-8 text-xl font-semibold">Uh oh!</p>
					<p>Form you are looking for does not exist</p>
				</div>
			</div>
		);
	}

	if (!previewData) {
		return (
			<div className="px-8">
				<header className="py-8 pb-4">
					<h1 className="mb-2 text-2xl font-semibold tracking-wide">Form Preview</h1>
				</header>

				<div className="flex flex-col items-center">
					<img src={notFound} alt="Form not found" className="mt-4 h-60 w-60" />
					<p className="mt-8 text-xl font-semibold">Uh oh!</p>
					<p>An error occurred fetching the form</p>
				</div>
			</div>
		);
	}

	return (
		<div className="px-8 pb-20">
			<header className="py-8 pb-4">
				<h2 className="mb-2 text-2xl font-semibold tracking-wide">Form Preview</h2>
			</header>

			<form onSubmit={submitForm} noValidate>
				<h1
					className={cn('text-xl font-medium', {
						'font-normal italic': !previewData.name
					})}
				>
					{previewData.name || '(Untitled form)'}
				</h1>

				{!previewData.inputs || previewData.inputs.length === 0 ? (
					<div className="flex flex-col items-center">
						<img src={noFields} alt="No fields added" className="w-40" />
						<p className="text-sm text-neutral-600">No fields added yet.</p>
					</div>
				) : (
					<div className="mt-8 flex flex-col gap-4">
						{previewData.inputs.map((formInput, inputIdx) =>
							formInput.type === 'select' ? (
								<div key={inputIdx}>
									<label
										htmlFor={`select-${inputIdx}`}
										className="mb-2 block text-sm"
									>
										{formInput.label}{' '}
										{formInput.isRequired && (
											<span className="text-xs text-red-500">*</span>
										)}
									</label>
									<Select name={inputIdx.toString()}>
										<SelectTrigger id={`select-${inputIdx}`}>
											<SelectValue
												placeholder={
													formInput.placeholder || 'Select an option'
												}
											/>
										</SelectTrigger>

										<SelectContent>
											{formInput.options.map((option, optionIdx) => (
												<SelectItem key={optionIdx} value={option}>
													{option}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							) : ['text', 'email', 'url', 'number'].includes(formInput.type) ? (
								<Input
									key={inputIdx}
									label={formInput.label}
									required={formInput.isRequired}
									placeholder={formInput.placeholder}
									defaultValue={formInput.defaultValue}
									name={inputIdx.toString()}
									message={validationErrors?.[inputIdx.toString()]?.join(', ')}
									messageType="error"
								/>
							) : null
						)}
					</div>
				)}

				<Button type="submit" className="mt-8">
					Submit
				</Button>
			</form>
		</div>
	);
};

export default FormPreview;
