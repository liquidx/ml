<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import { serverUrl } from '../../lib/dev';
	import { svgForEmbedding } from '../../lib/embedding';

	let output: HTMLDivElement | null = null;

	type EmbeddingCode = {
		embedding: number[];
		svg: string;
		text: string;
	};
	let embeddingCodes: EmbeddingCode[] = [];

	const onEnter = async (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			const target = e.target;
			let value = '';

			if (target instanceof HTMLInputElement) {
				target.blur();
				value = target.value;
			} else {
				return;
			}

			const requestUrl = new URL(`${serverUrl()}/embeddings/get`);
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
