export async function fetchLiveData() {
	try {
		const response = await fetch('/api/live');
		if (!response.ok) {
			throw new Error('Failed to fetch live activity data');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching live activity data:', error);
	}
}
