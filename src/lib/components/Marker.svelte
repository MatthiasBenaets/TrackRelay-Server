<script lang="ts">
	import { getContext, setContext, type Snippet } from 'svelte';
	import { tweened } from 'svelte/motion';
	import L from 'leaflet';
	import { env } from '$env/dynamic/public';

	let {
		width,
		height,
		latLng,
		children
	}: { width: number; height: number; latLng: L.LatLngExpression; children: Snippet } = $props();

	let marker: L.Marker | undefined = $state(undefined);
	let markerElement: HTMLElement | undefined = $state(undefined);

	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();

	// Tweened animation
	const tweenedLatLng = tweened(latLng, {
		duration: Number(env.PUBLIC_REFRESH_RATE) * 1000
	});

	// Create initial marker
	$effect(() => {
		if (map) {
			let icon = L.divIcon({
				html: markerElement,
				className: 'map-marker',
				iconSize: L.point(width, height)
			});
			marker = L.marker(latLng, { icon }).addTo(map);
		}
		return () => {
			marker?.remove();
			marker = undefined;
		};
	});

	// Update tweenedLatLng when latLng changes
	$effect(() => {
		if (latLng) {
			tweenedLatLng.set(latLng);
		}
	});

	// Update marker position during tweened animation
	$effect(() => {
		const unsubscribe = tweenedLatLng.subscribe((value) => {
			if (marker) {
				marker.setLatLng(value);
			}
		});
		return unsubscribe;
	});

	// Set context to retrieve marker in other components
	setContext('layer', {
		getLayer: () => marker
	});
</script>

{#if map && marker && children}
	<div bind:this={markerElement}>
		{@render children()}
	</div>
{/if}
