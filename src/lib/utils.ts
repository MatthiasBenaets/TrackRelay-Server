import { env } from '$env/dynamic/public';

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
	{ name: 'z1', power: ftp * 0.6, color: 'rgb(107 114 128)' },
	{ name: 'z2', power: ftp * 0.75, color: 'rgb(59 130 246)' },
	{ name: 'z3', power: ftp * 0.89, color: 'rgb(34 197 94)' },
	{ name: 'z4', power: ftp * 1.04, color: 'rgb(234 179 8)' },
	{ name: 'z5', power: ftp * 1.18, color: 'rgb(249 115 22)' },
	{ name: 'z6', power: 10000, color: 'rgb(239 68 68)' }
];
export function pwrToZone(power: number) {
	for (let i = 0; i < zones.length; i++) {
		if (power <= zones[i].power) {
			return i + 1;
		}
	}

	return 1;
}
