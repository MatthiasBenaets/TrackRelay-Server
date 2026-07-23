<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { refreshDuration } from '$lib/utils';
	import { fetchLiveData } from '$lib/api';
	import Playback from '$lib/components/Playback.svelte';
	import type { LiveData } from '$lib/types';

	let { component, overlays } = $props();

	let liveData: LiveData | undefined = $state();

	let isPlayback = $derived(page.url.searchParams.has('playback'));

	onMount(() => {
		if (!isPlayback) {
			const interval = setInterval(async () => {
				liveData = await fetchLiveData();
			}, refreshDuration);

			return () => clearInterval(interval);
		}
	});
</script>

{#if component}
	{@const Component = component}

	{#if isPlayback}
		<Playback>
			{#snippet children(playbackData)}
				<Component data={playbackData} />
			{/snippet}
		</Playback>
	{:else if liveData}
		<Component data={liveData} />
	{/if}
{:else}
	<div class="p-4 text-white">
		<p>Overlay not found</p>
		<p class="mt-2 font-bold">Available overlays:</p>
		{#if overlays.length > 0}
			<ul class="mt-2 space-y-1">
				{#each overlays as overlay (overlay)}
					<li>
						<a class="underline hover:text-blue-400" href={resolve(`/live/${overlay}`)}>
							{overlay}
						</a>
						<a
							class="ml-3 text-xs text-zinc-400 hover:text-white"
							href={resolve(`/live/${overlay}?playback=true`)}
						>
							(Playback mode)
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No overlays found</p>
		{/if}
	</div>
{/if}
