<script lang="ts">
	import { browser } from '$app/environment';
	import axios from 'axios';
	import { Input, Badge } from 'flowbite-svelte';
import type { Like } from '$lib/likes';

	let output: HTMLDivElement | null = null;

	let likes: Like[] = [];
	let initialized = false;

	let loading = false;
	let inputClass: string = '';
	let likeInput : string = '';

	$: {
		inputClass = loading ? ' animate-pulse' : '';
	}

	const getLikes = async () => {
		const response = await axios.get('/api/likes');
		if (response.data && response.data.likes) {
			likes = response.data.likes as Like[];
		} else {
			console.error('No likes found')
		}
	}

	const addLike = async (text: string) => {
		const response = await axios.put('/api/likes', { text });
		let like = response.data as Like
		console.log(response.data)
		likes.push(like);
		likes = likes;  // force refresh.
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

			await addLike(value);
			likeInput = '';

			if (target instanceof HTMLInputElement) {
				target.focus();
			}
		}
	};

	const onDismiss = (e: Event) => {
		console.log(e);
	};

	$: {
		if (!initialized && browser) {
			loading = true;
			getLikes().finally(() => {
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
		bind:value={likeInput}
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
