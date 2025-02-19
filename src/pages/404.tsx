import { Link } from 'react-router';

import pageNotFound from '@assets/404.svg';

const NotFound = () => {
	return (
		<div className="grid h-screen place-items-center">
			<div>
				<img src={pageNotFound} alt="Page not found" />
				<h1 className="text-center text-7xl font-semibold text-neutral-900">404</h1>
				<p className="mt-2 text-center text-base text-neutral-700 md:text-lg">
					<span>Looks like you are lost. </span>
					<Link to="/forms" className="underline">
						See your forms here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default NotFound;
