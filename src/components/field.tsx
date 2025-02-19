import { useState } from 'react';
import { X } from 'lucide-react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Button,
	Input,
	toast
} from '@ui';

export type TextField = {
	type: 'text';
	label: string;
	isRequired: boolean;
	placeholder?: string;
	defaultValue?: string;
	minLength?: number;
	maxLength?: number;
};

export type URLField = {
	type: 'url';
	label: string;
	isRequired: boolean;
	placeholder?: string;
	secureOnly: boolean;
};

export type EmailField = {
	type: 'email';
	label: string;
	isRequired: boolean;
	placeholder?: string;
	allowedDomains: string[];
};

export type NumberField = {
	type: 'number';
	label: string;
	isRequired: boolean;
	placeholder?: string;
	defaultValue?: number;
	min?: number;
	max?: number;
};

export type SelectField = {
	type: 'select';
	label: string;
	isRequired: boolean;
	placeholder?: string;
	options: string[];
};

export type InputField = TextField | EmailField | URLField | NumberField | SelectField;

export type ValidatonErrors = Record<
	string,
	{
		type: 'info' | 'error';
		message: string;
	}
>;

type FieldProps = {
	onAdd: (input: InputField) => void;
	onCancel?: () => void;
};

const Field = ({ onAdd, onCancel }: FieldProps) => {
	const [label, setLabel] = useState('');
	const [type, setType] = useState<InputField['type']>('text');
	const [placeholder, setPlaceholder] = useState('');
	const [defaultValue, setDefaultValue] = useState('');
	const [min, setMin] = useState('');
	const [max, setMax] = useState('');
	const [isRequired, setIsRequired] = useState(false);
	const [secureOnly, setSecureOnly] = useState(false);
	const [options, setOptions] = useState<string[]>([]);
	const [validationErrors, setValidationErrors] = useState<ValidatonErrors>({});

	const addField = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const validationErrors: ValidatonErrors = {};

		if (label.trim() === '') {
			validationErrors.label = {
				type: 'info',
				message: 'Label is required'
			};
		}

		if (Object.keys(validationErrors).length > 0) {
			setValidationErrors(validationErrors);
			return;
		}

		setValidationErrors({});

		const common = {
			label: label.trim(),
			placeholder: placeholder.trim(),
			isRequired
		};

		if (type === 'text') {
			const textFields: Omit<TextField, 'label' | 'placeholder' | 'isRequired'> = {
				type: type as TextField['type']
			};

			if (min.trim() !== '') {
				textFields.minLength = parseInt(min, 10);
			}
			if (max.trim() !== '') {
				textFields.maxLength = parseInt(max, 10);
			}
			if (defaultValue.trim() !== '') {
				textFields.defaultValue = defaultValue;
			}

			onAdd({ ...common, ...textFields });
		} else if (type === 'number') {
			const numberFields: Omit<NumberField, 'label' | 'placeholder' | 'isRequired'> = {
				type: type as NumberField['type']
			};

			if (min.trim() !== '') {
				numberFields.min = parseInt(min, 10);
			}
			if (max.trim() !== '') {
				numberFields.max = parseInt(max, 10);
			}
			if (defaultValue.trim() !== '') {
				numberFields.defaultValue = parseFloat(defaultValue);
			}

			onAdd({ ...common, ...numberFields });
		} else if (type === 'select') {
			const normalizedOptions = options.map((o) => o.trim()).filter((o) => o !== '');

			if (normalizedOptions.length === 0) {
				return toast('Add atleast 1 option');
			}

			const selectFields: Omit<SelectField, 'label' | 'placeholder' | 'isRequired'> = {
				type: type as SelectField['type'],
				options: normalizedOptions
			};
			onAdd({ ...common, ...selectFields });
		} else if (type === 'email') {
			const normalizedOptions = options.map((o) => o.trim()).filter((o) => o !== '');

			const selectFields: Omit<EmailField, 'label' | 'placeholder' | 'isRequired'> = {
				type: type as EmailField['type'],
				allowedDomains: normalizedOptions
			};
			onAdd({ ...common, ...selectFields });
		} else if (type === 'url') {
			onAdd({ ...common, type, secureOnly });
		}
	};
	return (
		<form className="flex flex-col gap-4" onSubmit={addField} noValidate>
			<Input
				required
				label="Label"
				placeholder="Label for the field"
				value={label}
				onChange={(event) => {
					setLabel(event.target.value);
				}}
				message={validationErrors.label?.message}
				messageType={validationErrors.label?.type}
			/>

			<div>
				<div>
					<label htmlFor="field-type" className="mb-2 block text-sm">
						Field type <span className="text-xs text-red-500">*</span>
					</label>
					<Select
						onValueChange={(type) => {
							setType(type as InputField['type']);
							setDefaultValue('');
						}}
						value={type}
					>
						<SelectTrigger id="field-type">
							<SelectValue placeholder="Select a field type" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="text">Text</SelectItem>
							<SelectItem value="email">Email</SelectItem>
							<SelectItem value="url">URL</SelectItem>
							<SelectItem value="number">Number</SelectItem>
							<SelectItem value="select">Select</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2">
					<Input
						type="checkbox"
						label="Is required"
						wrapperClassName="mt-2"
						checked={isRequired}
						onChange={(event) => setIsRequired(event.target.checked)}
					/>
					{type === 'url' && (
						<Input
							type="checkbox"
							label="Secure only"
							wrapperClassName="mt-2"
							checked={secureOnly}
							onChange={(event) => setSecureOnly(event.target.checked)}
						/>
					)}
				</div>
			</div>

			<Input
				label="Placeholder"
				placeholder="Helper text for the field"
				value={placeholder}
				onChange={(event) => {
					setPlaceholder(event.target.value);
				}}
			/>

			{['text', 'number'].includes(type) && (
				<Input
					label="Default value"
					placeholder="Default value for the field"
					type={type === 'number' ? 'number' : 'text'}
					value={defaultValue}
					onChange={(event) => {
						setDefaultValue(event.target.value);
					}}
				/>
			)}

			{['text', 'number'].includes(type) ? (
				<div className="flex items-center gap-4">
					<Input
						label={type === 'number' ? 'Min value' : 'Min length'}
						type="number"
						placeholder={`Min ${type === 'number' ? 'value' : 'length'} for the field`}
						className="w-full"
						value={min}
						onChange={(event) => setMin(event.target.value)}
					/>

					<Input
						label={type === 'number' ? 'Max value' : 'Max length'}
						type="number"
						placeholder={`Max ${type === 'number' ? 'value' : 'length'} for the field`}
						className="w-full"
						value={max}
						onChange={(event) => setMax(event.target.value)}
					/>
				</div>
			) : ['email', 'select'].includes(type) ? (
				<div>
					<label className="mb-2 inline-block text-sm">
						{type === 'email' ? 'Allowed domains' : 'Options'}{' '}
						{type === 'select' && <span className="text-xs text-red-500">*</span>}
					</label>
					<div className="flex flex-col gap-2">
						{options.map((opt, idx) => (
							<div key={idx} className="flex items-center gap-2">
								<Input
									placeholder={`Value for ${type === 'email' ? 'Domain' : 'Option'} ${idx + 1}`}
									value={opt}
									onChange={(event) =>
										setOptions((options) =>
											options.map((opt, optIdx) =>
												optIdx === idx ? event.target.value : opt
											)
										)
									}
								/>
								<button
									type="button"
									onClick={() =>
										setOptions((options) =>
											options.filter((_, optIdx) => idx !== optIdx)
										)
									}
								>
									<X className="cursor-pointer text-red-400" />
								</button>
							</div>
						))}
						<Button
							variant="link"
							className="self-start"
							onClick={() => setOptions((options) => [...options, ''])}
						>
							{type === 'email' ? '+ Add domain' : '+ Add option'}
						</Button>
					</div>
				</div>
			) : null}

			<div className="flex gap-4">
				<Button type="submit" className="self-start">
					Add field
				</Button>
				<Button variant="secondary" className="bg-white" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</form>
	);
};

export { Field };
