import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';

import { Forms, FormBuilder, FormPreview, NotFound } from '@pages';
import { Sidebar } from '@components';

import { FORM_IDENTITY_KEY, FORMS_KEY } from '@utils';

const App = () => {
	useEffect(() => {
		const formIdentity = localStorage.getItem(FORMS_KEY);
		const forms = localStorage.getItem(FORMS_KEY);

		if (!formIdentity) {
			localStorage.setItem(FORM_IDENTITY_KEY, '1');
		}

		if (!forms) {
			localStorage.setItem(FORMS_KEY, JSON.stringify([]));
		}
	}, []);

	return (
		<main className="min-h-screen bg-neutral-100">
			<Routes>
				<Route path="/" element={<Navigate replace to="/forms" />} />
				<Route element={<Sidebar />}>
					<Route path="/forms" element={<Forms />} />
					<Route path="/forms/:formId" element={<FormBuilder />} />
					<Route path="/forms/:formId/preview" element={<FormPreview />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>

			<Toaster />
		</main>
	);
};

export default App;
