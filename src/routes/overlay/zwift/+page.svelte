<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Leaflet from '$lib/components/Leaflet.svelte';
	import Marker from '$lib/components/Marker.svelte';
	import { msToTime, pwrToZone } from '$lib/utils';
	import { fetchLiveData } from '$lib/api';
	import type { LiveData } from '$lib/types';

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

	setInterval(
		async () => {
			live = await fetchLiveData();
		},
		Number(env.PUBLIC_REFRESH_RATE) * 1000
	);
</script>

{#if live}
	<div class="poppins-bold relative h-[1080px] w-[1920px] text-white">
		<div class="absolute left-[1%] top-[2%] h-[25%] w-[17%] rounded-xl bg-black/50">
			<div class="relative h-full w-full px-5">
				<div class="flex h-[40%] flex-row">
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
						class:text-gray-500={pwrToZone(live.pwr) === 1}
						class:text-blue-500={pwrToZone(live.pwr) === 2}
						class:text-green-500={pwrToZone(live.pwr) === 3}
						class:text-yellow-500={pwrToZone(live.pwr) === 4}
						class:text-orange-500={pwrToZone(live.pwr) === 5}
						class:text-red-500={pwrToZone(live.pwr) === 6}
					>
						<path
							d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
						/>
					</svg>
					<div class="flex w-4/5 items-center justify-end">
						<div class="flex flex-row items-end">
							<span class="text-7xl">{live.pwr}</span>
							<span class="pb-1 text-4xl">W</span>
						</div>
					</div>
				</div>
				<div class="grid h-[60%] grid-cols-2 gap-x-10">
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
							<span class="-m-1 text-3xl">{live.cad / 2}</span>
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
							<span class="-m-1 text-3xl">{live.hr}</span>
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
							<span class="-m-1 text-3xl">{Math.round(live.alt * 1)}</span>
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
							<span class="-m-1 text-3xl">{live.cal}</span>
							<span class="-m-1 text-xl">CAL</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="absolute top-[2%] h-[10%] w-full">
			<div class="relative mx-auto h-full w-[40%] rounded-xl bg-black/50 p-5">
				<div class="flex h-full w-full flex-row">
					<div class="flex w-1/4 flex-row items-center">
						<div class="text-4xl">{(live.spd * 3.6).toFixed(1)}</div>
						<div class="flex flex-col">
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
								class=""><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg
							>
							<span>KM/H</span>
						</div>
					</div>
					<div class="flex w-1/4 flex-row items-center">
						<div class="text-4xl">{(live.dist / 1000).toFixed(1)}</div>
						<div class="flex flex-col">
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
								class="lucide lucide-route"
								><circle cx="6" cy="19" r="3" /><path
									d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"
								/><circle cx="18" cy="5" r="3" /></svg
							>
							<span>KM</span>
						</div>
					</div>
					<div class="flex w-1/4 flex-row items-center">
						<div class="text-4xl">{Math.round(live.asc * 1)}</div>
						<div class="flex flex-col">
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
								class="lucide lucide-mountain-snow"
								><path d="m8 3 4 8 5-5 5 15H2L8 3z" /><path
									d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"
								/></svg
							>
							<span>M</span>
						</div>
					</div>
					<div class="flex w-1/4 flex-row items-center">
						<div class="text-4xl">{msToTime(live.time)}</div>
						<div class="flex flex-col">
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
								class="lucide lucide-clock"
								><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg
							>
							<span>ET.</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="absolute right-[1%] top-[2%] h-[25%] w-[20%] rounded-xl bg-black/50 text-black">
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
							><path
								d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
							/><circle cx="12" cy="10" r="3" /></svg
						>
					</Marker>
				</Leaflet>
			</div>
			<div class="font-outline-2 absolute right-2 top-2 z-10 font-bold text-white">
				<span class="text-4xl">{Math.round(live.grd * 1)}</span>
				<span class="font-outline-2 text-2xl"> % </span>
			</div>
		</div>
	</div>
{/if}
