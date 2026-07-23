import type { z } from 'zod';
import type { liveDataSchema } from '$lib/utils';

export type LiveData = z.infer<typeof liveDataSchema>;

export interface LocationData {
	address: {
		country: string;
		town: string;
		village: string;
	};
}

export interface DataPoint {
	timestamp?: Date | string | number;
	position_lat?: number;
	position_long?: number;
	distance?: number;
	altitude?: number;
	enhanced_altitude?: number;
	speed?: number;
	enhanced_speed?: number;
	heart_rate?: number;
	cadence?: number;
	power?: number;
	total_ascent?: number;
	total_descent?: number;
	calories?: number;
	timer_time?: number;
	elapsed_time?: number;
	accumulated_power?: number;
}

export interface FitSession {
	laps?: {
		records?: DataPoint[];
	}[];
	records?: DataPoint[];
}

export interface FitActivity {
	sessions?: FitSession[];
}

export interface FitData {
	activity?: FitActivity;
	records?: DataPoint[];
}
