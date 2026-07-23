<script lang="ts">
	import { fitToJson, calculateGrade, liveDataSchema } from '$lib/utils';
	import type { FitData, DataPoint, LiveData } from '$lib/types';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet<[LiveData]> } = $props();

	let data = $state<FitData | undefined>();
	let records = $state<DataPoint[]>([]);
	let currentIndex = $state(0);
	let paused = $state(true);
	let interval: number | undefined = undefined;
	let showMenu = $state(true);

	const defaultLiveData = liveDataSchema.parse({ type: 'playback' });

	$effect(() => {
		if (records.length) {
			showMenu = true;
			const timer = setTimeout(() => {
				showMenu = false;
			}, 5000);
			return () => clearTimeout(timer);
		}
	});

	let currentLiveData: LiveData | undefined = $derived.by(() => {
		if (!records.length || currentIndex >= records.length) return undefined;
		const current = records[currentIndex];

		const prevIdx = Math.max(0, currentIndex - 5);
		const nextIdx = Math.min(records.length - 1, currentIndex + 5);
		const prev = records[prevIdx];
		const next = records[nextIdx];

		const altPrev = prev.enhanced_altitude ?? prev.altitude ?? 0;
		const altNext = next.enhanced_altitude ?? next.altitude ?? 0;
		const distPrev = prev.distance ?? 0;
		const distNext = next.distance ?? 0;
		const grd = calculateGrade(altPrev, altNext, distPrev, distNext);

		let pwrSum = 0;
		for (let i = 0; i <= currentIndex; i++) {
			pwrSum += records[i].power ?? 0;
		}
		const avgp = Math.round(pwrSum / (currentIndex + 1));

		const elapsedSeconds = current.timer_time ?? current.elapsed_time ?? currentIndex;

		return {
			type: 'playback',
			lat: current.position_lat ?? 0,
			lon: current.position_long ?? 0,
			alt: current.enhanced_altitude ?? current.altitude ?? 0,
			time: elapsedSeconds * 1000,
			dist: current.distance ?? 0,
			spd: current.enhanced_speed ?? current.speed ?? 0,
			cad: current.cadence ?? 0,
			hr: current.heart_rate ?? 0,
			pwr: current.power ?? 0,
			avgp: avgp,
			asc: current.total_ascent ?? 0,
			desc: current.total_descent ?? 0,
			cal: current.calories ?? Math.round((current.accumulated_power ?? 0) / 1000),
			grd: grd
		};
	});

	let activeLiveData = $derived(currentLiveData ?? defaultLiveData);

	const parseFile = async (event: Event) => {
		const fileInput = event.target as HTMLInputElement;
		const file = fileInput.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = async () => {
			try {
				const fileContent = new Uint8Array(reader.result as ArrayBuffer);
				data = await fitToJson(fileContent);
				const extractedRecords =
					data?.activity?.sessions?.[0]?.laps?.[0]?.records ||
					data?.activity?.sessions?.[0]?.records ||
					data?.records;

				if (extractedRecords?.length) {
					records = extractedRecords;
					currentIndex = 0;
				}
			} catch (error) {
				console.error('Error parsing FIT file:', error);
			}
		};
		reader.readAsArrayBuffer(file);
	};

	function togglePlay() {
		if (!records.length) return;
		paused = !paused;
		if (!paused) {
			interval = window.setInterval(() => {
				if (currentIndex < records.length - 1) {
					currentIndex++;
				} else {
					paused = true;
					clearInterval(interval);
				}
			}, 1000);
		} else {
			clearInterval(interval);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!records.length) return;

		if (e.code === 'Space') {
			e.preventDefault();
			togglePlay();
		} else if (e.code === 'ArrowRight' || e.code === 'KeyN') {
			e.preventDefault();
			currentIndex = Math.min(records.length - 1, currentIndex + 60);
		} else if (e.code === 'ArrowLeft' || e.code === 'KeyP') {
			e.preventDefault();
			currentIndex = Math.max(0, currentIndex - 60);
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if activeLiveData}
	{@render children(activeLiveData)}
{/if}

{#if !records.length}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 text-white backdrop-blur-[1px]"
	>
		<label
			class="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 bg-zinc-900/90 p-8 shadow-2xl transition-colors hover:border-zinc-400 hover:bg-zinc-900"
		>
			<span class="text-lg font-bold">Upload FIT File for Playback</span>
			<input type="file" accept=".fit" onchange={parseFile} class="hidden" />
		</label>
	</div>
{:else if currentLiveData}
	<div
		class="fixed top-4 right-4 z-50 flex items-center gap-4 rounded-lg bg-black/80 p-3 text-white backdrop-blur transition-opacity duration-500 {showMenu
			? 'opacity-100'
			: 'opacity-0 hover:opacity-100'}"
	>
		<button onclick={togglePlay} class="rounded bg-white/20 px-3 py-1 font-mono hover:bg-white/30">
			{paused ? '▶ Play' : '⏸ Pause'}
		</button>
		<span class="font-mono text-sm">
			{currentIndex + 1} / {records.length}s
		</span>
	</div>
{/if}
