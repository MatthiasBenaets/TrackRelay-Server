<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { fetchLiveData } from '$lib/api';
	import { msToTime, pwrToZone } from '$lib/utils';
	import Map from '$lib/components/Map.svelte';
	import type { LiveData } from '$lib/types';

	let live: LiveData | undefined = $state();
	let toggle = $state(false);

	onMount(async () => {
		setInterval(async () => {
			live = await fetchLiveData();
		}, 1000);
	});
</script>

{#if live}
	<div class="absolute z-10 bg-white/70 p-2 text-sm">
		<h1>Live Tracking</h1>
		<p>Time: {msToTime(live.time)}</p>
		<p>Distance: {(live.dist / 1000).toFixed(2)} km</p>
		<p>Speed: {(live.spd * 3.6).toFixed(1)} km/h</p>
		{#if toggle}
			<p>Speed: {(live.spd * 2.237).toFixed(1)} mph</p>
		{/if}
		<p>Cadence: {live.cad / 2} rpm</p>
		<p>Heartrate: {live.hr} bpm</p>
		{#if toggle}
			<p>Calories: {live.cal} m</p>
		{/if}
		<p>Power: {live.pwr} W</p>
		<p>Power Zone: {pwrToZone(live.pwr)}</p>
		{#if toggle}
			<p>Average Power: {live.avgp} W</p>
		{/if}
		<p>Grade: {live.grd.toFixed(1)} %</p>
		{#if toggle}
			<p>Altitude: {live.alt.toFixed(0)} m</p>
			<p>Total Ascent: {live.asc.toFixed(0)} m</p>
			<p>Total Descent: {live.desc.toFixed(0)} m</p>

			<p>Latitude: {live.lat}</p>
			<p>Longitude: {live.lon}</p>
		{/if}
		<p>
			<button onclick={() => (toggle = !toggle)}>{toggle ? 'View Less' : 'View More'}</button>
		</p>
		<p>
			<button>
				<a
					href="https://www.google.com/maps/dir/?api=1&destination={live.lat},{live.lon}"
					target="_blank"
				>
					Navigate To
				</a>
			</button>
		</p>
		<p>
			<button>
				<a href={resolve('/live')}> Livestream </a>
			</button>
		</p>
	</div>

	<Map className="h-screen" data={live} />
{/if}
