<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { untrack } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';
	import { msToTime, pwrToZone, refreshDuration, zones } from '$lib/utils';
	import { fetchLocationData } from '$lib/api';
	import { Clock, Flame, Gauge, Heart, MountainSnow, RefreshCw, Route, Zap } from '@lucide/svelte';
	import Map from '$lib/components/Map.svelte';
	import Graph from '$lib/components/Graph.svelte';
	import Distribution from '$lib/components/Distribution.svelte';

	import type { LiveData, LocationData } from '$lib/types';

	let { data }: { data: LiveData } = $props();

	let pwrGraph: number[] = $state(Array(240).fill(0));
	let pwrDist: number[] = $state([]);
	let hrGraph: number[] = $state(Array(240).fill(0));

	let location: LocationData | undefined = $state(undefined);

	let zone = $state(1);
	let zoneColor = $state('rgb(107 114 128)');

	let tweenAlt = new Tween(0, { duration: refreshDuration, easing: sineInOut });
	let tweenTime = new Tween(0, { duration: refreshDuration });
	let tweenDist = new Tween(0, { duration: refreshDuration });
	let tweenSpd = new Tween(0, { duration: refreshDuration });
	let tweenCad = new Tween(0, { duration: refreshDuration, easing: sineInOut });
	let tweenHr = new Tween(0, { duration: refreshDuration });
	let tweenPwr = new Tween(0, { duration: refreshDuration, easing: sineInOut });
	let tweenAsc = new Tween(0, { duration: refreshDuration });
	let tweenCal = new Tween(0, { duration: refreshDuration });
	let tweenGrd = new Tween(0, { duration: refreshDuration });

	$effect(() => {
		if (!data) return;

		async function loadLocation() {
			location = await fetchLocationData(data.lat, data.lon);
		}

		loadLocation();
	});

	$effect(() => {
		if (!data) return;

		tweenAlt.set(data.alt ?? 0);
		tweenTime.set(data.time ?? 0);
		tweenDist.set(data.dist ?? 0);
		tweenSpd.set(data.spd ?? 0);
		tweenCad.set(data.cad ?? 0);
		tweenHr.set(data.hr ?? 0);
		tweenPwr.set(data.pwr ?? 0);
		tweenAsc.set(data.asc ?? 0);
		tweenCal.set(data.cal ?? 0);
		tweenGrd.set(data.grd ?? 0);

		if (data.pwr) {
			zone = pwrToZone(data.pwr);
			zoneColor = zones[zone - 1].color;
		}
	});

	$effect(() => {
		const pwr = data.pwr ?? 0;
		const hr = data.hr ?? 0;
		untrack(() => {
			pwrGraph = [...pwrGraph.slice(1), pwr];
			hrGraph = [...hrGraph.slice(1), hr];
			pwrDist = [...pwrDist, pwr];
		});
	});
</script>

