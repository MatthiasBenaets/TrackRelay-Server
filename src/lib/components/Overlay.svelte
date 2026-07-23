<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { refreshDuration } from '$lib/utils';
	import { fetchLiveData } from '$lib/api';
	import type { LiveData } from '$lib/types';

	let { component, overlays } = $props();

	let liveData: LiveData | undefined = $state();

	onMount(() => {
		setInterval(async () => {
			liveData = await fetchLiveData();
		}, refreshDuration);
	});
</script>

{#if component}
	{#if liveData}
		{@const Component = component}
		<Component data={liveData} />
	{/if}
{:else}
	<p>Overlay not found</p>
	<p>Available overlays:</p>
	{#if overlays.length > 0}
		{#each overlays as overlay (overlay)}
			<p>
				<a href={resolve(`/live/${overlay}`)}>
					{overlay}
				</a>
			</p>
		{/each}
	{:else}
		<p>No overlays found</p>
	{/if}
{/if}
