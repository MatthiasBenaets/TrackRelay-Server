<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { quadOut } from 'svelte/easing';
	import { env } from '$env/dynamic/public';
	import Leaflet from '$lib/components/Leaflet.svelte';
	import Marker from '$lib/components/Marker.svelte';
	import { msToTime, pwrToZone, zones } from '$lib/utils';
	import { fetchLiveData, fetchLocationData } from '$lib/api';
	import type { LiveData, LocationData } from '$lib/types';
	import Graph from '$lib/components/Graph.svelte';
	import Distribution from '$lib/components/Distribution.svelte';

	let pwrGraph: number[] = $state(Array(240).fill(0));
	let pwrDist: number[] = $state([]);
	let hrGraph: number[] = $state(Array(240).fill(0));

	let location: LocationData | undefined = $state(undefined);

	let zone = $state(1);
	let zoneColor = $state('rgb(107 114 128)');

	let live: LiveData = $state({
		type: 'id',
		lat: 0,
		lon: 0,
		alt: 0,
		time: 0,
		dist: 0,
		spd: 0,
		cad: 0,
		hr: 0,
		pwr: 0,
		avgp: 0,
		asc: 0,
		desc: 0,
		cal: 0,
		grd: 0
	});

	let tweenAlt = tweened(0, {
		duration: Number(env.PUBLIC_REFRESH_RATE) * 1000,
		easing: quadOut
	});
	let tweenTime = tweened(0, { duration: Number(env.PUBLIC_REFRESH_RATE) * 1000 });
	let tweenDist = tweened(0, { duration: Number(env.PUBLIC_REFRESH_RATE) * 1000 });
	let tweenSpd = tweened(0, {
		duration: Number(env.PUBLIC_REFRESH_RATE) * 1000
	});
	let tweenCad = tweened(0, {
		duration: Number(env.PUBLIC_REFRESH_RATE) * 1000,
		easing: quadOut
	});
	let tweenHr = tweened(0, { duration: Number(env.PUBLIC_REFRESH_RATE) * 1000 });
	let tweenPwr = tweened(0, {
		duration: Number(env.PUBLIC_REFRESH_RATE) * 1000,
		easing: quadOut
	});
	let tweenAsc = tweened(0, { duration: Number(env.PUBLIC_REFRESH_RATE) * 1000 });
	let tweenCal = tweened(0, { duration: Number(env.PUBLIC_REFRESH_RATE) * 1000 });
	let tweenGrd = tweened(0, { duration: Number(env.PUBLIC_REFRESH_RATE) * 1000 });

	setInterval(
		async () => {
			live = await fetchLiveData();
			tweenAlt.set(live.alt);
			tweenTime.set(live.time);
			tweenDist.set(live.dist);
			tweenSpd.set(live.spd);
			tweenCad.set(live.cad);
			tweenHr.set(live.hr);
			tweenPwr.set(live.pwr);
			tweenAsc.set(live.asc);
			tweenCal.set(live.cal);
			tweenGrd.set(live.grd);
			pwrGraph.push(live.pwr);
			pwrDist.push(live.pwr);
			hrGraph.push(live.hr);
		},
		Number(env.PUBLIC_REFRESH_RATE) * 1000
	);

	setInterval(
		async () => {
			let response: LocationData = await fetchLocationData(live.lat, live.lon);
			location = response;
		},
		Number(env.PUBLIC_REFRESH_RATE) * 120000
	);

	$effect(() => {
		if (live.pwr) {
			zone = pwrToZone(live.pwr);
			zoneColor = zones[zone - 1].color;
		}
	});
</script>

