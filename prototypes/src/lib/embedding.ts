import * as d3 from 'd3';

export const svgForEmbedding = (embedding: number[]): string => {
	const width = 1000;
	const height = 200;
	const svg = d3.create('svg').attr('width', width).attr('height', height);

	const scaleX = d3
		.scaleLinear()
		.domain([0, embedding.length - 1])
		.range([0, width]);
	const scaleY = d3.scaleLinear().domain([-0.1, 0.1]).range([0, height]);

	for (let i = 0; i < embedding.length; i++) {
		let color: string | undefined = embedding[i] > 0 ? '#ffaaaa' : '#aaaaff';
		color = Math.abs(embedding[i]) > 0.05 ? d3.color(color)?.darker().toString() : color;
		svg
			.append('line')
			.attr('x1', scaleX(i))
			.attr('y1', scaleY(0))
			.attr('x2', scaleX(i))
			.attr('y2', scaleY(embedding[i]))
			.attr('stroke', color ?? 'black');
	}

	svg
		.append('line')
		.attr('x1', 0)
		.attr('y1', height / 2)
		.attr('x2', width)
		.attr('y2', height / 2)
		.attr('stroke', 'red');

	const svgNode = svg.node();
	if (!svgNode) {
		return '';
	}
	return svgNode.outerHTML;
};
