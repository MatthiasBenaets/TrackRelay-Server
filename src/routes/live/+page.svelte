<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
	<div class="text-center">
		<h1 class="mb-6 text-2xl font-bold">Pick an overlay</h1>
		{#if data.overlays.length > 0}
			<div class="space-y-3">
				{#each data.overlays as overlay (overlay)}
					<div class="flex items-center justify-center gap-3">
						<p>
							{overlay.charAt(0).toUpperCase() + overlay.slice(1)}
						</p>
						<a
							href={resolve(`/live/${overlay}`)}
							class="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
						>
							Live
						</a>
						<a
							href={resolve(`/live/${overlay}?playback=true`)}
							class="rounded-lg bg-zinc-800 px-4 py-2 font-medium hover:bg-zinc-700"
						>
							Playback
						</a>
					</div>
				{/each}
			</div>
		{:else}
			<p>No overlays found</p>
		{/if}
	</div>
</div>
