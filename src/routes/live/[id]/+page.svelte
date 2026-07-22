<script lang="ts">
	import Overlay from '$lib/components/Overlay.svelte';
	import type { Component } from 'svelte';
	let { data }: { data: { component: Component | null; overlays: string[] } } = $props();
</script>

<Overlay component={data.component} overlays={data.overlays} />
