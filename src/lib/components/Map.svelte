<script lang="ts">
	import { onMount } from 'svelte';
	import { MapLibre, Marker } from 'svelte-maplibre-gl';
	import mapStyle from '$lib/assets/tiles.json';
	import type { StyleSpecification } from 'maplibre-gl';
	import type { LiveData } from '$lib/types';

	let {
		data,
		className,
		zoom = 14
	}: { data: LiveData; className?: string; zoom?: number } = $props();
	let ready = $state(false);

	onMount(() => {
		ready = true;
	});
</script>

{#if ready}
	<MapLibre
		class={className || 'h-50 w-full'}
		style={mapStyle as StyleSpecification}
		{zoom}
		center={{ lng: data.lon, lat: data.lat }}
		attributionControl={false}
	>
		<Marker lnglat={[data.lon, data.lat]} />
	</MapLibre>
{/if}
