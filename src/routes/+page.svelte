<script lang="ts">
	import { env } from '$env/dynamic/public';

	let live = $state({
		type: 'id',
		lat: 0,
		lon: 0,
		spd: 0,
		alt: 0,
		time: 0,
		cad: 0,
		pwr: 0,
		avgp: 0,
		hr: 0,
		dist: 0,
		asc: 0,
		desc: 0,
		cal: 0,
		grd: 0
	});
	let ftp: number = Number(env.PUBLIC_FTP) | 0;
	let zones = [ftp * 0.6, ftp * 0.75, ftp * 0.89, ftp * 1.04, ftp * 1.18, 10000];
	let activeZone: number = $state(1);

	async function fetchLocation() {
		try {
			const response = await fetch('/api/live', {
				headers: {
					Authorization: env.PUBLIC_API_TOKEN || ''
				}
			});
			if (!response.ok) {
				throw new Error('Failed to fetch live activity data');
			}
			const data = await response.json();
			live = data;
		} catch (error) {
			console.error('Error fetching live activity data:', error);
		}
	}

	function msToTime(duration: number) {
		var seconds: string | number = Math.floor((duration / 1000) % 60),
			minutes: string | number = Math.floor((duration / (1000 * 60)) % 60),
			hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

		hours = hours < 10 ? '0' + hours : hours;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		seconds = seconds < 10 ? '0' + seconds : seconds;

		return hours + ':' + minutes + ':' + seconds;
	}

	function pwrToZone(power: number) {
		for (let i = 0; i < zones.length; i++) {
			if (power <= zones[i]) {
				return i + 1;
			}
		}

		return 1;
	}

	$effect(() => {
		activeZone = pwrToZone(live.pwr);
	});

	$effect(() => {
		fetchLocation();
		const intervalId = setInterval(fetchLocation, 2500);
		return () => clearInterval(intervalId);
	});
</script>

{#if live}
	<p>ID: {live.type}</p>
	<p>Latitude: {live.lat}</p>
	<p>Longitude: {live.lon}</p>
	<p>Altitude: {live.alt}</p>
	<p>Time: {msToTime(live.time)}</p>
	<p>Distance: {live.dist / 1000} km</p>
	<p>Speed: {live.spd * 3.6} km/h</p>
	<p>Speed: {live.spd * 2.237} mph</p>
	<p>Cadence: {live.cad / 2} rpm</p>
	<p>Heartrate: {live.hr} bpm</p>
	<p>Power: {live.pwr} W</p>
	<p>Average Power: {live.avgp} W</p>
	<p>Total Ascent: {live.asc} m</p>
	<p>Total Descent: {live.asc} m</p>
	<p>Calories: {live.cal} m</p>
	<p>Grade: {live.grd}</p>
	<p>Power Zone: {activeZone}</p>
{/if}
