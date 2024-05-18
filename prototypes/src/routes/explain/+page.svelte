<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import axios from 'axios';

	let output: HTMLDivElement | null = null;

	let loading = false;
	let inputClass: string = '';

	$: {
		inputClass = loading ? ' animate-pulse' : '';
	}

	const constructPrompt = (subject: string) => {
		return `Explain a subject to a 18 year old in three sentences. If you are not sure, then say, "I don't know."
   Subject: ${subject}
   Explanation:`;
	};

	const requestExplanation = async (subject: string) => {
		const prompt = constructPrompt(subject);
		const response = await axios.get('/api/generate', {
			params: {
				prompt,
			},
		});

		if (response && response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message.content) {
			if (!output) {
				return;
			}
			output.innerHTML = response.data.choices[0].message.content;
		}
	};

	const onEnter = async (e: KeyboardEvent) => {
		if (!output) {
			return;
		}
		if (e.key === 'Enter') {
			const target = e.target;
			let value = '';

			if (target instanceof HTMLInputElement) {
				target.blur();
				value = target.value;
			} else {
				return;
			}
			loading = true;
			await requestExplanation(value);
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Explain</title>
</svelte:head>

<div class="p-8 font-sans md:w-96">
	<div class="pb-8">
		<a class="underline" href="/">Other Prototypes</a>
	</div>
	<div class="my-4 text-xl">Explain to me...</div>
	<Input
		placeholder="World Cup"
		on:keyup={onEnter}
		class={'my-4 text-xl' + inputClass}
		autocomplete="off"
	/>
	<div class="text-xl" bind:this={output} />
</div>
