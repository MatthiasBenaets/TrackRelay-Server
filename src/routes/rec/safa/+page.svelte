<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { quadOut } from 'svelte/easing';
	import { fitToJson } from '$lib/utils';
	import Grade from '$lib/components/Grade.svelte';
	import Path from '$lib/components/Path.svelte';
	import { calculateGrade } from '$lib/utils';
	import type { FitData, DataPoint } from '$lib/types';

	let data: FitData | undefined = $state(undefined);
	let records: DataPoint[] | undefined = undefined;
	let gradient: [number, number][] = $state([]);
	let path: [number, number][] = $state([]);
	let paused = true;
	let x = $state(0);
	let interval: number | undefined = undefined;

	let tweenKm = tweened(0, { duration: 1000, easing: quadOut });
	let tweenMph = tweened(0, { duration: 1000, easing: quadOut });
	let tweenAlt = tweened(0, { duration: 1000, easing: quadOut });
	let tweenGrd = tweened(0, { duration: 1000, easing: quadOut });

	// Convert FIT file
	const parseFile = async (event: Event) => {
		const fileInput = event.target as HTMLInputElement;
		const file = fileInput.files?.[0];
		const reader = new FileReader();

		// Process data for component props
		reader.onload = async () => {
			try {
				let fileContent = new Uint8Array(reader.result as ArrayBuffer);
				data = await fitToJson(fileContent);

				if (data) {
					records = data?.activity.sessions[0].laps[0].records;

					gradient =
						records
							.map((record) => {
								if (record.enhanced_altitude) {
									return [record.distance * 1000, record.enhanced_altitude * 1000] as [
										number,
										number
									];
								} else if (record.altitude) {
									return [record.distance * 1000, record.altitude] as [number, number];
								}
								return undefined;
							})
							.filter((record): record is [number, number] => record !== undefined) ?? [];

					path =
						records
							.filter((record) => record.position_lat !== undefined)
							.map((record: DataPoint) => {
								return [record.position_lat, record.position_long];
							})
							.filter((record): record is [number, number] => record !== undefined) ?? [];
				}
			} catch (error) {
				console.error('Error parsing FIT file:', error);
			}
		};

		if (file) {
			reader.readAsArrayBuffer(file);
		}
	};

	// Keyboard controls
	document.onkeyup = function (e) {
		if (e.code == 'Space' && records) {
			paused = !paused;
			if (!paused) {
				interval = setInterval(() => {
					x++;
					if (records) {
						tweenKm.set(records[x].enhanced_speed);
						tweenMph.set(records[x].enhanced_speed / 1.609344);
						tweenAlt.set(records[x].enhanced_altitude);
						tweenGrd.set(
							calculateGrade(
								records[x - 5 >= 0 ? x - 5 : x].enhanced_altitude,
								records[x + 5 < records.length ? x + 5 : x].enhanced_altitude,
								records[x - 5 >= 0 ? x - 5 : x].distance,
								records[x + 5 < records.length ? x + 5 : x].distance
							)
						);
					}
				}, 1000);
			} else {
				clearInterval(interval);
			}
		}
		if ((e.code == 'ArrowRight' || e.code == 'KeyN') && data) {
			x = x + 60;
		}
		if ((e.code == 'ArrowLeft' || e.code == 'KeyP') && data) {
			x = x - 60;
		}
		e.preventDefault();
	};
</script>

<div class="poppins-bold absolute h-full w-full">
	{#if !data}
		<input
			type="file"
			name="fit"
			form="activity"
			accept=".fit"
			onchange={parseFile}
			class="mb-10 text-white"
		/>
	{:else if gradient.length > 0 && path.length > 0}
		<Path data={path} pos={x} />
		<div class="absolute left-[2.5%] top-1/2 -translate-y-1/2 transform text-white">
			<span class="text-3xl">KMH</span>
			<div class="text-8xl">
				{Math.round($tweenKm)}
			</div>
			<span class="text-3xl">MPH</span>
			<div class="text-8xl">
				{Math.round($tweenMph)}
			</div>
		</div>
		<div class="absolute bottom-0 left-0 overflow-hidden">
			<Grade data={gradient} pos={x} alt={$tweenAlt} />
		</div>
		<div class="absolute bottom-[10%] left-[2.5%]">
			<span class="text-3xl text-white drop-shadow-[0px_0px_5px_black]">
				{Math.round($tweenGrd)} %
			</span>
		</div>
	{/if}
</div>
