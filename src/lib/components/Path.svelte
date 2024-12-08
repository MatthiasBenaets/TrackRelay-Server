<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let { data, pos } = $props();

	let chart: SVGSVGElement;
	let xScale: d3.ScaleLinear<number, number>;
	let yScale: d3.ScaleLinear<number, number>;
	let margin = { top: 10, right: 10, bottom: 10, left: 10 };

	let width = $state(500);
	let height = $state(500);

	// Create D3 chart
	function renderChart() {
		d3.select(chart).selectAll('*').remove();

		if (data.length === 0) return;

		const svg = d3
			.select(chart)
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`);

		const lats = data.map((p: [number, number]) => p[0]);
		const longs = data.map((p: [number, number]) => p[1]);

		const minLat: number = Number(d3.min(lats));
		const maxLat: number = Number(d3.max(lats));
		const minLong: number = Number(d3.min(longs));
		const maxLong: number = Number(d3.max(longs));

		const initialWidth = maxLong - minLong;
		const initialHeight = (maxLat - minLat) * 2;
		if (initialWidth >= initialHeight) {
			height = (500 / initialWidth) * initialHeight;
		} else {
			width = (500 / initialHeight) * initialWidth;
		}

		// Longitude linear X scale
		xScale = d3
			.scaleLinear()
			.domain([minLong, maxLong])
			.range([0 + margin.left, width - margin.right]);

		// Latitude Y scale
		yScale = d3
			.scaleLinear()
			.domain([minLat, maxLat])
			.range([height - margin.bottom, 0 + margin.top]);

		// Draw path
		const line = d3
			.line<[number, number]>()
			.x((d) => xScale(d[1]))
			.y((d) => yScale(d[0]));
		svg
			.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', 'white')
			.attr('stroke-width', 4)
			.style('filter', 'drop-shadow(0px 0px 5px black)')
			.attr('d', line);

		svg
			.append('circle')
			.attr('id', 'moving-dot2')
			.attr('r', 8)
			.style('fill', 'white')
			.style('stroke', 'black')
			.style('stroke-width', 4);
	}

	function updateDot() {
		if (data[pos]) {
			const dot = d3.select('#moving-dot2');
			const [y, x] = data[pos];
			dot.attr('cx', xScale(x)).attr('cy', yScale(y));
		}
	}

	onMount(() => {
		renderChart();
	});

	$effect(() => {
		if (data.length) {
			renderChart();
			updateDot();
		}
	});
</script>

<svg bind:this={chart}></svg>
