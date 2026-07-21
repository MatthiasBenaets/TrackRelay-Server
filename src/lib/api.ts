import { env } from '$env/dynamic/public';

export async function fetchLiveData() {
	try {
		const response = await fetch('/api/live', {
			headers: {
				Authorization: env.PUBLIC_API_TOKEN || ''
			}
		});
		if (!response.ok) {
			throw new Error('Failed to fetch live activity data');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching live activity data:', error);
	}
}

export async function fetchLocationData(lat: number, lon: number) {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
			{
				headers: {
					'User-Agent':
						'TrackRelay-Server/1.0 (https://github.com/matthiasbenaets/TrackRelay-server)',
					Accept: 'application/json'
				}
			}
		);
		if (!response.ok) {
			throw new Error('Failed to fetch live activity data');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching live activity data:', error);
	}
}
