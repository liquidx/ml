<script lang="ts">
	import JamDialog from '$lib/components/app/JamDialog.svelte';
	import type { JamConfig } from '$lib/jamconfig';
	import { latestUserDialog } from '$lib/jamconfig';

	let jammerSimple : JamConfig = {
		initialPrompt: 'You are a professional at guiding people through a complex problem. Give a follow up clarifying question in a single sentence. Include examples.'
	}

	let jammerDynamic : JamConfig = {
		initialPrompt: 'Think carefully and plan out the steps. Give a follow up clarifying question in a single sentence. Include examples.'
	}

</script>

<svelte:head>
	<title>Jam</title>
</svelte:head>

<div class="p-8 font-sans h-screen text-primary bg-secondary relative">
	<div class="pb-8">
		<a class="underline" href="/">Other Prototypes</a>
	</div>
	<div class="my-4 text-xl">Jam</div>
	<div class="flex flex-row flex-nowrap gap-4">
		<JamDialog config={jammerSimple}/>
		<JamDialog config={jammerDynamic}/>
	</div>
</div>
