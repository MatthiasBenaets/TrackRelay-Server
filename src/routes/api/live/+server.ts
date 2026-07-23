import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { liveDataSchema } from '$lib/utils';
import type { RequestHandler } from './$types';
import type { LiveData } from '$lib/types';

let liveDataStore: LiveData = liveDataSchema.parse({});

export const POST: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('authorization');

	const token = env.AUTH_TOKEN;

	if (!authHeader || authHeader !== token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const payload = await request.json();

		const validatedData = liveDataSchema.parse(payload);

		liveDataStore = validatedData;

		return json(
			{
				message: 'Location received',
				data: liveDataStore
			},
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json(
				{ error: 'Invalid payload structure', details: z.prettifyError(error) },
				{ status: 422 }
			);
		}

		return json({ error: 'Malformed JSON payload' }, { status: 400 });
	}
};

export const GET: RequestHandler = () => {
	return json(liveDataStore);
};
