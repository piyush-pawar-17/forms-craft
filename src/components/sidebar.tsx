import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Outlet, Link, useNavigate, useParams } from 'react-router';
import { Menu } from 'lucide-react';

import { Button, Sheet, SheetContent, SheetTrigger, Loader } from '@ui';

import { cn, getRandomInt, getForms, createNewForm } from '@utils';

import type { FormType } from '@components';

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		isLoading,
		isFetching,
		data: forms
	} = useQuery({
		queryKey: ['forms'],
		queryFn: () => {
			return new Promise<FormType[]>((resolve) => {
				setTimeout(
					() => {
						const forms = getForms();

						resolve(forms);
					},
					getRandomInt(500, 1500)
				);
			});
		}
	});

	const handleCreateForm = () => {
		const id = createNewForm();

		navigate(`/forms/${id}`);

		setIsSidebarOpen(false);

		queryClient.invalidateQueries({
			queryKey: ['forms']
		});
	};

	return (
		<div className="flex gap-2">
			<div className="fixed inset-y-0 left-0 hidden w-72 border-r border-neutral-300 md:block">
				<SidebarContent
					isLoading={isLoading}
					isFetching={isFetching}
					forms={forms}
					handleCreateForm={handleCreateForm}
				/>
			</div>

			<Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
				<SheetTrigger className="fixed top-4 right-4 cursor-pointer rounded-full bg-neutral-100 p-2 md:hidden">
					<Menu size={20} />
				</SheetTrigger>
				<SheetContent className="bg-neutral-50">
					<SidebarContent
						isLoading={isLoading}
						isFetching={isFetching}
						forms={forms}
						handleCreateForm={handleCreateForm}
						setIsSidebarOpen={setIsSidebarOpen}
					/>
				</SheetContent>
			</Sheet>

			<div className="grow md:pl-72">
				<Outlet />
			</div>
		</div>
	);
};

type SidebarContentProps = {
	isLoading: boolean;
	isFetching: boolean;
	forms: FormType[] | undefined;
	handleCreateForm: () => void;
	setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
const SidebarContent = ({
	isLoading,
	isFetching,
	forms,
	setIsSidebarOpen,
	handleCreateForm
}: SidebarContentProps) => {
	const params = useParams();

	return (
		<aside className="flex h-full flex-col justify-between p-4">
			<div className="grow">
				<p className="pb-4 text-center text-lg font-medium">Your forms</p>
				{isLoading ? (
					<Loader />
				) : !forms || forms?.length === 0 ? (
					<div className="flex flex-col gap-2">
						{isFetching ? (
							<Loader />
						) : (
							<p className="text-sm italic">No forms created yet</p>
						)}
					</div>
				) : (
					<div className="flex flex-col gap-1">
						{forms.map((form) => (
							<div key={form.id}>
								<Link
									onClick={() => setIsSidebarOpen?.(false)}
									to={`/forms/${form.id}`}
									className={cn(
										'block rounded p-2 text-sm hover:bg-neutral-200',
										{
											'bg-neutral-200 hover:bg-neutral-300':
												form.id?.toString() === params.formId,
											italic: !form.name
										}
									)}
								>
									{form.name || '(Untitled form)'}
								</Link>
							</div>
						))}
					</div>
				)}

				{!isLoading && (
					<Button
						variant="link"
						className="mx-auto mt-4 block text-center text-sm"
						onClick={handleCreateForm}
						disabled={isLoading || isFetching}
					>
						Create form
					</Button>
				)}
			</div>

			<Link to="/" className="text-center text-sm underline">
				Home
			</Link>
		</aside>
	);
};

export default Sidebar;
