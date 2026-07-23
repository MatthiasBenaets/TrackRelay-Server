<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let { data, pos, alt }: { data: [number, number][]; pos: number; alt: number } = $props();

	let chart: SVGSVGElement;
	let xScale: d3.ScaleLinear<number, number>;
	let yScale: d3.ScaleLinear<number, number>;

	const width = 1920 / 2.5;
	const height = 200;
	const margin = { top: 10, right: 200, bottom: 0, left: 0 };

	// Create D3 chart
	function renderChart() {
		d3.select(chart).selectAll('*').remove();

		if (data.length === 0) return;

		const svg = d3
			.select(chart)
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`);

		// Elevation linear X scale
		xScale = d3
			.scaleLinear()
			.domain([0, data[data.length - 1][0]])
			.range([0, width - margin.right]);

		// Distance Y scale
		yScale = d3
			.scaleLinear()
			.domain([
				d3.min(data, function (d) {
					return d[1];
				}),
				(d3.max(data, function (d) {
					return d[1];
				}) || 0) + margin.top
			] as number[])
			.range([height, 0]);

		//Fill
		svg
			.append('path')
			.datum(data)
			.style('fill', 'rgba(255, 255, 255, 0.4)')
			.style('stroke', 'none')
			.attr(
				'd',
				d3
					.area()
					.x((d) => xScale(d[0]))
					.y0(yScale(0))
					.y1((d) => yScale(d[1]))
			);

		// Line
		svg
			.append('path')
			.datum(data)
			.attr('class', 'line')
			.style('fill', 'none')
			.style('stroke', 'white')
			.style('stroke-width', 2)
			.style('stroke-linecap', 'butt')
			.attr(
				'd',
				d3
					.line()
					.x((d) => xScale(d[0]))
					.y((d) => yScale(d[1]))
			);

		// Position Marker
		svg
			.append('circle')
			.attr('id', 'moving-dot')
			.attr('r', 5)
			.style('fill', 'white')
			.style('filter', 'drop-shadow(0px 0px 5px black)');

		svg
			.append('text')
			.attr('id', 'dot-label')
			.attr('x', xScale(data[pos][0]) + 10)
			.attr('y', yScale(data[pos][1]))
			.style('fill', 'white')
			.style('font-size', '20px')
			.style('text-shadow', 'black 1px 0 5px')
			.text(`${Math.round(alt * 1000)} M`);

		svg
			.append('text')
			.attr('id', 'dot-label2')
			.attr('x', xScale(data[pos][0]) + 10)
			.attr('y', yScale(data[pos][1]) - 20)
			.style('fill', 'white')
			.style('font-size', '20px')
			.style('text-shadow', 'black 1px 0 5px')
			.text(`${Math.round(alt * 3280)} FT`);
	}

	function updateDot() {
		if (data[pos]) {
			const dot = d3.select('#moving-dot');
			const [x, y] = data[pos];
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

<div class="gradient-right">
	<svg bind:this={chart}></svg>
</div>

<style>
	.gradient-right {
		mask-image: linear-gradient(to right, black 62%, transparent 74%);
		-webkit-mask-image: linear-gradient(to right, black 62%, transparent 74%);
	}
</style>
