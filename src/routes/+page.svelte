<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Leaflet from '$lib/components/Leaflet.svelte';
	import Marker from '$lib/components/Marker.svelte';

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
		const intervalId = setInterval(fetchLocation, Number(env.PUBLIC_REFRESH_RATE) * 1000);
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

<Leaflet view={[live.lat, live.lon]} zoom={15} classes="w-full h-[300px]">
	<Marker latLng={[live.lat, live.lon]} width={40} height={40}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="fill-red-600 stroke-white stroke-2"
			><path
				d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
			/><circle cx="12" cy="10" r="3" /></svg
		>
	</Marker>
</Leaflet>
