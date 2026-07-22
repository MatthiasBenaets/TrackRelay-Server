import { getOverlays } from '$lib/utils';
import type { Component } from 'svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const component = await import(`$lib/overlays/${params.id}.svelte`);
		const overlay: Component = component.default;
		return { component: overlay };
	} catch {
		return { component: null, overlays: getOverlays() || [] };
	}
};
