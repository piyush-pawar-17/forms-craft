import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash, CircleX, ScanEye } from 'lucide-react';

import { Button, Input, Loader, toast } from '@ui';
import { Field } from '@components';

import { getRandomInt, setForm } from '@utils';

import noFields from '@assets/no-fields.svg';

import type { InputField, TextField } from '@components';

export type FormType = {
	id?: string;
	name?: string;
	inputs?: InputField[];
};

type FormProps = FormType;

const Form = ({ id, name, inputs }: FormProps) => {
	const queryClient = useQueryClient();

	const [isAddingNew, setIsAddingNew] = useState(false);

	const [formName, setFormName] = useState(name ?? '');
	const [formInputs, setFormInputs] = useState<InputField[]>(inputs ?? []);

	useEffect(() => {
		const interval = setInterval(() => {
			if (!isPending) {
				handleSave(true);
			}
		}, 7000);

		return () => {
			clearInterval(interval);
		};
	}, [id, formName, formInputs]);

	const { mutate, isPending, isError, error } = useMutation({
		mutationKey: ['update-form', id],
		mutationFn: ({
			id,
			form,
			isAutoSave = false
		}: {
			id: string;
			form: FormType;
			isAutoSave?: boolean;
		}) => {
			return new Promise((resolve, reject) => {
				setTimeout(
					() => {
						if (!form.name || form.name?.trim() === '') {
							if (!isAutoSave) {
								toast('Form name is required');
							}

							return reject(new Error('Form name is required'));
						}

						if (Math.random() < 0.3) {
							if (!isAutoSave) {
								toast('Server error occured');
							}

							return reject(new Error('Server error occured'));
						}

						setForm(id, form);

						queryClient.invalidateQueries({
							queryKey: ['forms']
						});
						queryClient.invalidateQueries({
							queryKey: ['form', id]
						});

						if (!isAutoSave) {
							toast('Form saved');
						}
						resolve({ isAutoSave });
					},
					getRandomInt(500, 1500)
				);
			});
		}
	});

	const onFieldAdd = (newInput: InputField) => {
		setFormInputs((inputs) => [...inputs, newInput]);

		setIsAddingNew(false);
	};

	const handleSave = (isAutoSave = false) => {
		mutate({
			id: id as string,
			form: {
				name: formName,
				id: id as string,
				inputs: formInputs
			},
			isAutoSave
		});
	};

	return (
		<div>
			<div className="relative mb-8">
				<Input
					required
					label="Form name"
					placeholder="Enter form name"
					value={formName ?? ''}
					onChange={(event) => {
						setFormName(event.target.value);
					}}
				/>
				{isPending && (
					<div className="absolute top-1 right-0 flex items-center gap-1">
						<Loader size={4} /> <span className="text-xs text-neutral-400">Saving</span>
					</div>
				)}
				{isError && (
					<div className="absolute top-1 right-0 flex items-center gap-1 text-red-400">
						<CircleX size={12} />{' '}
						<span className="text-xs">Error while saving ({error.message})</span>
					</div>
				)}
			</div>

			{formInputs.length === 0 && !isAddingNew ? (
				<div className="flex flex-col items-center">
					<img src={noFields} alt="No fields added" className="w-40" />
					<p className="text-sm text-neutral-600">
						No fields added yet. Click below to add fields.
					</p>
				</div>
			) : (
				<div className="mb-6 flex flex-col gap-4 shadow-neutral-50">
					{formInputs.map((formInput, inputIdx) => (
						<div key={inputIdx} className="rounded-md bg-white p-2">
							<div className="item-center flex justify-between">
								<p>
									<span className="font-semibold">{formInput.label}</span>{' '}
									<span className="text-sm">({formInput.type})</span>
								</p>
								<button
									type="button"
									onClick={() => {
										setFormInputs((inputs) =>
											inputs.filter(
												(_, currentIdx) => inputIdx !== currentIdx
											)
										);
									}}
								>
									<Trash size={18} className="mr-2 cursor-pointer text-red-400" />
								</button>
							</div>

							<div className="mt-2 flex flex-col gap-1 empty:mt-0">
								<p className="text-sm">
									<span className="font-semibold">Required: </span>
									<span>{formInput.isRequired ? 'true' : 'false'}</span>
								</p>
								{formInput.placeholder && (
									<p className="text-sm">
										<span className="font-semibold">Placeholder: </span>
										<span>{formInput.placeholder}</span>
									</p>
								)}
								{(formInput as TextField).defaultValue && (
									<p className="text-sm">
										<span className="font-semibold">Default value: </span>
										<span>{(formInput as TextField).defaultValue}</span>
									</p>
								)}
								{formInput.type === 'text' ? (
									<>
										{formInput.minLength && (
											<p className="text-sm">
												<span className="font-semibold">Min length: </span>
												<span>{formInput.minLength}</span>
											</p>
										)}
										{formInput.maxLength && (
											<p className="text-sm">
												<span className="font-semibold">Max length: </span>
												<span>{formInput.maxLength}</span>
											</p>
										)}
									</>
								) : formInput.type === 'number' ? (
									<>
										{formInput.min && (
											<p className="text-sm">
												<span className="font-semibold">Min value: </span>
												<span>{formInput.min}</span>
											</p>
										)}
										{formInput.max && (
											<p className="text-sm">
												<span className="font-semibold">Max value: </span>
												<span>{formInput.max}</span>
											</p>
										)}
									</>
								) : formInput.type === 'select' ? (
									<p className="text-sm">
										<span className="font-semibold">Options: </span>
										<span>{formInput.options.join(', ')}</span>
									</p>
								) : formInput.type === 'email' &&
								  formInput.allowedDomains.length > 0 ? (
									<p className="text-sm">
										<span className="font-semibold">Allowed domains: </span>
										<span>{formInput.allowedDomains.join(', ')}</span>
									</p>
								) : formInput.type === 'url' ? (
									<p className="text-sm">
										<span className="font-semibold">Secure only urls: </span>
										<span>{formInput.secureOnly ? 'true' : 'false'}</span>
									</p>
								) : null}
							</div>
						</div>
					))}
				</div>
			)}

			{isAddingNew && (
				<div className="mb-6 rounded-md border border-neutral-300 bg-white p-4">
					<Field onAdd={onFieldAdd} onCancel={() => setIsAddingNew(false)} />
				</div>
			)}

			<div className="mt-4 flex justify-between">
				<div className="flex items-center gap-2">
					<Button
						variant="secondary"
						onClick={() => setIsAddingNew(true)}
						disabled={isAddingNew}
					>
						+ Add new field
					</Button>
					<Button onClick={() => handleSave()} disabled={isPending}>
						Save
					</Button>
				</div>

				<Link
					to={`/forms/${id}/preview`}
					className="flex cursor-pointer items-center gap-2 rounded bg-neutral-900 px-3 py-2 text-neutral-50 transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
				>
					<span>Preview</span>
					<ScanEye size={20} />
				</Link>
			</div>
		</div>
	);
};

export { Form };
