<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import { serverUrl } from '../../lib/dev';
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

			const prompt = constructPrompt(value);

			const requestUrl = new URL(`${serverUrl()}/completion`);
			requestUrl.searchParams.append('prompt', prompt);
			requestUrl.searchParams.append('model', 'gpt-3.5-turbo'); // text-davinci-003
			loading = true;
			const response = await fetch(requestUrl.toString()).then((response) => response.json());
			loading = false;
			if (output && response && response.output) {
				output.innerHTML = response.output;
			}
			console.log(response);
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
