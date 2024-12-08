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
		country: string;
		town: string;
		village: string;
	};
}

export interface DataPoint {
	altitude: number;
	cadence: number;
	distance: number;
	enhanced_altitude: number;
	enhanced_speed: number;
	heart_rate: number;
	speed: number;
	position_lat: number;
	position_long: number;
}

export interface FitData {
	activity: {
		sessions: {
			laps: {
				records: DataPoint[];
			}[];
		}[];
	};
}
