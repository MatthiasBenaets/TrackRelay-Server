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
const zones = [ftp * 0.6, ftp * 0.75, ftp * 0.89, ftp * 1.04, ftp * 1.18, 10000];
export function pwrToZone(power: number) {
	for (let i = 0; i < zones.length; i++) {
		if (power <= zones[i]) {
			return i + 1;
		}
	}

	return 1;
}
