<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import * as d3 from 'd3';
	import { exampleEmbedding } from './embedding';

	//	let server = 'http://localhost:11000/embeddings';
	let server = 'https://liquidx-ml.uc.r.appspot.com/predict';

	let output: HTMLDivElement | null = null;

	type EmbeddingCode = {
		embedding: number[];
		svg: string;
		text: string;
	};
	let embeddingCodes: EmbeddingCode[] = [];

	const svgForEmbedding = (embedding: number[]): string => {
		const height = 100;
		const valueScale = 1000;

		const svg = d3.create('svg').attr('viewBox', [0, 0, embedding.length, height]);
		const g = svg.append('g');

		const colorScheme = d3.interpolateOranges;

		svg
			.append('rect')
			.attr('x', 0)
			.attr('y', 50)
			.attr('width', embedding.length)
			.attr('height', 1)
			.attr('fill', '#f00');

		svg
			.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', embedding.length)
			.attr('height', height)
			.attr('fill', 'rgba(0, 0, 0, 0.05)');

		g.selectAll('rect')
			.data(embedding)
			.join('rect')
			.attr('x', (d: number, i: number) => i)
			.attr('y', (d: number, i: number) =>
				d < 0 ? height / 2 : height / 2 - Math.abs(d) * valueScale
			)
			.attr('width', 1)
			.attr('height', (d: number) => Math.abs(d) * valueScale)
			.attr('fill', (d: number) => colorScheme(Math.abs(d) * 10));

		const node = svg.node();
		if (!node) {
			return '';
		}
		return node.outerHTML;
	};

	const onEnter = async (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			const requestUrl = new URL(server);
			const target = e.target;
			let value = '';

			if (target instanceof HTMLInputElement) {
				target.blur();
				value = target.value;
			} else {
				return;
			}

			requestUrl.searchParams.append('text', value);
			const response = await fetch(requestUrl.toString()).then((response) => response.json());
			// if (output && response && response.output) {
			// 	output.innerHTML = response.output;
			// }
			let embedding = response[0].embedding;
			let embeddingCode: EmbeddingCode = {
				embedding,
				svg: svgForEmbedding(embedding),
				text: value
			};
			embeddingCodes.push(embeddingCode);
			console.dir(embeddingCodes, { depth: null });
			embeddingCodes = embeddingCodes;
		}
	};

	$: {
		if (output) {
			// This ensures it doesn't run on the server.
			//console.log('init');
			// let embeddingCode = {
			// 	embedding: exampleEmbedding,
			// 	svg: svgForEmbedding(exampleEmbedding),
			// 	text: 'Coffee Shop'
			// };
			// embeddingCodes.push(embeddingCode);
			// embeddingCodes = embeddingCodes;
		}
	}
</script>

<svelte:head>
	<title>Meaning</title>
</svelte:head>

<div class="p-8 font-sans md:w-[800px]">
	<div class="pb-8">
		<a class="underline" href="/">Other Prototypes</a>
	</div>
	<div class="py-4">Embedding Barcodes</div>
	<Input placeholder="Coffee Shop" on:keyup={onEnter} class="my-4 text-xl" autocomplete="off" />
	<div>
		{#each embeddingCodes as embeddingCode}
			<div class="my-2">
				<div class="text-sm text-gray-400">{embeddingCode.text}</div>
				<div class="my-1">{@html embeddingCode.svg}</div>
			</div>
		{/each}
	</div>
	<div bind:this={output} />
</div>
