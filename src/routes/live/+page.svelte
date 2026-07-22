<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center">
	<div class="text-center">
		<h1>Pick an overlay</h1>
		{#if data.overlays.length > 0}
			{#each data.overlays as overlay (overlay)}
				<p>
					<button>
						<a href={resolve(`/live/${overlay}`)}>
							{overlay}
						</a>
					</button>
				</p>
			{/each}
		{:else}
			<p>No overlays found</p>
		{/if}
	</div>
</div>
