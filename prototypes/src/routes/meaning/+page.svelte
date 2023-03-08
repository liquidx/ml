<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import { serverUrl } from '../../lib/dev';
	import { svgForEmbedding } from '../../lib/embedding';

	type EmbeddingCode = {
		embedding: number[];
		svg: string;
		text: string;
	};
	let embeddingCodes: EmbeddingCode[] = [];

	let loading = false;
	let inputClass: string = '';

	$: {
		inputClass = loading ? ' animate-pulse' : '';
	}

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
			loading = true;
			const response = await fetch(requestUrl.toString()).then((response) => response.json());
			loading = false;
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
</script>

<svelte:head>
	<title>Meaning</title>
</svelte:head>

<div class="p-8 font-sans md:w-[800px]">
	<div class="pb-8">
		<a class="underline" href="/">Other Prototypes</a>
	</div>
	<div class="py-4">Embedding Barcodes</div>
	<Input
		placeholder="Type something you want to visualize as an embedding. eg. Espresso"
		on:keyup={onEnter}
		class={'my-4 text-xl ' + inputClass}
		autocomplete="off"
	/>
	<div>
		{#each embeddingCodes as embeddingCode}
			<div class="my-2">
				<div class="text-sm text-gray-400">{embeddingCode.text}</div>
				<div class="my-1">{@html embeddingCode.svg}</div>
			</div>
		{/each}
	</div>
</div>
