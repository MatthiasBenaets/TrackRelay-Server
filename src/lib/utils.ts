export function getOverlays(): string[] {
	const overlays = import.meta.glob('$lib/overlays/*.svelte');
	return Object.keys(overlays).map((key) => key.split('/').pop()!.replace('.svelte', ''));
}
