import { json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import type { LiveData } from '$lib/types';

const liveDataSchema = z.object({
	type: z.string().default('id'),
	lat: z.number().default(0),
	lon: z.number().default(0),
	alt: z.number().default(0),
	time: z.number().default(0),
	dist: z.number().default(0),
	spd: z.number().default(0),
	cad: z.number().default(0),
	hr: z.number().default(0),
	pwr: z.number().default(0),
	avgp: z.number().default(0),
	asc: z.number().default(0),
	desc: z.number().default(0),
	cal: z.number().default(0),
	grd: z.number().default(0)
});

let liveDataStore: LiveData = liveDataSchema.parse({});

export const POST: RequestHandler = async ({ request }) => {
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
