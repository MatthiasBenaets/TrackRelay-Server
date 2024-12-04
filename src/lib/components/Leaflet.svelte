<script lang="ts">
	import {
		onMount,
		onDestroy,
		setContext,
		createEventDispatcher,
		tick,
		type Snippet
	} from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { env } from '$env/dynamic/public';

	let {
		view = undefined,
		zoom = undefined,
		classes = 'h-[100px] w-[100px]',
		children
	}: {
		view: L.LatLngExpression | undefined;
		zoom: number | undefined;
		classes?: string;
		children?: Snippet;
	} = $props();

	const dispatch = createEventDispatcher();

	let map: L.Map | undefined = $state(undefined);
	let mapElement: HTMLElement;

	// Initialize map
	onMount(async () => {
		if (!view || !zoom) return;

		if (!map && mapElement) {
			map = L.map(mapElement, {
				zoomControl: false,
				attributionControl: false
			})
				.on('zoom', (e) => dispatch('zoom', e))
				.on('popupopen', async (e) => {
					await tick();
					e.popup.update();
				});

			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: `&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> Contributors`
			}).addTo(map);

			map.setView(view, zoom);
		}
	});

	onDestroy(() => {
		map?.remove();
		map = undefined;
	});

	// Update map view
	$effect(() => {
		if (map && view && zoom) {
			map.panTo(view, {
				animate: true,
				duration: Number(env.PUBLIC_REFRESH_RATE),
				easeLinearity: 1
			});
		}
	});

	// Set context to retrieve map in other components
	setContext('map', {
		getMap: () => map
	});
</script>

<div class={classes} bind:this={mapElement}>
	{#if map && children}
		{@render children()}
	{/if}
</div>
