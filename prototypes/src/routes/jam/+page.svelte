<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { browser } from '$app/environment';
	import axios from 'axios';
	import { GoogleGenerativeAI, type GenerateContentRequest, type GenerateContentResult } from '@google/generative-ai';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { PUBLIC_GEMINI_API_KEY } from '$env/static/public'


	interface Dialog {
		role: string;
		text: string;
	}

	let loading = false;
	let inputClass: string = '';
	let errorMessage: string = '';

	let initialPrompt = `
You are a professional at guiding people through a complex problem.
	 
Give a follow up clarifying question in a single sentence. Include examples.`.trim()

	let chatInput = '';
	let dialogTurns : Dialog[] = [];

	let genai = new GoogleGenerativeAI(PUBLIC_GEMINI_API_KEY)

	// type Model = {
	// 	name: string;
	// 	modelId: string;
	// 	useOllama: boolean;
	// };

	// const models : Model[] = [
	// 	{ name: 'Gemini 1.5 Pro', modelId: 'gemini-1.5-pro-latest', useOllama: false},
	// 	{ name: 'Gemini 1.5 Flash', modelId: 'gemini-1.5-flash-latest', useOllama: false},
	// 	{ name: 'GPT-4 Turbo', modelId: 'gpt-4-turbo', useOllama: false },
	// 	{ name: 'Claude 3 Opus', modelId: 'claude-3-opus-20240229', useOllama: false},
	// 	{ name: 'Claude 3 Haiku', modelId: 'claude-3-haiku-20240307', useOllama: false},
	// ]

	$: {
		inputClass = loading ? ' animate-pulse' : '';
	}

	const constructRequest = () : GenerateContentRequest => {
		let request :GenerateContentRequest = {
			contents: []
		}

		// Put in the inital prompt
		request.contents.push({
			role: 'user',
			parts: [
				{text: initialPrompt}
			]
		})

		// Insert the rest of the dialog into the prompt
		dialogTurns.forEach((dialogItem) => {
			request.contents.push({
				role: dialogItem.role,
				parts: [
					{text: dialogItem.text}
				]
			})
		})
		return request;
	}

	const continueChat = async (input: string) => {
		dialogTurns.push({role: 'user', text: input})
		dialogTurns = dialogTurns;
		loading = true;

		let model = genai.getGenerativeModel({model: 'gemini-1.5-pro-latest'})
		let request = constructRequest();
		let response = await model.generateContent(request) as GenerateContentResult
		loading = false;

		if (response.response && response.response.candidates) {
			let candidate = response.response.candidates[0]
			let content = candidate.content;
			let part = content.parts[0];
			if (part && part.text) {
				dialogTurns.push({role: 'model', text: part.text})
				dialogTurns = dialogTurns;
			}
		} else {
			errorMessage = 'No response found';
			console.log(response);
		}

	}

	const onEnter = async (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			loading = true;
			let text = chatInput.trim();
			chatInput = '';
			continueChat(text)
			loading = false;
		}
	};
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
		<div class="flex flex-col justify-between w-[400px] border-t py-4">
			<div class="py-4">
				{#each dialogTurns as item}
				<div class="py-2">
					<div class="text-secondary-foreground text-xs">{item.role}</div>
					<div class="text-primary">{item.text}</div>

				</div>
				{/each}

			</div>
			<div><Input bind:value={chatInput} on:keydown={onEnter} /></div>
		</div>
		<div class="flex flex-col justify-between w-[400px] border-t py-4">
			<div class="py-4">Initial Prompt</div>
			<Textarea bind:value={initialPrompt} on:keydown={onEnter} rows={10} class={inputClass} />
		</div>

	</div>
</div>
