import type { FormType } from '@components';

export const FORM_IDENTITY_KEY = 'formIdentity';
export const getFormIdentity = () => localStorage.getItem(FORM_IDENTITY_KEY) || '0';
export const setFormIdentity = (id: number) =>
	localStorage.setItem(FORM_IDENTITY_KEY, id.toString());

export const FORMS_KEY = 'forms';
export const getForms = () => JSON.parse(localStorage.getItem(FORMS_KEY) || '[]') as FormType[];
export const getForm = (id: string) => {
	const forms = getForms();
	const form = forms.find((f) => f.id === id);

	return form;
};
export const setForms = (forms: FormType[]) =>
	localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
export const setForm = (id: string, formData: FormType) => {
	const forms = getForms();

	const updatedForms = forms.map((form) => {
		if (form.id === id) {
			return formData;
		}
		return form;
	});

	setForms(updatedForms);
};

export const createNewForm = () => {
	const id = getFormIdentity();
	const forms = getForms();

	const newForm = {
		id,
		name: '',
		inputs: []
	};

	if (!forms) {
		setForms([newForm]);
	} else {
		setForms([...forms, newForm]);
	}

	setFormIdentity(parseInt(id) + 1);

	return id;
};
