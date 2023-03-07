<script lang="ts">
	import { Alert } from 'flowbite-svelte';
	import { Input, Label, Helper } from 'flowbite-svelte';

	let server = 'http://localhost:11000/predict';
	let output: HTMLDivElement | null = null;

	const onEnter = async (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			let requestUrl = new URL(server);
			requestUrl.searchParams.append('prompt', e.target.value);
			const response = await fetch(requestUrl.toString()).then((response) => response.json());
			if (output && response && response.output) {
				output.innerHTML = response.output;
			}
			console.log(response);
		}
	};
</script>

<div class="p-8">
	Explain to me...
	<Input placeholder="World Cup" on:keyup={onEnter} />
	<div bind:this={output} />
</div>
