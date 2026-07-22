<script lang="ts">
	import { onMount } from 'svelte';
	import { MapLibre, Marker } from 'svelte-maplibre-gl';
	import mapStyle from '$lib/assets/tiles.json';
	import type { StyleSpecification } from 'maplibre-gl';

	let { data, className } = $props();
	let ready = $state(false);

	onMount(() => {
		ready = true;
	});
</script>

{#if ready}
	<MapLibre class={className} style={mapStyle as StyleSpecification} zoom={15}>
		<Marker lnglat={[data.lon, data.lat]} />
	</MapLibre>
{/if}