{#if data}
	<div class="poppins-bold relative h-270 w-[1920px] text-white">
		<!-- Left data field -->
		<div class="absolute top-[2%] left-[1%] h-[25%] w-[17%] rounded-xl bg-black/75">
			<div class="relative h-full w-full px-5">
				<div class="flex h-[30%] flex-row">
					<Zap class="h-full w-1/5" style="color: {zoneColor}" />
					<div class="flex w-4/5 items-center justify-end">
						<div class="flex flex-row items-end">
							<span class="text-7xl">{Math.round(tweenPwr.current)}</span>
							<span class="pb-1 text-4xl">W</span>
						</div>
					</div>
				</div>
				<div class="h-[20%]">
					<Distribution pwr={pwrDist} />
				</div>
				<div class="grid h-[50%] grid-cols-2 gap-x-10">
					<div class="flex flex-row justify-between">
						<div class="flex w-1/3 justify-center align-middle">
							<RefreshCw size={35} />
						</div>
						<div class="flex w-2/3 flex-col text-right">
							<span class="-m-1 text-3xl">
								{Math.round(tweenCad.current * Number(env.PUBLIC_CADENCE_MULTIPLIER))}
							</span>
							<span class="-m-1 text-xl">RPM</span>
						</div>
					</div>

					<div class="flex flex-row justify-between">
						<div class="flex w-1/3 justify-center align-middle">
							<Heart size={35} />
						</div>
						<div class="flex w-2/3 flex-col text-right">
							<span class="-m-1 text-3xl">{Math.round(tweenHr.current)}</span>
							<span class="-m-1 text-xl">BPM</span>
						</div>
					</div>

					<div class="flex flex-row justify-between">
						<div class="flex w-1/3 justify-center align-middle">
							<MountainSnow size={35} />
						</div>
						<div class="flex w-2/3 flex-col text-right">
							<span class="-m-1 text-3xl">{Math.round(tweenAlt.current)}</span>
							<span class="-m-1 text-xl">ALT</span>
						</div>
					</div>

					<div class="flex flex-row justify-between">
						<div class="flex w-1/3 justify-center align-middle">
							<Flame size={35} />
						</div>
						<div class="flex w-2/3 flex-col text-right">
							<span class="-m-1 text-3xl">{Math.round(tweenCal.current)}</span>
							<span class="-m-1 text-xl">CAL</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Middle data field -->
		<div class="absolute top-[2%] h-[7%] w-full">
			<div class="relative mx-auto h-full w-[40%] rounded-xl bg-black/75">
				<div class="mx-5 grid h-full auto-cols-max grid-flow-col justify-between">
					<div class="flex flex-row items-center justify-center">
						<div class="text-4xl">{(tweenSpd.current * 3.6).toFixed(1)}</div>
						<div class="flex flex-col items-center pl-2">
							<Gauge size={24} />
							<span class="text-md">KM/H</span>
						</div>
					</div>
					<div class="flex flex-row items-center justify-center">
						<div class="text-4xl">{(tweenDist.current / 1000).toFixed(1)}</div>
						<div class="flex flex-col items-center pl-2">
							<Route size={24} />
							<span class="text-md">KM</span>
						</div>
					</div>
					<div class="flex flex-row items-center justify-center">
						<div class="text-4xl">{Math.round(tweenAsc.current)}</div>
						<div class="flex flex-col items-center pl-2">
							<MountainSnow size={24} />
							<span class="text-md">M</span>
						</div>
					</div>
					<div class="flex flex-row items-center justify-center">
						<div class="truncate text-4xl">{msToTime(tweenTime.current)}</div>
						<div class="flex flex-col items-center pl-2">
							<Clock size={24} />
							<span class="text-md">ET</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right data field -->
		<div
			class="absolute top-[2%] right-[1%] h-[25%] w-[17%] overflow-hidden rounded-xl bg-black/50"
		>
			<div class="relative z-0 overflow-hidden rounded-xl">
				<Map className="w-full h-75" {data} zoom={14} />
			</div>
			<div class="absolute top-0 z-10 h-6 w-full bg-black/50 px-5">
				{#if location}
					<div>{location.address.town || location.address.village}, {location.address.country}</div>
				{:else}
					<div>Retrieving location...</div>
				{/if}
			</div>
			<div class="absolute top-8 right-2 z-12 flex items-end justify-end">
				<div class="font-outline-2 flex flex-row font-bold text-white">
					<span
						class="z-10 text-4xl"
						style="color: {tweenGrd.current >= 8
							? zones[5].color
							: tweenGrd.current >= 4
								? zones[3].color
								: 'white'}">{Math.round(tweenGrd.current)}</span
					>
					<span class="font-outline-2 z-10 text-2xl"> % </span>
					<div class="absolute top-9 right-2 z-0">
						<svg
							width="50"
							height={Math.tan((Math.max(-20, Math.min(20, tweenGrd.current)) * Math.PI) / 180) *
								50 *
								2.5}
							style="overflow: visible;"
						>
							<polygon
								points="
              0,0
              50,0
              50,{-Math.tan((Math.max(-20, Math.min(20, tweenGrd.current)) * Math.PI) / 180) *
									50 *
									2.5}
            "
								fill="black"
								stroke="white"
								stroke-width="1"
							/>
						</svg>
					</div>
				</div>
			</div>
			<div class="absolute bottom-0 z-10 flex h-6 w-full flex-row justify-between bg-black/50 px-5">
				<span>{env.PUBLIC_ATHLETE}</span>
				<span
					style="color: {tweenPwr.current / Number(env.PUBLIC_WEIGHT) >= 8
						? zones[5].color
						: 'white'}">{(tweenPwr.current / Number(env.PUBLIC_WEIGHT)).toFixed(1)} w/kg</span
				>
			</div>
		</div>

		<!-- Bottom graph field -->
		<div class="absolute bottom-0 left-0 text-white opacity-75">
			<div class="absolute -top-3 left-2">PWR</div>
			<div class="absolute -top-3 right-2">HR</div>
			<Graph pwr={pwrGraph} hr={hrGraph} />
		</div>
	</div>
{/if}
