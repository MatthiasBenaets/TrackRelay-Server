<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { env } from '$env/dynamic/public';
	import { zones } from '$lib/utils';

	let { pwr, hr } = $props();

	let chart: SVGSVGElement;

	// Create D3 chart
	function renderChart() {
		d3.select(chart).selectAll('*').remove();

		if (pwr.length === 0 || hr.length === 0) return;

		const width = 1920;
		const height = 200;
		const margin = { top: 20, right: 20, bottom: 20, left: 30 };

		const svg = d3
			.select(chart)
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`);

		// Get the last 10 min of data
		const pwrData: number[] = pwr.slice(
			Math.max(0, pwr.length - 600 / Number(env.PUBLIC_REFRESH_RATE))
		);
		const hrData: number[] = hr.slice(
			Math.max(0, hr.length - 600 / Number(env.PUBLIC_REFRESH_RATE))
		);

		// General linear X scale
		const xScale = d3
			.scaleLinear()
			.domain([0, pwrData.length - 1])
			.range([0, width]);

		// Power Y scale
		const yScalePwr = d3
			.scaleLinear()
			.domain([0, 800])
			.range([height, 0 + margin.top]);

		// Heartrate Y scale
		const yScaleHr = d3.scaleLinear().domain([50, 220]).range([height, 0]);

		// Power bars
		svg
			.selectAll('rect')
			.data(pwrData)
			.enter()
			.append('rect')
			.attr('x', (_, i) => xScale(i)!)
			.attr('y', (d: number) => yScalePwr(d))
			.attr('width', (_, i) => {
				// Calculate the width based on the spacing between points
				if (i < pwrData.length - 1) {
					return xScale(i + 1) - xScale(i);
				}
				return width - xScale(i);
			})
			.attr('height', (d) => height - yScalePwr(d))
			.attr('fill', (d) => {
        // Color bars based on zones
				if (d < zones[0]) return 'rgb(107 114 128)';
				else if (d < zones[1]) return 'rgb(107 114 128)';
				else if (d < zones[2]) return 'rgb(34 197 94)';
				else if (d < zones[3]) return 'rgb(234 179 8)';
				else if (d < zones[4]) return 'rgb(249 115 22)';
				else return 'rgb(239 68 68)';
			});

		// Heartrate line
		const line = d3
			.line<number>()
			.x((_, i) => xScale(i))
			.y((d) => yScaleHr(d));
		svg
			.append('path')
			.datum(hrData)
			.attr('fill', 'none')
			.attr('stroke', 'red') // Color for the line
			.attr('stroke-width', 2)
			.attr('d', line);

		// Axis
		const yAxisPwr = d3.axisLeft(yScalePwr).ticks(5);
		svg
			.append('g')
			.attr('transform', `translate(40, -5)`)
			.attr('color', 'white')
			.call(yAxisPwr)
			.attr('font-size', 15);
		const yAxisHr = d3.axisLeft(yScaleHr).ticks(5);
		svg
			.append('g')
			.attr('transform', `translate(${width}, -7)`)
			.attr('color', 'white')
			.call(yAxisHr)
			.attr('font-size', 15);

		// Grid lines
		svg
			.selectAll('.grid')
			.data(yScalePwr.ticks(5))
			.enter()
			.append('line')
			.attr('class', 'grid')
			.attr('x1', margin.left)
			.attr('x2', width)
			.attr('y1', (d) => yScalePwr(d))
			.attr('y2', (d) => yScalePwr(d))
			.attr('stroke', 'white')
			.attr('stroke-opacity', 0.5)
			.attr('stroke-dasharray', '4, 4');

		d3.selectAll('.domain,.tick line').remove();
	}

	onMount(() => {
		renderChart();
	});

	$effect(() => {
		if (pwr.length && hr.length) {
			renderChart();
		}
	});
</script>

<div class="opacity-75">
	<svg bind:this={chart}></svg>
</div>
