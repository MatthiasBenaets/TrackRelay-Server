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

		const type = String(payload.type) || 'id';
		const lat = Number(payload.lat) || 0;
		const lon = Number(payload.lon) || 0;
		const alt = Number(payload.alt) || 0;
		const time = Number(payload.time) || 0;
		const dist = Number(payload.dist) || 0;
		const spd = Number(payload.spd) || 0;
		const cad = Number(payload.cad) || 0;
		const hr = Number(payload.hr) || 0;
		const pwr = Number(payload.pwr) || 0;
		const avgp = Number(payload.avgp) || 0;
		const asc = Number(payload.asc) || 0;
		const desc = Number(payload.desc) || 0;
		const cal = Number(payload.cal) || 0;
		const grd = Number(payload.grd) || 0;

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
