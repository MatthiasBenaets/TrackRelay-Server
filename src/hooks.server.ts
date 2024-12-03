import { error, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.authorization = event.request.headers.get('Authorization');
	if (event.url.pathname.startsWith('/api/live')) {
		if (event.locals.authorization != env.PUBLIC_API_TOKEN) {
			throw error(401, 'Unauthorized');
		}
	}

	const response = await resolve(event);

	return response;
};
