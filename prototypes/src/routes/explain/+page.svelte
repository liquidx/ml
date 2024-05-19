<script lang="ts">
	import { Checkbox, Input } from 'flowbite-svelte';
	import { browser } from '$app/environment';
	import axios from 'axios';
	import { mode } from 'd3';

	let modelOutput: {[modelId: string]: HTMLDivElement} = {}

	let loading = false;
	let inputClass: string = '';
	let canUseOllama = false;
	let useOllama = false;

	type Model = {
		name: string;
		modelId: string;
		useOllama: boolean;
	};

	const models : Model[] = [
		{ name: 'GPT-4 Turbo', modelId: 'gpt-4-turbo', useOllama: false },
		{ name: 'GPT-3.5', modelId: 'gpt-3.5-turbo-0125', useOllama: false},
		{ name: 'Ollama Llama3', modelId: 'llama3:latest', useOllama: true },
	]

	let validModels : Model[] = models;

	let subjectText = '';

	$: {
		inputClass = loading ? ' animate-pulse' : '';
		validModels = models.filter((model) => !model.useOllama || model.useOllama === canUseOllama);
	}

	$: {
		if (browser) {
			const isLocalhost = window.location.hostname === 'localhost';
			canUseOllama = isLocalhost;
		}
	}

	const constructPrompt = (subject: string) => {
		return `Explain a subject to a 18 year old in three sentences. If you are not sure, then say, "I don't know."
   Subject: ${subject}
   Explanation:`;
	};

	const requestExplanation = async (subject: string, model: Model) => {
		const prompt = constructPrompt(subject);
		const response = await axios.get('/api/generate', {
			params: {
				useOllama: model.useOllama.toString(),
				model: model.modelId,
				prompt,
			},
		});

		if (response && response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message.content) {
			const output = modelOutput[model.modelId];
			if (!output) {
				return;
			}
			output.innerHTML = response.data.choices[0].message.content;
		}
	};

	const onEnter = async (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			loading = true;
			// Create request for each model.
			for (const model of validModels) {
				modelOutput[model.modelId].innerHTML = '';
				requestExplanation(subjectText, model)
			}
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Explain</title>
</svelte:head>

<div class="p-8 font-sans">
	<div class="pb-8">
		<a class="underline" href="/">Other Prototypes</a>
	</div>
	<div class="my-4 text-xl">Explain to me...</div>
	<div class="flex flex-row flex-nowrap gap-4">
		{#each validModels as model (model.name)}
			<div class="w-64">
				<Input
				placeholder="World Cup"
				on:keyup={onEnter}
				bind:value={subjectText}
				class={'my-4 text-xl' + inputClass}
				autocomplete="off"
				/>
				<div class="text-xs text-gray-300">{model.name}</div>
				<div class="text-xl" bind:this={modelOutput[model.modelId]} />
			</div>
		{/each}
	</div>
	

</div>
