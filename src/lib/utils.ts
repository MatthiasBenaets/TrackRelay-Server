import { env } from '$env/dynamic/public';
import FitParser from 'fit-file-parser';
import { z } from 'zod';
import type { FitData } from '$lib/types';

export const liveDataSchema = z.object({
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

export function getOverlays(): string[] {
	const overlays = import.meta.glob('$lib/overlays/*.svelte');
	return Object.keys(overlays).map((key) => key.split('/').pop()!.replace('.svelte', ''));
}

export function msToTime(duration: number) {
	let seconds: string | number = Math.floor((duration / 1000) % 60),
		minutes: string | number = Math.floor((duration / (1000 * 60)) % 60),
		hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;

	return hours + ':' + minutes + ':' + seconds;
}

const ftp: number = Number(env.PUBLIC_FTP) | 0;
export const zones = [
	{ name: 'z1', power: ftp * 0.6, color: 'rgb(107, 114, 128)' },
	{ name: 'z2', power: ftp * 0.75, color: 'rgb(59, 130, 246)' },
	{ name: 'z3', power: ftp * 0.89, color: 'rgb(34, 197, 94)' },
	{ name: 'z4', power: ftp * 1.04, color: 'rgb(234, 179, 8)' },
	{ name: 'z5', power: ftp * 1.18, color: 'rgb(249, 115, 22)' },
	{ name: 'z6', power: 10000, color: 'rgb(239, 68, 68)' }
];
export function pwrToZone(power: number) {
	for (let i = 0; i < zones.length; i++) {
		if (power <= zones[i].power) {
			return i + 1;
		}
	}

	return 1;
}

export const refreshDuration = Number(env.PUBLIC_REFRESH_RATE) * 1000;

export function fitToJson(raw: ArrayBuffer | Uint8Array): Promise<FitData> {
	const fitParser = new FitParser({
		force: true,
		speedUnit: 'm/s',
		lengthUnit: 'm',
		temperatureUnit: 'kelvin',
		pressureUnit: 'bar',
		elapsedRecordField: true,
		mode: 'cascade'
	});

	const buffer = raw instanceof Uint8Array ? raw.buffer : raw;

	return new Promise((resolve, reject) => {
		fitParser.parse(buffer as ArrayBuffer, (error, data) => {
			if (error) {
				reject(error);
			} else {
				resolve(data as FitData);
			}
		});
	});
}

export function calculateGrade(alt1: number, alt2: number, dist1: number, dist2: number): number {
	const dist = dist2 - dist1;
	if (!dist || dist <= 0) return 0;
	const alt = alt2 - alt1;
	return (alt / dist) * 100;
}
