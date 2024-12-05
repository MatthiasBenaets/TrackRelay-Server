<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { zones } from '$lib/utils';

	let {
		pwr,
		width = 800,
		height = 100
	}: { pwr: number[]; width?: number; height?: number } = $props();

	let chart: SVGSVGElement;
	const margin = { top: 40, right: 0, bottom: 20, left: 0 };

	// Create D3 chart
	function renderChart() {
		d3.select(chart).selectAll('*').remove();

		if (pwr.length === 0) return;

		const svg = d3
			.select(chart)
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`);

		// Calculate power datapoints for each zone
		const zoneCounts = zones.map((zone, i) => {
			const lowerBound = i === 0 ? 0 : zones[i - 1].power; // Get lower bound of zone
			return pwr.filter((value) => value >= lowerBound && value < zone.power).length;
		});

		// Get zone of current power
		let currentPower = pwr[pwr.length - 1];
		let lastValueZoneIndex = -1;
		for (let i = 0; i < zones.length; i++) {
			const lowerBound = i === 0 ? 0 : zones[i - 1].power;
			if (currentPower >= lowerBound && currentPower < zones[i].power) {
				lastValueZoneIndex = i;
				break;
			}
		}

		// Total count for scaling
		const total = zoneCounts.reduce((sum, count) => sum + count, 0);

		// General linear X scale
		const xScale = d3
			.scaleLinear()
			.domain([0, total])
			.range([margin.left, width - margin.right]);

		// Formatted chart data
		let accumulated = 0;
		const stackedData = zoneCounts.map((count, i) => {
			const start = accumulated;
			accumulated += count;
			return {
				start,
				end: accumulated,
				color: zones[i].color,
				isHighlighted: i === lastValueZoneIndex // Zone that should be highlighted
			};
		});

		// Stacked bars
		svg
			.selectAll('rect')
			.data(stackedData)
			.enter()
			.append('rect')
			.attr('x', (d) => xScale(d.start))
			.attr('y', (d) => (d.isHighlighted ? 0 : margin.top))
			.attr('width', (d) => xScale(d.end) - xScale(d.start))
			.attr('height', (d) =>
				d.isHighlighted ? height - margin.bottom : height - margin.top - margin.bottom
			)
			.attr('fill', (d) => d.color);
	}

	onMount(() => {
		renderChart();
	});

	$effect(() => {
		if (pwr.length) {
			renderChart();
		}
	});
</script>

<svg
	width="100%"
	{height}
	viewBox="0 0 {width} {height}"
	style:max-width="100%"
	style:height="auto"
	bind:this={chart}
></svg>
