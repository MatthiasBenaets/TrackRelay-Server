<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchLiveData } from '$lib/api';
	import type { LiveData } from '$lib/types';

	let live: LiveData | undefined = $state();

	onMount(async () => {
		setInterval(async () => {
			live = await fetchLiveData();
		}, 1000);
	});
</script>

{JSON.stringify(live)}
