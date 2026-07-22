import { getOverlays } from '$lib/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return { overlays: getOverlays() || [] };
};
