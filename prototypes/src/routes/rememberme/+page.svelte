<script lang="ts">
	import { browser } from '$app/environment';

	import { Input, Badge } from 'flowbite-svelte';

	let output: HTMLDivElement | null = null;

	let likes: Like[] = [];
	let initialized = false;

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

			const requestUrl = new URL(`${serverUrl()}/remember/likes/add`);
			requestUrl.searchParams.append('text', value);
			const response = await fetch(requestUrl.toString()).then((response) => response.json());
			likes = response.likes;
			target.value = '';

			if (target instanceof HTMLInputElement) {
				target.focus();
				target.value = '';
			}
		}
	};

	const onDismiss = (e: Event) => {
		console.log(e);
	};

	$: {
		if (!initialized && browser) {
			loading = true;
			fetchLikes(serverUrl()).then((response) => {
				likes = response;
				initialized = true;
				loading = false;
			});
		}
	}
</script>

<svelte:head>
	<title>Remember Me</title>
</svelte:head>

<div class="p-8 font-sans md:w-[800px]">
	<div class="pb-8">
		<a class="underline" href="/">Other Prototypes</a>
	</div>
	<div class="py-4">Describe Myself</div>
	<Input
		placeholder="What do I like?"
		on:keyup={onEnter}
		class={'my-4 text-xl ' + inputClass}
		autocomplete="off"
	/>
	<div class="">
		{#each likes as like}
			<Badge dismissable large color="dark" on:dismiss={onDismiss} class="m-1">{like.text}</Badge>
		{/each}
	</div>
	<div bind:this={output} />
</div>
