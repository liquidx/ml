<script lang="ts">
	import { Input, Badge } from 'flowbite-svelte';
	import { browser } from '$app/environment';
	import { dot, subtract, sum, square } from 'mathjs';
	import axios from 'axios';
	import { svgForEmbedding } from '$lib/embedding';

	type SubjectCorrelation = {
		subject: string;
		correlation: number;
	};

	type TextEmbedding = {
		text: string;
		embedding: number[];
		svg?: string;
		correlations?: SubjectCorrelation[];
	};

	let chunks: TextEmbedding[] = [];

	let likes: Like[] = [];

	let loading = false;
	let inputClass: string = '';

	$: {
		inputClass = loading ? ' animate-pulse' : '';
	}

	$: {
		if (browser && likes.length == 0) {
			//loading = true;
			// fetchLikes(serverUrl()).then((response) => {
			// 	likes = response;
			// 	loading = false;
			// });
		}
	}

	const correlateChunks = (chunks: TextEmbedding[]) => {
		for (let chunk of chunks) {
			let correlations: SubjectCorrelation[] = [];
			for (let like of likes) {
				//let correlation = sum(subtract(chunk.embedding, like.embedding).map((x) => square(x)));
				let correlation = dot(chunk.embedding, like.embedding);
				correlations.push({ subject: like.text, correlation });
			}
			correlations.sort((a, b) => b.correlation - a.correlation);
			chunk.correlations = correlations;
		}
		return chunks;
	};

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

			const response = await axios.post(
				'/api/url-embeddings', 
				{	url: value })

				console.log(response);
		
			const extractedChunks = []  // response.data
			for (let chunk of extractedChunks) {
				let embedding = chunk.embedding;
				let text = chunk.text;
				let embeddingCode: TextEmbedding = {
					text: text,
					embedding: embedding,
					svg: svgForEmbedding(embedding)
				};
				chunks.push(embeddingCode);
			}
			chunks = correlateChunks(chunks);
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
	<div class="">
		{#each likes as like}
			<Badge large color="dark" class="m-1">{like.text}</Badge>
		{/each}
	</div>
	<div class="py-4">Is this page relevant?</div>
	<Input
		placeholder="URL"
		on:keyup={onEnter}
		class={'my-4 text-xl' + inputClass}
		autocomplete="off"
	/>
	<div>
		{#each chunks as chunk, index}
			<div class="my-2 mb-4 p-3 rounded-md bg-gray-50">
				<div class="text-sm text-gray-400">{chunk.text}</div>
				<div class="my-1">{@html chunk.svg}</div>
				{#if chunk.correlations}
					{#each chunk.correlations as correlation}
						<Badge color="dark" class="m-1"
							>{correlation.subject}: {correlation.correlation.toString().substring(0, 4)}</Badge
						>
					{/each}
				{/if}
			</div>
		{/each}
	</div>
</div>
