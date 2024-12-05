export interface LiveData {
	type: string;
	lat: number;
	lon: number;
	alt: number;
	time: number;
	dist: number;
	spd: number;
	cad: number;
	hr: number;
	pwr: number;
	avgp: number;
	asc: number;
	desc: number;
	cal: number;
	grd: number;
}

export interface LocationData {
	address: {
		county: string;
		town: string;
		village: string;
	};
}
