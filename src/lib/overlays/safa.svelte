<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { quadOut } from 'svelte/easing';
	import { page } from '$app/state';
	import Grade from '$lib/components/Grade.svelte';
	import Path from '$lib/components/Path.svelte';
	import type { LiveData } from '$lib/types';

	let {
		data,
		path = [],
		gradient = [],
		index = 0
	}: {
		data: LiveData;
		path?: [number, number][];
		gradient?: [number, number][];
		index?: number;
	} = $props();

	let tweenKm = new Tween(0, { duration: 1000, easing: quadOut });
	let tweenMph = new Tween(0, { duration: 1000, easing: quadOut });
	let tweenAlt = new Tween(0, { duration: 1000, easing: quadOut });
	let tweenGrd = new Tween(0, { duration: 1000, easing: quadOut });
	let tweenPwr = new Tween(0, { duration: 1000, easing: quadOut });

	let playback = page.url.searchParams.get('playback');

	$effect(() => {
		if (!data) return;

		tweenKm.set(data.spd ?? 0);
		tweenMph.set(data.spd ?? 0);
		tweenAlt.set(data.alt ?? 0);
		tweenGrd.set(data.grd ?? 0);
		tweenPwr.set(data.pwr ?? 0);
	});
</script>

<div class="poppins-bold absolute h-full w-full">
	{#if playback}
		<Path data={path} pos={index} />
	{/if}
	<div class="absolute top-1/2 left-[5%] -translate-y-1/2 text-white">
		<span class="text-2xl">KMH</span>
		<div class="text-6xl">
			{Math.round(tweenKm.current * 3.6)}
		</div>
		<span class="text-2xl">MPH</span>
		<div class="text-6xl">
			{Math.round(tweenMph.current * 2.237)}
		</div>
		<span class="text-2xl">PWR</span>
		<div class="text-6xl">
			{Math.round(tweenPwr.current)}
		</div>
	</div>
	{#if playback}
		<div class="absolute bottom-0 left-0 overflow-hidden">
			<Grade data={gradient} pos={index} alt={tweenAlt.current / 1000} />
		</div>
		<div
			class="absolute bottom-[1%] left-[1.5%] flex flex-col text-white drop-shadow-[0px_0px_2px_black]"
		>
			<span class="text-xl">GRADE</span>
			<span class="-mt-1.5 text-3xl">
				{Math.round(tweenGrd.current)} %
			</span>
		</div>
	{/if}
</div>
