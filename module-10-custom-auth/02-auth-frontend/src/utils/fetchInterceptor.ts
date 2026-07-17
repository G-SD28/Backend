const originalFetch = window.fetch;

const baseUrl = import.meta.env.VITE_APP_TRAVEL_JOURNAL_API_URL;

if (!baseUrl) {
	console.log('No API URL provided');
}

window.fetch = async (url, options = {}, ...rest) => {
	const retry = options._retry;

	let res = await originalFetch(
		url,
		{ ...options, credentials: 'include' },
		...rest,
	);

	const authHeader = res.headers.get('WWW-Authenticate');
	console.log(authHeader);

	if (authHeader?.includes('token_expired') && !retry) {
		console.log('Attempt refresh');

		const refreshRes = await originalFetch(`${baseUrl}/auth/refresh`, {
			method: 'POST',
			credentials: 'include',
		});

		if (!refreshRes.ok) throw new Error('Login required');

		res = await originalFetch(
			url,
			{ ...options, _retry: true, credentials: 'include' },
			...rest,
		);
	}

	return res;
};