{#if live}
	<div class="poppins-bold relative h-[1080px] w-[1920px] text-white">
		<!-- Left data field -->
		<div class="absolute left-[1%] top-[2%] h-[25%] w-[17%] rounded-xl bg-black/75">
			<div class="relative h-full w-full px-5">
				<div class="flex h-[30%] flex-row">
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
						class="h-full w-1/5"
						style="color: {zoneColor}"
					>
						<path
							d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
						/>
					</svg>
					<div class="flex w-4/5 items-center justify-end">
						<div class="flex flex-row items-end">
							<span class="text-7xl">{Math.round($tweenPwr)}</span>
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
								class="h-[35px] w-[35px]"
							>
								<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
								<path d="M21 3v5h-5" />
								<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
								<path d="M8 16H3v5" />
							</svg>
						</div>
						<div class="flex w-2/3 flex-col text-right">
							<span class="-m-1 text-3xl">
								{Math.round($tweenCad * Number(env.PUBLIC_CADENCE_MULTIPLIER))}
							</span>
							<span class="-m-1 text-xl">RPM</span>
						</div>
					</div>

					<div class="flex flex-row justify-between">
						<div class="flex w-1/3 justify-center align-middle">
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
								class="h-[35px] w-[35px]"
							>
								<path
									d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
								/>
							</svg>
						</div>
						<div class="flex w-2/3 flex-col text-right">
							<span class="-m-1 text-3xl">{Math.round($tweenHr)}</span>
							<span class="-m-1 text-xl">BPM</span>
						</div>
					</div>

					<div class="flex flex-row justify-between">
						<div class="flex w-1/3 justify-center align-middle">
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
								class="h-[35px] w-[35px]"
							>
								<path d="m8 3 4 8 5-5 5 15H2L8 3z" />
								<path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
							</svg>
						</div>
						<div class="flex w-2/3 flex-col text-right">
							<span class="-m-1 text-3xl">{Math.round($tweenAlt)}</span>
							<span class="-m-1 text-xl">ALT</span>
						</div>
					</div>

					<div class="flex flex-row justify-between">
						<div class="flex w-1/3 justify-center align-middle">
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
								class="h-[35px] w-[35px]"
							>
								<path
									d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
								/>
							</svg>
						</div>
						<div class="flex w-2/3 flex-col text-right">
							<span class="-m-1 text-3xl">{Math.round($tweenCal)}</span>
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
						<div class="text-4xl">{($tweenSpd * 3.6).toFixed(1)}</div>
						<div class="flex flex-col items-center pl-2">
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
							>
								<path d="m12 14 4-4" />
								<path d="M3.34 19a10 10 0 1 1 17.32 0" />
							</svg>
							<span class="text-md">KM/H</span>
						</div>
					</div>
					<div class="flex flex-row items-center justify-center">
						<div class="text-4xl">{($tweenDist / 1000).toFixed(1)}</div>
						<div class="flex flex-col items-center pl-2">
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
							>
								<circle cx="6" cy="19" r="3" />
								<path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
								<circle cx="18" cy="5" r="3" />
							</svg>
							<span class="text-md">KM</span>
						</div>
					</div>
					<div class="flex flex-row items-center justify-center">
						<div class="text-4xl">{Math.round($tweenAsc)}</div>
						<div class="flex flex-col items-center pl-2">
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
							>
								<path d="m8 3 4 8 5-5 5 15H2L8 3z" />
								<path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
							</svg>
							<span class="text-md">M</span>
						</div>
					</div>
					<div class="flex flex-row items-center justify-center">
						<div class="truncate text-4xl">{msToTime($tweenTime)}</div>
						<div class="flex flex-col items-center pl-2">
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
							>
								<circle cx="12" cy="12" r="10" />
								<polyline points="12 6 12 12 16 14" />
							</svg>
							<span class="text-md">ET</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right data field -->
		<div
			class="absolute right-[1%] top-[2%] h-[25%] w-[17%] overflow-hidden rounded-xl bg-black/50"
		>
			<div class="relative z-0 overflow-hidden rounded-xl">
				<Leaflet view={[live.lat, live.lon]} zoom={15} classes="w-full h-[300px]">
					<Marker latLng={[live.lat, live.lon]} width={60} height={60}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="60"
							height="60"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="fill-orange-600 stroke-white stroke-2 pb-[25px]"
						>
							<path
								d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
							/>
							<circle cx="12" cy="10" r="3" />
						</svg>
					</Marker>
				</Leaflet>
			</div>
			<div class="absolute top-0 z-10 h-6 w-full bg-black/50 px-5">
				{#if location}
					<div>{location.address.town || location.address.village}, {location.address.country}</div>
				{:else}
					<div>Retrieving location...</div>
				{/if}
			</div>
			<div class="z-12 absolute right-2 top-8 flex items-end justify-end">
				<div class="font-outline-2 flex flex-row font-bold text-white">
					<span
						class="z-10 text-4xl"
						style="color: {$tweenGrd >= 8
							? zones[5].color
							: $tweenGrd >= 4
								? zones[3].color
								: 'white'}">{Math.round($tweenGrd)}</span
					>
					<span class="font-outline-2 z-10 text-2xl"> % </span>
					<div class="absolute right-2 top-9 z-0">
						<svg
							width="50"
							height={Math.tan((Math.max(-20, Math.min(20, $tweenGrd)) * Math.PI) / 180) * 50 * 2.5}
							style="overflow: visible;"
						>
							<polygon
								points="
              0,0
              50,0
              50,{-Math.tan((Math.max(-20, Math.min(20, $tweenGrd)) * Math.PI) / 180) * 50 * 2.5}
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
				<span style="color: {$tweenPwr / Number(env.PUBLIC_WEIGHT) >= 8 ? zones[5].color : 'white'}"
					>{($tweenPwr / Number(env.PUBLIC_WEIGHT)).toFixed(1)} w/kg</span
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
