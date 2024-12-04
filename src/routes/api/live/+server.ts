import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { LiveData } from '$lib/types';

let liveData: LiveData = {
	type: 'id',
	lat: 0,
	lon: 0,
	alt: 0,
	time: 0,
	dist: 0,
	spd: 0,
	cad: 0,
	hr: 0,
	pwr: 0,
	avgp: 0,
	asc: 0,
	desc: 0,
	cal: 0,
	grd: 0
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Parse the JSON payload
		const payload = await request.json();

		const type = String(payload.type);
		const lat = Number(payload.lat);
		const lon = Number(payload.lon);
		const alt = Number(payload.alt);
		const time = Number(payload.time);
		const dist = Number(payload.dist);
		const spd = Number(payload.spd);
		const cad = Number(payload.cad);
		const hr = Number(payload.hr);
		const pwr = Number(payload.pwr);
		const avgp = Number(payload.avgp);
		const asc = Number(payload.asc);
		const desc = Number(payload.desc);
		const cal = Number(payload.cal);
		const grd = Number(payload.grd);

		// Store live data
		liveData = {
			type,
			lat,
			lon,
			alt,
			time,
			dist,
			spd,
			cad,
			hr,
			pwr,
			avgp,
			asc,
			desc,
			cal,
			grd
		};

		return json(
			{
				message: 'Location received',
				data: liveData
			},
			{ status: 200 }
		);
	} catch (error) {
		return json({ error: 'Error processing location data ' + error }, { status: 400 });
	}
};

export const GET: RequestHandler = () => {
	if (!liveData) {
		return json({ error: 'No location data available' }, { status: 404 });
	}
	return json(liveData);
};
