import type { EmailField, InputField, NumberField, TextField, URLField } from '@components';

export const validateRequired = ({
	formField,
	value
}: {
	formField: InputField;
	value: FormDataEntryValue | null;
}) => {
	if (
		formField.isRequired &&
		(value === null || typeof value === 'undefined' || value.toString() === '')
	) {
		return [`${formField.label} is required`];
	}

	return [];
};

export const validateNumber = ({
	formField,
	value
}: {
	formField: InputField;
	value: FormDataEntryValue | null;
}) => {
	const parsedNumber = parseFloat(value!.toString());
	const field = formField as NumberField;

	const messages = [];
	if (isNaN(parsedNumber)) {
		messages.push('Invalid number');
	}

	if (field.min && parsedNumber < field.min) {
		messages.push(`${field.label} should be greater than or equal to ${field.min}`);
	}

	if (field.max && parsedNumber > field.max) {
		messages.push(`${field.label} should be less than or equal to ${field.max}`);
	}

	return messages;
};

export const validateText = ({
	formField,
	value
}: {
	formField: InputField;
	value: FormDataEntryValue | null;
}) => {
	const textField = formField as TextField;

	const messages = [];

	if (textField.minLength && value!.toString().length < textField.minLength) {
		messages.push(
			`${formField.label} should be contain atleast ${textField.minLength} characters`
		);
	}

	if (textField.maxLength && value!.toString().length > textField.maxLength) {
		messages.push(
			`${formField.label} should be contain atmost ${textField.maxLength} characters`
		);
	}

	return messages;
};

export const validateEmail = ({
	formField,
	value
}: {
	formField: InputField;
	value: FormDataEntryValue | null;
}) => {
	const emailField = formField as EmailField;
	const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

	const messages = [];

	if (!emailField.isRequired && value!.toString().trim() === '') {
		return [];
	}

	if (!emailRegex.test(value!.toString())) {
		return ['Invalid email'];
	}

	if (emailField.allowedDomains.length > 0) {
		const isAllowed = emailField.allowedDomains.some((domain) =>
			value!.toString().endsWith(domain)
		);

		if (!isAllowed) {
			messages.push('Domain not allowed');
		}
	}

	return messages;
};

export const validateURL = ({
	formField,
	value
}: {
	formField: InputField;
	value: FormDataEntryValue | null;
}) => {
	const urlField = formField as URLField;
	const messages = [];

	let url;

	if (!urlField.isRequired && value!.toString().trim() === '') {
		return [];
	}

	try {
		url = new URL(value!.toString());
	} catch (_) {
		return ['Invalid URL'];
	}

	if (urlField.secureOnly && url.protocol !== 'https:') {
		messages.push('Only secure urls are allowed');
	}

	return messages;
};

export const validateInput = ({
	formField,
	value
}: {
	formField: InputField;
	value: FormDataEntryValue | null;
}) => {
	const messages = [];
	const requiredMessage = validateRequired({
		formField,
		value
	});
	messages.push(...requiredMessage);

	if (formField.type === 'number') {
		const numberMessages = validateNumber({
			formField,
			value
		});
		messages.push(...numberMessages);
	}

	if (formField.type === 'email') {
		const emailMessages = validateEmail({
			formField,
			value
		});
		messages.push(...emailMessages);
	}

	if (formField.type === 'url') {
		const urlMessages = validateURL({
			formField,
			value
		});
		messages.push(...urlMessages);
	}

	if (formField.type === 'text') {
		const textMessages = validateText({
			formField,
			value
		});
		messages.push(...textMessages);
	}

	return messages;
};
